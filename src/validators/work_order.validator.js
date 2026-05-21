/**
 * @file Validador para las peticiones de ordenes de trabajo.
 * @module validators/work_order
 */

const { body } = require('express-validator');

const validateCreateWorkOrder = [
    body('machine_id')
        .isInt({ min: 1 })
        .withMessage('Machine ID must be a valid integer'),

    body('technician_id')
        .isInt({ min: 1 })
        .withMessage('Technician ID must be a valid integer'),

    body('issue_description')
        .notEmpty()
        .trim()
        .withMessage('Problem description is required')
];

const validateCloseWorkOrder = [
    body('resolution_comment')
        .notEmpty()
        .trim()
        .withMessage('Resolution comment is required'),

    body('partsUsed')
        .optional()
        .isArray()
        .withMessage('Consumed materials must be sent as an Array'),

    body('partsUsed.*.id_part')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Spare part ID is invalid'),

    body('partsUsed.*.quantity_used')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Consumed quantity must be at least 1')
];

const validateUpdateWorkOrder = [
    body('machine_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Machine ID must be a valid integer'),

    body('technician_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Technician ID must be a valid integer'),

    body('issue_description')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Problem description cannot be empty')
];

module.exports = { 
    validateCreateWorkOrder, 
    validateCloseWorkOrder,
    validateUpdateWorkOrder
};