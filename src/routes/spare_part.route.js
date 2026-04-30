/**
 * @file spare_part.route.js
 * @description Definición de rutas para la gestión de repuestos (Spare Parts).
 * @module routes/spare_part
 */

const express = require('express');
const router = express.Router();
const sparePartController = require('../controllers/spare_part.controller');
const {
    validateCreateSparePart,
    validateUpdateSparePart,
    validateNameSearch,
    validateSkuSearch,
    validateIdParam
} = require('../validators/spare_part.validator');


/**
 * @route GET /name
 * @description Busca repuestos filtrando por nombre.
 * @access Public
 */
router.get('/name', validateNameSearch, sparePartController.getSparePartsByName);

/**
 * @route GET /sku
 * @description Busca repuestos filtrando por SKU.
 * @access Public
 */
router.get('/sku', validateSkuSearch, sparePartController.getSparePartsBySku);

/**
 * @route GET /:id
 * @description Obtiene el detalle de un repuesto específico por su ID.
 * @param {string} id.path.required - ID único del repuesto.
 */
router.get('/:id', validateIdParam, sparePartController.getSparePartsById);

/**
 * @route POST /
 * @description Crea un nuevo registro de repuesto en el sistema.
 * @body {Object} sparePart - Datos del repuesto a crear.
 */
router.post('/', validateCreateSparePart, sparePartController.createSparePart);

/**
 * @route PUT /:id
 * @description Actualiza un repuesto existente identificado por su ID.
 * @param {string} id.path.required - ID del repuesto a modificar.
 */
router.put('/:id', validateUpdateSparePart, sparePartController.updateSparePart);

/**
 * @route DELETE /:id
 * @description Elimina un registro de repuesto del sistema por su ID.
 * @param {string} id.path.required - ID del repuesto a eliminar.
 */
router.delete('/:id', validateIdParam, sparePartController.deleteSparePart);

/**
 * @route GET /spare-parts
 * @description Obtiene la lista completa de todos los repuestos registrados.
 */
router.get('/', sparePartController.getAllSparePart);

module.exports = router;