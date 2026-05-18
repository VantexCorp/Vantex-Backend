const { body } = require('express-validator');

const validateRegister = [
  body('full_name')
    .notEmpty()
    .withMessage('El nombre es obligatorio.')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres.'),
  body('role')
    .optional()
    .isIn(['admin', 'maintenance_manager', 'technician'])
    .withMessage('Rol no válido.')
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
    .withMessage('El nombre no puede estar vacío.')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Debe ser un email válido.')
    .normalizeEmail()
];

const validateUpdatePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es obligatoria.'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres.')
];

const validateUpdateUserByAdmin = [
  body('full_name')
    .optional()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío.')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Debe ser un email válido.')
    .normalizeEmail(),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('El estado activo debe ser booleano (true/false).'),
  body('role')
    .optional()
    .isIn(['admin', 'maintenance_manager', 'technician'])
    .withMessage('Rol no válido.')
];

module.exports = { 
  validateRegister, 
  validateLogin,
  validateUpdateProfile,
  validateUpdatePassword,
  validateUpdateUserByAdmin,
};