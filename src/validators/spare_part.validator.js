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
