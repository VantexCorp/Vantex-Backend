/**
 * @file Rutas para la autenticación y gestión de usuarios.
 * @module routes/auth
 */

const express = require('express');
const router = express.Router();

// Importamos el Controlador y el Validador
const authController = require('../controllers/auth.controller');
const { 
  validateRegister, 
  validateLogin,
  validateUpdateProfile,
  validateUpdatePassword,
  validateUpdateUserByAdmin
} = require('../validators/auth.validator');
const { handleValidationErrors } = require('../middlewares/error.middleware'); 
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const { validateIdParam } = require('../validators/common.validator');

// ==========================================
// RUTAS DE AUTENTICACIÓN Y USUARIOS (Base URL: /api/auth)
// ==========================================

// POST /api/auth/register -> Registrar usuario (Público)
router.post('/register', validateRegister, handleValidationErrors, authController.registerUser);

// POST /api/auth/login -> Iniciar sesión (Público)
router.post('/login', validateLogin, handleValidationErrors, authController.loginUser);

// GET /api/auth/me -> Obtener perfil del usuario autenticado (Cualquier rol autenticado)
router.get('/me', authenticateToken, authController.getMe);

// GET /api/auth/users -> Obtener todos los usuarios (Solo Admin o Manager)
router.get('/users', authenticateToken, authorizeRoles('admin', 'maintenance_manager'), authController.getAllUsers);

// GET /api/auth/users/:id -> Obtener un usuario específico (Solo Admin y Manager)
router.get('/users/:id', authenticateToken, authorizeRoles('admin', 'maintenance_manager'), validateIdParam, handleValidationErrors, authController.getUserById);

// PUT /api/auth/users/update/password -> Cambiar contraseña (Cualquier rol autenticado)
router.put('/users/update/password', authenticateToken, validateUpdatePassword, handleValidationErrors, authController.updatePassword);

// PUT /api/auth/users/update/profile -> Actualizar perfil del usuario autenticado (Cualquier rol autenticado)
router.put('/users/update/profile', authenticateToken, validateUpdateProfile, handleValidationErrors, authController.updateUser);

// PUT /api/auth/users/update/:id -> Actualizar usuario (Solo Admin y Manager)
router.put('/users/update/:id', authenticateToken, authorizeRoles('admin', 'maintenance_manager'), validateIdParam, validateUpdateUserByAdmin, handleValidationErrors, authController.updateUserByAdmin);

module.exports = router;