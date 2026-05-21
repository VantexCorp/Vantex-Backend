/**
 * @file Controlador que gestiona las rutas de la tabla 'Work Orders'.
 * @module controller/workOrder
 */

const workOrderService = require('../services/work_order.service');

/**
 * Obtiene todas las órdenes de trabajo.
 */
async function getAll(req, res) {
    try {
        // Extraemos los posibles parámetros de búsqueda de la URL (req.query)
        const filters = {
            status: req.query.status,
            technician_id: req.query.technician_id,
            machine_id: req.query.machine_id,
            search: req.query.search
        };

        const orders = await workOrderService.findAllWorkOrders(filters);
        res.json(orders);
    } catch (error) {
        console.error('[WorkOrderCtrl - getAll] Error:', error);
        res.status(500).json({ error: 'Internal error fetching work orders' });
    }
}

/**
 * Obtiene una orden de trabajo por su ID.
 */
async function getById(req, res) {
    try {
        const order = await workOrderService.findWorkOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Work order not found' });
        }
        
        res.json(order);
    } catch (error) {
        console.error('[WorkOrderCtrl - getById] Error:', error);
        res.status(500).json({ error: 'Error searching for work order' });
    }
}

/**
 * Crea una nueva orden de trabajo.
 */
async function create(req, res) {
    try {
        const newOrder = await workOrderService.addWorkOrder(req.body);
        res.status(201).json({
            message: 'Work order created successfully',
            data: newOrder
        });
    } catch (error) {
        console.error('[WorkOrderCtrl - create] Error:', error);
        res.status(500).json({ error: 'Error creating work order' });
    }
}

/**
 * Inicia una orden de trabajo.
 */
async function start(req, res) {
    try {
        await workOrderService.startWorkOrder(req.params.id);
        res.json({ message: 'Orden iniciada correctamente. El tiempo está corriendo.' });
    } catch (error) {
        console.error('[WorkOrderCtrl - start] Error:', error);
        res.status(500).json({ error: 'Error starting order' });
    }
}

/**
 * Cierra una orden de trabajo.
 */
async function close(req, res) {
    try {
        const woId = req.params.id;
        const { resolution_comment, partsUsed } = req.body;

        await workOrderService.completeWorkOrder(
            woId, 
            { resolution_comment }, 
            partsUsed
        );

        res.json({ message: 'Orden cerrada y consumos registrados correctamente' });
    } catch (error) {
        console.error('[WorkOrderCtrl - close] Error:', error);
        
        
        const errorMessage = error.sqlMessage || error.message || 'Error al cerrar la orden';
        
        res.status(400).json({ error: errorMessage });
    }
}

/**
 * Actualiza una orden de trabajo.
 */
async function update(req, res) {
    try {
        const updatedOrder = await workOrderService.updateWorkOrder(req.params.id, req.body);
        res.json({ message: 'Orden de trabajo actualizada correctamente', data: updatedOrder });
    } catch (error) {
        console.error('[WorkOrderCtrl - update] Error:', error);
        const status = error.status || 500;
        res.status(status).json({ error: error.message || 'Error al actualizar la orden de trabajo' });
    }
}

/**
 * Elimina una orden de trabajo.
 */
async function remove(req, res) {
    try {
        const order = await workOrderService.findWorkOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Work order not found' });
        }
        
        if (order.status !== 'open') {
            return res.status(400).json({ 
                error: 'Cannot delete an order that has already been started or closed. To avoid inventory imbalances, you must cancel it.' 
            });
        }

        await workOrderService.deleteWorkOrder(req.params.id);
        res.json({ message: 'Orden de trabajo eliminada correctamente' });
    } catch (error) {
        console.error('[WorkOrderCtrl - delete] Error:', error);
        res.status(500).json({ error: 'Error deleting work order' });
    }
}

module.exports = {
    getAll,
    getById,
    create,
    start,
    close,
    update,
    remove
};