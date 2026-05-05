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
        res.status(500).json({ error: 'Error interno al obtener las órdenes de trabajo' });
    }
}

/**
 * Obtiene una orden de trabajo por su ID.
 */
async function getById(req, res) {
    try {
        const order = await workOrderService.findWorkOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
        }
        
        res.json(order);
    } catch (error) {
        console.error('[WorkOrderCtrl - getById] Error:', error);
        res.status(500).json({ error: 'Error al buscar la orden de trabajo' });
    }
}
