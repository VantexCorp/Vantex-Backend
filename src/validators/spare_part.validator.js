const { body } = require('express-validator');

/**
 * Validaciones para la creación de un repuesto.
 */
const validateCreateSparePart = [
    body('sku')
        .isString()
        .withMessage('El SKU debe ser una cadena de texto')
        .trim()
        .notEmpty()
        .withMessage('El SKU no puede estar vacío'),
    body('name')
        .isString()
        .withMessage('El nombre debe ser una cadena de texto')
        .trim()
        .notEmpty()
        .withMessage('El nombre no puede estar vacío'),
    body('current_stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El stock actual debe ser un número entero mayor o igual a 0'),
    body('minimum_stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El stock mínimo debe ser un número entero mayor o igual a 0'),
    body('unit_price')
        .notEmpty()
        .withMessage('El precio unitario es obligatorio')
        .isFloat({ min: 0 })
        .withMessage('El precio unitario debe ser un número mayor o igual a 0')
];

/**
 * Validaciones para la actualización de un repuesto.
 */
const validateUpdateSparePart = [
    body('sku')
        .optional()
        .isString()
        .withMessage('El SKU debe ser una cadena de texto')
        .trim()
        .notEmpty()
        .withMessage('El SKU no puede estar vacío'),
    body('name')
        .optional()
        .isString()
        .withMessage('El nombre debe ser una cadena de texto')
        .trim()
        .notEmpty()
        .withMessage('El nombre no puede estar vacío'),
    body('current_stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El stock actual debe ser un número entero mayor o igual a 0'),
    body('minimum_stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El stock mínimo debe ser un número entero mayor o igual a 0'),
    body('unit_price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El precio unitario debe ser un número mayor o igual a 0')
];

module.exports = {
    validateCreateSparePart,
    validateUpdateSparePart,
};