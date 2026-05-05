/**
 * @file Servicio que gestiona las consultas SQL de la tabla 'Spare Parts'.
 * @module service/sparePart
 */

const db = require('../config/database');

/**
 * Busca una pieza por su ID
 */
async function findSparePartById(id) {
    return await db('spare_parts').where('id', id).first();
}

/**
 * Busca una pieza por su código (sku).
 * Se mantiene para validaciones internas (ej: evitar duplicados en creación).
 */
async function findSparePartBySku(sku) {
    return await db('spare_parts').where('sku', sku).first();
}

/**
 * Obtiene las piezas cuyo stock actual es menor o igual al stock mínimo.
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

/**
 * Añade una nueva pieza al inventario.
 */
async function addSparePart(rawData) {
    const safeData = {
        sku: rawData.sku,
        name: rawData.name,
        current_stock: rawData.current_stock,
        minimum_stock: rawData.minimum_stock,
        unit_price: rawData.unit_price
    };
    const [id] = await db('spare_parts').insert(safeData);
    return { id, ...safeData };
}

/** * Modifica los datos de una pieza.
 */
async function modifySparePart(id, rawUpdateData) {
    const { sku, name, current_stock, minimum_stock, unit_price } = rawUpdateData;
    const safeData = {};
    
    if (sku !== undefined) safeData.sku = sku;
    if (name !== undefined) safeData.name = name;
    if (current_stock !== undefined) safeData.current_stock = current_stock;
    if (minimum_stock !== undefined) safeData.minimum_stock = minimum_stock;
    if (unit_price !== undefined) safeData.unit_price = unit_price;

    if (Object.keys(safeData).length === 0) {
        throw { status: 400, message: "No hay campos válidos para actualizar" };
    }

    const updatedRows = await db('spare_parts').where('id', id).update(safeData);
    if (updatedRows === 0) {
        throw { status: 404, message: "Pieza no encontrada" };
    }
    return await findSparePartById(id);
}

/**
 * Elimina una pieza del inventario
 */
async function removeSparePart(id) {
    await db ('spare_parts').where('id', id).del();
}

/**
 * Obtiene todas las piezas del inventario permitiendo filtros dinámicos.
 * Fusión de getAll, getByName y getBySku.
 */
async function getAllSparePart(filters = {}) {
    const { name, sku } = filters;
    const query = db('spare_parts').select('*');

    if (name) query.where('name', 'like', `%${name}%`);
    if (sku) query.where('sku', sku);

    return query;
}

module.exports = {
    findSparePartById,
    findSparePartBySku,
    findSparePartBelowMinimumStock,
    findSparePartOutOfStock,
    addSparePart,
    modifySparePart,
    removeSparePart,
    getAllSparePart
};