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

/**
 * Crear una máquina (Usando machineData)
 */
async function createMachine(req, res) {
  try {
    const existing = await machineService.findMachineByAssetCode(req.body.asset_code);
    if (existing) {
      return res.status(400).json({ success: false, message: "El código de activo ya existe" });
    }

    /**
     * DEFINICIÓN DE machineData:
     * Creamos un objeto con los nombres exactos de las columnas del init.sql
     */
    const machineData = {
      asset_code: req.body.asset_code,
      name: req.body.name,
      location: req.body.location,
      status: req.body.status || 'operational',
      downtime_hourly_cost: req.body.downtime_hourly_cost || 0.00
    };

    const newMachine = await machineService.addMachine(machineData);
    res.status(201).json({ success: true, data: newMachine });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear la máquina", error: error.message });
  }
}

/**
 * Actualizar una máquina (Usando updateData)
 */
async function updateMachine(req, res) {
  try {
    const { id } = req.params;
    
    const { status, downtime_hourly_cost, name, location, asset_code } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (downtime_hourly_cost !== undefined) updateData.downtime_hourly_cost = downtime_hourly_cost;
    if (name !== undefined) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (asset_code !== undefined) updateData.asset_code = asset_code;

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ success: false, message: "No hay campos válidos para actualizar" });
    }

    const updatedMachine = await machineService.modifyMachine(id, updateData);
    res.json({ success: true, data: updatedMachine });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar" });
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
    res.status(500).json({ success: false, message: "Error al eliminar" });
  }
}

module.exports = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine
};