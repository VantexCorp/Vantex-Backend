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