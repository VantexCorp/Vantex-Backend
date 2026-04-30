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


/**
 * Busca una pieza por su código (sku).
 * ¡Muy útil para que el controlador valide que no estamos metiendo un código duplicado!
 */
async function findSparePartBySku(sku) {
    return await db('spare_parts').where('sku', sku).first();
}


/**
 * Obtiene las piezas cuyo stock actual es menor o igual al stock mínimo.
 * (Útil para generar alertas de reposición).
 */
async function findSparePartBelowMinimumStock() {
    return await db('spare_parts').whereRaw('current_stock <= minimum_stock');
}


/**
 * Obtiene las piezas que están fuera de stock (stock <= 0).
 */
async function findSparePartOutOfStock() {
    return await db('spare_parts').where('current_stock', '<=', 0);
}