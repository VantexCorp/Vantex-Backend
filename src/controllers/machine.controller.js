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
 * Obtiene estadísticas de las máquinas
 */
async function getMachineStats(req, res) {
  try {
    const operational = await machineService.countMachinesByStatus('operational');
    const broken = await machineService.countMachinesByStatus('broken');
    const maintenance = await machineService.countMachinesByStatus('maintenance');
    res.json({ success: true, data: { operational, broken, maintenance } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener estadísticas" });
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

/**
 * Crear una máquina (Usando machineData)
 */
async function createMachine(req, res) {
  try {
    const existing = await machineService.findMachineByAssetCode(req.body.asset_code);
    if (existing) {
      return res.status(400).json({ success: false, message: "El código de activo ya existe" });
    }

    const newMachine = await machineService.addMachine(req.body);
    res.status(201).json({ success: true, data: newMachine });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ success: false, message: error.status ? error.message : "Error al crear la máquina" });
  }
}

/**
 * Actualizar una máquina (Usando updateData)
 */
async function updateMachine(req, res) {
  try {
    const { id } = req.params;
    
    const updatedMachine = await machineService.modifyMachine(id, req.body);
    res.json({ success: true, data: updatedMachine });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ success: false, message: error.message || "Error al actualizar" });
  }
}


/**
 * Eliminar una máquina
 */
async function deleteMachine(req, res) {
  try {
    await machineService.removeMachine(req.params.id);
    res.json({ success: true, message: "Máquina eliminada correctamente" });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ success: false, message: error.message || "Error al eliminar" });
  }
}

module.exports = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
  getMachineStats
};