const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware para capturar y retornar errores de validación.
 * @param {Object} req - Objeto Request.
 * @param {Object} res - Objeto Response.
 * @param {Function} next - Función Next.
 */
const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};


/**
 * Validaciones para la creación de un repuesto.
 */
const validateCreateSparePart = [
    body('sku')
        .exists()
        .withMessage('El SKU es obligatorio')
        .isString()
        .withMessage('El SKU debe ser una cadena de texto')
        .trim()
        .notEmpty()
        .withMessage('El SKU no puede estar vacío'),
    body('name')
        .exists()
        .withMessage('El nombre es obligatorio')
        .isString()
        .withMessage('El nombre debe ser una cadena de texto')
        .trim()
        .notEmpty()
        .withMessage('El nombre no puede estar vacío'),
    body('current_stock')
        .exists()
        .withMessage('El stock actual es obligatorio')
        .isInt({ min: 0 })
        .withMessage('El stock actual debe ser un número entero mayor o igual a 0'),
    body('minimum_stock')
        .exists()
        .withMessage('El stock mínimo es obligatorio')
        .isInt({ min: 0 })
        .withMessage('El stock mínimo debe ser un número entero mayor o igual a 0'),
    body('unit_price')
        .exists()
        .withMessage('El precio unitario es obligatorio')
        .isFloat({ min: 0 })
        .withMessage('El precio unitario debe ser un número mayor o igual a 0'),
    (req, res, next) => validateResult(req, res, next)
];