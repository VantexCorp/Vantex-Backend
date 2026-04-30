/**
 * @file Servicio que gestiona las consultas SQL de la tabla 'Spare Parts'.
 * @module service/sparePart
 */

const db = require('../config/database');


/**
 * Busca piezas cuyo nombre coincida parcialmente con el término de búsqueda.
 */
async function findSparePartByName(name) {
    return await db('spare_parts').where('name', 'like', `%${name}%`);
}


/**
 * Busca una pieza por su ID
 */
async function findSparePartById(id) {
    return await db('spare_parts').where('id', id).first();
}