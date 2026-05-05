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

