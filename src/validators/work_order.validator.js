/**
 * @file Validador para las peticiones de ordenes de trabajo.
 * @module validators/work_order
 */

const { body } = require('express-validator');

const validateCreateWorkOrder = [
    body('machine_id')
        .isInt({ min: 1 })
        .withMessage('El ID de máquina debe ser un número entero válido'),

    body('technician_id')
        .isInt({ min: 1 })
        .withMessage('El ID de técnico debe ser un número entero válido'),

    body('issue_description')
        .notEmpty()
        .trim()
        .withMessage('La descripción del problema es obligatoria')
];

const validateCloseWorkOrder = [
    body('resolution_comment')
        .notEmpty()
        .trim()
        .withMessage('El comentario de resolución es obligatorio'),

    body('partsUsed')
        .optional()
        .isArray()
        .withMessage('Los materiales consumidos deben enviarse como una lista (Array)'),

    body('partsUsed.*.id_part')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID del repuesto no es válido'),

    body('partsUsed.*.quantity_used')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La cantidad consumida debe ser al menos 1')
];

const validateUpdateWorkOrder = [
    body('machine_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID de máquina debe ser un número entero válido'),

    body('technician_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID de técnico debe ser un número entero válido'),

    body('issue_description')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('La descripción del problema no puede estar vacía')
];

module.exports = { 
    validateCreateWorkOrder, 
    validateCloseWorkOrder,
    validateUpdateWorkOrder
};