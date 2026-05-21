const { body } = require('express-validator');

const validateRegister = [
  body('full_name')
    .notEmpty()
    .withMessage('El nombre es obligatorio.')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres.'),
  body('role')
    .optional()
    .isIn(['admin', 'maintenance_manager', 'technician'])
    .withMessage('Invalid role.')
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email no válido.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria.')
];

const validateUpdateProfile = [
  body('full_name')
    .optional()
    .notEmpty()
    .withMessage('Name cannot be empty.')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email.')
    .normalizeEmail()
];

const validateUpdatePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required.'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must have at least 6 characters.')
];

const validateUpdateUserByAdmin = [
  body('full_name')
    .optional()
    .notEmpty()
    .withMessage('Name cannot be empty.')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email.')
    .normalizeEmail(),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Active state must be a boolean (true/false).'),
  body('role')
    .optional()
    .isIn(['admin', 'maintenance_manager', 'technician'])
    .withMessage('Invalid role.')
];

module.exports = { 
  validateRegister, 
  validateLogin,
  validateUpdateProfile,
  validateUpdatePassword,
  validateUpdateUserByAdmin,
};