/**
 * @file Validador para las peticiones de máquinas.
 * @module validators/machine
 */

const { body } = require('express-validator');

/**
 * Validacion para crear un maquina (POST)
 */
const validateCreateMachine = [
    body('asset_code')
        .notEmpty()
        .withMessage('Asset code (asset_code) is required.')
        .isString()
        .withMessage('Code must be text.'),
        
    body('name')
        .notEmpty()
        .withMessage('Machine name is required.'),
        
    body('location')
        .notEmpty()
        .withMessage('Location is required.'),
        
    body('status')
        .optional() 
        .isIn(['operational', 'broken', 'maintenance'])
        .withMessage('Invalid machine state.'),
        
    body('downtime_hourly_cost')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Hourly cost must be a positive number.')
];

/**
 * Validacion para actualizar un maquina (PUT/PATCH)
 */
const validateUpdateMachine = [
    body('status')
        .optional()
        .isIn(['operational', 'broken', 'maintenance'])
        .withMessage('Invalid machine state.'),
        
    body('downtime_hourly_cost')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Hourly cost must be a positive number.'),
        
    body('name')
        .optional()
        .notEmpty()
        .withMessage('Name cannot be empty if sent.'),
        
    body('location')
        .optional()
        .notEmpty()
        .withMessage('Location cannot be empty if sent.'),
        
    body('asset_code')
        .optional()
        .notEmpty()
        .withMessage('Code cannot be empty if sent.')
];

module.exports = {
    validateCreateMachine,
    validateUpdateMachine,
};