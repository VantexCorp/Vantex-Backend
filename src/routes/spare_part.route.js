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