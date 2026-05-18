/**
 * @file Servicio que gestiona las consultas SQL de la tabla 'machines'.
 * @module services/machine
 */

const db = require('../config/database');

/**
 * Obtiene todas las máquinas, permitiendo filtrar dinámicamente.
 * Esto es vital para el frontend si queremos un desplegable que diga:
 * "Mostrar solo las máquinas de la 'Planta Norte'" o "Solo las rotas".
 */
async function findAllMachines(location, status) {
  const query = db('machines').select('*');

  if (location) query.where('location', location);
  if (status) query.where('status', status);

  return query;
}

/**
 * Busca una máquina por su ID
 */
async function findMachineById(id) {
  return await db('machines').where('id', id).first();
}

/**
 * Busca una máquina por su código de activo (asset_code).
 * ¡Muy útil para que el controlador valide que no estamos metiendo un código duplicado!
 */
async function findMachineByAssetCode(assetCode) {
  return await db('machines').where('asset_code', assetCode).first();
}

/**
 * Cuenta cuántas máquinas hay en un estado específico ('broken', 'operational'...).
 * Esto es perfecto para pintar gráficos (KPIs) en el Dashboard del frontend.
 */
async function countMachinesByStatus(status) {
  const result = await db('machines')
    .where('status', status)
    .count('id as total')
    .first();
  
  return parseInt(result.total || 0, 10);
}

/**
 * Añade una nueva máquina al inventario
 */
async function addMachine(rawData) {
  const machineData = {
    asset_code: rawData.asset_code,
    name: rawData.name,
    location: rawData.location,
    status: rawData.status || 'operational',
    downtime_hourly_cost: rawData.downtime_hourly_cost || 0.00
  };
  const [id] = await db('machines').insert(machineData);
  // Devolvemos el objeto completo con su nuevo ID para que el frontend pueda pintarlo sin recargar
  return { id, ...machineData }; 
}

/**
 * Modifica los datos de una máquina (ej: cambiar el estado de 'broken' a 'maintenance')
 */
async function modifyMachine(id, rawUpdateData) {
  const { status, downtime_hourly_cost, name, location, asset_code } = rawUpdateData;
  const safeData = {};
  
  if (status !== undefined) safeData.status = status;
  if (downtime_hourly_cost !== undefined) safeData.downtime_hourly_cost = downtime_hourly_cost;
  if (name !== undefined) safeData.name = name;
  if (location !== undefined) safeData.location = location;
  if (asset_code !== undefined) safeData.asset_code = asset_code;

  if (Object.keys(safeData).length === 0) {
      throw { status: 400, message: "No hay campos válidos para actualizar" };
  }

  const updatedRows = await db('machines').where('id', id).update(safeData);
  if (updatedRows === 0) {
    throw { status: 404, message: "Máquina no encontrada" };
  }
  return await findMachineById(id);
}

/**
 * Elimina una máquina del sistema
 */
async function removeMachine(id) {
  const deletedRows = await db('machines').where('id', id).del();
  if (deletedRows === 0) {
    throw { status: 404, message: "Máquina no encontrada" };
  }
}

module.exports = {
  findAllMachines,
  findMachineById,
  findMachineByAssetCode,
  countMachinesByStatus,
  addMachine,
  modifyMachine,
  removeMachine
};