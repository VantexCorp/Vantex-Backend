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