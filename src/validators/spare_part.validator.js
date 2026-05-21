const { body } = require('express-validator');

/**
 * Validaciones para la creación de un repuesto.
 */
const validateCreateSparePart = [
    body('sku')
        .isString()
        .withMessage('SKU must be a text string')
        .trim()
        .notEmpty()
        .withMessage('SKU cannot be empty'),
    body('name')
        .isString()
        .withMessage('Name must be a text string')
        .trim()
        .notEmpty()
        .withMessage('Name cannot be empty'),
    body('current_stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Current stock must be an integer greater than or equal to 0'),
    body('minimum_stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Minimum stock must be an integer greater than or equal to 0'),
    body('unit_price')
        .notEmpty()
        .withMessage('Unit price is required')
        .isFloat({ min: 0 })
        .withMessage('Unit price must be a number greater than or equal to 0')
];

/**
 * Validaciones para la actualización de un repuesto.
 */
const validateUpdateSparePart = [
    body('sku')
        .optional()
        .isString()
        .withMessage('SKU must be a text string')
        .trim()
        .notEmpty()
        .withMessage('SKU cannot be empty'),
    body('name')
        .optional()
        .isString()
        .withMessage('Name must be a text string')
        .trim()
        .notEmpty()
        .withMessage('Name cannot be empty'),
    body('current_stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Current stock must be an integer greater than or equal to 0'),
    body('minimum_stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Minimum stock must be an integer greater than or equal to 0'),
    body('unit_price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Unit price must be a number greater than or equal to 0')
];

module.exports = {
    validateCreateSparePart,
    validateUpdateSparePart,
};