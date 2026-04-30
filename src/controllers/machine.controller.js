/**
 * @file Controlador para manejar las peticiones HTTP de máquinas.
 * @module controllers/machine
 */

const machineService = require('../services/machine.service');

/**
 * Obtiene todas las máquinas (con filtros opcionales)
 */
async function getAllMachines(req, res) {
  try {
    const { location, status } = req.query;
    const machines = await machineService.findAllMachines(location, status);
    res.json({ success: true, data: machines });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener máquinas" });
  }
}

/**
 * Obtiene una máquina por ID
 */
async function getMachineById(req, res) {
  try {
    const machine = await machineService.findMachineById(req.params.id);
    if (!machine) {
      return res.status(404).json({ success: false, message: "Máquina no encontrada" });
    }
    res.json({ success: true, data: machine });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
}