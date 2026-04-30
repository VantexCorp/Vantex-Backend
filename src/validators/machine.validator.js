/**
 * @file Validador para las peticiones de máquinas.
 * @module validators/machine
 */

const { body, validationResult } = require('express-validator');


/**
 * Validacion para crear un maquina (POST)
 */


const validateCreateMachine = [
    body('asset_code')
        .notEmpty()
        .withMessage('El código de activo (asset_code) es obligatorio.')
        .isString()
        .withMessage('El código debe ser texto.'),
        
    body('name')
        .notEmpty()
        .withMessage('El nombre de la máquina es obligatorio.'),
        
    body('location')
        .notEmpty()
        .withMessage('La ubicación es obligatoria.'),
        
    body('status')
        .optional() 
        .isIn(['operational', 'broken', 'maintenance'])
        .withMessage('Estado de máquina no válido.')
];


/**
 * Validacion para actualizar un maquina (PUT/PATCH)
 */
const validateUpdateMachine = [
    body('status')
        .optional()
        .isIn(['operational', 'broken', 'maintenance'])
        .withMessage('Estado de máquina no válido.'),
        
    body('downtime_hourly_cost')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El coste por hora debe ser un número positivo.')
];

module.exports = {
    validateCreateMachine,
    validateUpdateMachine
};