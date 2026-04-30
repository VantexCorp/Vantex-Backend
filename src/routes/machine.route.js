/**
 * @file Rutas para el CRUD de máquinas.
 * @module routes/machine
 */

const express = require('express');
const router = express.Router();

// Importamos el Controlador y el Validador
const machineController = require('../controllers/machine.controller');
const { validateCreateMachine, validateUpdateMachine } = require('../validators/machine.validator');
const { handleValidationErrors } = require('../middlewares/error.middleware'); 
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

// ==========================================
// RUTAS DE MÁQUINAS (Base URL: /api/machines)
// ==========================================

// GET /api/machines -> Obtener todas (Cualquier rol autenticado)
router.get('/', authenticateToken, machineController.getAllMachines);

// GET /api/machines/:id -> Obtener una máquina en concreto (Cualquier rol autenticado)
router.get('/:id', authenticateToken, machineController.getMachineById);

// POST /api/machines -> Crear máquina (Solo Admin o Manager)
router.post('/', authenticateToken, authorizeRoles('admin', 'maintenance_manager'), validateCreateMachine, handleValidationErrors, machineController.createMachine);

// PUT /api/machines/:id -> Actualizar máquina (Solo Admin o Manager)
router.put('/:id', authenticateToken, authorizeRoles('admin', 'maintenance_manager'), validateUpdateMachine, handleValidationErrors, machineController.updateMachine);

// DELETE /api/machines/:id -> Eliminar máquina (Solo Admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), machineController.deleteMachine); 

module.exports = router;
