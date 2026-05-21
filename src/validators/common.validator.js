const { param } = require('express-validator');

const validateIdParam = [
    param('id')
        .notEmpty()
        .withMessage('The ID in the URL is required')
        .isInt()
        .withMessage('The ID must be a valid integer')
];

module.exports = {
    validateIdParam
};