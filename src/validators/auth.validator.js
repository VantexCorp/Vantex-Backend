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