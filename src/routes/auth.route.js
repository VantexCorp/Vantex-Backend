/**
 * @file Rutas para la autenticación y gestión de usuarios.
 * @module routes/auth
 */

const express = require('express');
const router = express.Router();

// Importamos el Controlador y el Validador
const authController = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../validators/auth.validator');
const { handleValidationErrors } = require('../middlewares/error.middleware'); 
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

// ==========================================
// RUTAS DE AUTENTICACIÓN Y USUARIOS (Base URL: /api/auth)
// ==========================================

// POST /api/auth/register -> Registrar usuario (Público)
router.post('/register', validateRegister, handleValidationErrors, authController.registerUser);

// POST /api/auth/login -> Iniciar sesión (Público)
router.post('/login', validateLogin, handleValidationErrors, authController.loginUser);

// GET /api/auth/me -> Obtener perfil del usuario autenticado (Cualquier rol autenticado)
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "Tienes acceso VIP",
    data: {id: req.user.id, email: req.user.email, role: req.user.role}
  });
});

// GET /api/auth/users -> Obtener todos los usuarios (Solo Admin o Manager)
router.get('/users', authenticateToken, authorizeRoles('admin', 'maintenance_manager'), authController.getAllUsers);

// PUT /api/auth/users/update/password -> Cambiar contraseña (Cualquier rol autenticado)
router.put('/users/update/password', authenticateToken, authController.updatePassword);

// PUT /api/auth/users/update/profile -> Actualizar perfil del usuario autenticado (Cualquier rol autenticado)
router.put('/users/update/profile', authenticateToken, authController.updateUser);

// PUT /api/auth/users/update/:id -> Actualizar usuario (Solo Admin y Manager)
router.put('/users/update/:id', authenticateToken, authorizeRoles('admin', 'maintenance_manager'), authController.updateUserByAdmin);

module.exports = router;