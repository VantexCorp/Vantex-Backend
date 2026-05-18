/**
 * @file Rutas para la gestión de órdenes de trabajo.
 * @module routes/work_order
 */
const express = require('express');
const router = express.Router();
const workOrderController = require('../controllers/work_order.controller');
const { validateCreateWorkOrder, validateCloseWorkOrder, validateUpdateWorkOrder } = require('../validators/work_order.validator');

const { handleValidationErrors } = require('../middlewares/error.middleware');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

// GET /api/work_orders
router.get('/', authenticateToken, workOrderController.getAll);

// GET /api/work_orders/:id
router.get('/:id', authenticateToken, workOrderController.getById);

// POST /api/work_orders
router.post('/', authenticateToken, validateCreateWorkOrder, handleValidationErrors, workOrderController.create);

// PUT /api/work_orders/:id/start
router.put('/:id/start', authenticateToken, workOrderController.start);

// PUT /api/work_orders/:id/close
router.put('/:id/close', authenticateToken, validateCloseWorkOrder, handleValidationErrors, workOrderController.close);

// PUT /api/work_orders/:id
router.put('/:id', authenticateToken, validateUpdateWorkOrder, handleValidationErrors, workOrderController.update);

// DELETE /api/work_orders/:id
router.delete('/:id', authenticateToken,authorizeRoles('admin', 'maintenance_manager'), workOrderController.remove);

module.exports = router;