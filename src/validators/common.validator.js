const { param } = require('express-validator');

const validateIdParam = [
    param('id')
        .notEmpty()
        .withMessage('El ID en la URL es obligatorio')
        .isInt()
        .withMessage('El ID debe ser un número entero válido')
];

module.exports = {
    validateIdParam
};