/**
 * @file Servicio que gestiona las consultas SQL de la tabla 'Work Orders'.
 * @module service/workOrder
 */

const db = require('../config/database');

async function findAllWorkOrders(filters = {}) {
    const query = db('work_orders')
        .select(
            'work_orders.*',
            'users.full_name as technician_name',
            'machines.name as machine_name'
        )
        .leftJoin('users', 'work_orders.technician_id', 'users.id')
        .leftJoin('machines', 'work_orders.machine_id', 'machines.id');

    if (filters.status) {
        query.where('work_orders.status', filters.status);
    }
    if (filters.technician_id) {
        query.where('work_orders.technician_id', filters.technician_id);
    }
    if (filters.machine_id) {
        query.where('work_orders.machine_id', filters.machine_id);
    }
    
    if (filters.search) {
        query.where(function() {
            this.where('work_orders.wo_code', 'like', `%${filters.search}%`)
                .orWhere('work_orders.issue_description', 'like', `%${filters.search}%`);
        });
    }

    return await query.orderBy('work_orders.opened_at', 'desc');
}

async function findWorkOrderById(id) {
    const order = await db('work_orders')
        .select(
            'work_orders.*',
            'users.full_name as technician_name',
            'machines.name as machine_name'
        )
        .leftJoin('users', 'work_orders.technician_id', 'users.id')
        .leftJoin('machines', 'work_orders.machine_id', 'machines.id')
        .where({ 'work_orders.id': id })
        .first();

    if (!order) return null;

    const materials = await db('material_used')
        .select(
            'material_used.quantity_used',
            'material_used.applied_price',
            'spare_parts.name as part_name',
            'spare_parts.sku'
        )
        .join('spare_parts', 'material_used.id_part', 'spare_parts.id')
        .where({ id_work_order: id });

    order.used_materials = materials;

    return order;
}

async function addWorkOrder(woData) {
    const wo_code = woData.wo_code || `WO-${Date.now().toString().slice(-6)}`;
    
    const [id] = await db('work_orders').insert({
        ...woData,
        wo_code,
        status: 'open'
    });
    
    return { id, wo_code };
}

async function startWorkOrder(id) {
    return await db('work_orders')
        .where({ id })
        .update({
            status: 'in_progress',
            started_at: db.fn.now()
        });
}

async function completeWorkOrder(woId, resolutionData, partsUsed = []) {
    return await db.transaction(async (trx) => {
        await trx('work_orders')
            .where({ id: woId })
            .update({
                status: 'closed',
                resolution_comment: resolutionData.resolution_comment,
                time_spent_minutes: resolutionData.time_spent_minutes,
                closed_at: db.fn.now()
            });

        if (partsUsed && partsUsed.length > 0) {
            for (const part of partsUsed) {
                await trx.raw('CALL sp_registrar_material_usado(?, ?, ?)', [
                    woId, 
                    part.id_part, 
                    part.quantity_used
                ]);
            }
        }

        return { success: true };
    });
}

async function updateWorkOrder(id, rawData) {
    const { machine_id, technician_id, issue_description } = rawData;
    const safeData = {};

    if (machine_id !== undefined) safeData.machine_id = machine_id;
    if (technician_id !== undefined) safeData.technician_id = technician_id;
    if (issue_description !== undefined) safeData.issue_description = issue_description;

    if (Object.keys(safeData).length === 0) {
        throw { status: 400, message: "No hay campos válidos para actualizar" };
    }

    const updatedRows = await db('work_orders').where({ id }).update(safeData);
    if (updatedRows === 0) {
        throw { status: 404, message: "Orden de trabajo no encontrada" };
    }

    return await findWorkOrderById(id);
}

async function deleteWorkOrder(id) {
    return await db('work_orders').where({ id }).del();
}

module.exports = {
    findAllWorkOrders,
    findWorkOrderById,
    addWorkOrder,
    startWorkOrder,
    completeWorkOrder,
    updateWorkOrder,
    deleteWorkOrder
};