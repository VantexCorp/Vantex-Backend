/**
 * @file Rutas para el CRUD de repuestos (Spare Parts).
 * @module routes/spare_part
 */

const express = require('express');
const router = express.Router();
const sparePartController = require('../controllers/spare_part.controller');
const {
    validateCreateSparePart,
    validateUpdateSparePart
} = require('../validators/spare_part.validator');
const { handleValidationErrors } = require('../middlewares/error.middleware');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const { validateIdParam } = require('../validators/common.validator');

// GET /api/spare-parts -> Obtener lista completa o filtrar (Público)
router.get('/',authenticateToken, sparePartController.getAllSparePart);

// GET /api/spare-parts/stock/low -> Alertas de stock bajo (Cualquier rol autenticado)
router.get('/stock/low', authenticateToken, sparePartController.getLowStockSpareParts);

// GET /api/spare-parts/stock/out -> Alertas de stock agotado (Cualquier rol autenticado)
router.get('/stock/out', authenticateToken, sparePartController.getOutOfStockSpareParts);

// POST /api/spare-parts -> Crear repuesto (Solo Admin o Manager)
router.post('/', authenticateToken, authorizeRoles('admin', 'maintenance_manager'), validateCreateSparePart, handleValidationErrors, sparePartController.createSparePart);

// PUT /api/spare-parts/:id -> Actualizar repuesto (Solo Admin o Manager)
router.put('/:id', authenticateToken, authorizeRoles('admin', 'maintenance_manager'), validateIdParam, validateUpdateSparePart, handleValidationErrors, sparePartController.updateSparePart);

// DELETE /api/spare-parts/:id -> Eliminar repuesto (Solo Admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), validateIdParam, handleValidationErrors, sparePartController.deleteSparePart);

// GET /api/spare-parts/:id -> Detalle específico (Público)
router.get('/:id',authenticateToken, validateIdParam, handleValidationErrors, sparePartController.getSparePartsById);

module.exports = router;