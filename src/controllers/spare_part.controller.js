/**
 * @file Controlador que gestiona las rutas de la tabla 'Spare Parts'.
 * @module controller/sparePart
 */

const sparePartService = require('../services/spare_part.service');

/**
 * Obtiene piezas con stock por debajo del mínimo
 */
async function getLowStockSpareParts(req, res) {
    try {
        const spareParts = await sparePartService.findSparePartBelowMinimumStock();
        res.json({ success: true, data: spareParts });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
}

/**
 * Obtiene piezas sin stock
 */
async function getOutOfStockSpareParts(req, res) {
    try {
        const spareParts = await sparePartService.findSparePartOutOfStock();
        res.json({ success: true, data: spareParts });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
}

/**
 * Obtiene una pieza específica por su ID.
 */
async function getSparePartsById(req, res) {
    try {
        const { id } = req.params;
        const sparePart = await sparePartService.findSparePartById(id);

        if (!sparePart) {
            return res.status(404).json({ success: false, message: 'La Pieza con ese ID no existe' });
        }
        res.json({ success: true, data: sparePart });

    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message || 'Error al buscar la pieza' });
    }
}

/**
 * Crea una nueva pieza en el inventario.
 */
async function createSparePart(req, res) {
    try {
        const existingSparePart = await sparePartService.findSparePartBySku(req.body.sku);
        if (existingSparePart) {
            return res.status(400).json({ success: false, message: 'El código SKU ya está registrado.' });
        }

        const newSparePart = await sparePartService.addSparePart(req.body);
        res.status(201).json({ success: true, message: 'Pieza registrada exitosamente', data: newSparePart });

    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
}

/**
 * Elimina una pieza del inventario por su ID.
 */
async function deleteSparePart(req, res) {
    try {
        const { id } = req.params;
        const sparePart = await sparePartService.findSparePartById(id);

        if (!sparePart) {
            return res.status(404).json({ success: false, message: 'Esta pieza no se puede borrar ya que no existe.' });
        }

        await sparePartService.removeSparePart(id);
        res.status(200).json({ success: true, message: 'Pieza eliminada exitosamente del inventario.' });

    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
}

/**
 * Actualiza los datos de una pieza existente por su ID.
 */
async function updateSparePart(req, res) {
    try {
        const { id } = req.params;
        const updatedSparePart = await sparePartService.modifySparePart(id, req.body);
        res.status(200).json({ success: true, message: 'Pieza modificada correctamente', data: updatedSparePart });

    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
}

/**
 * Obtiene todas las piezas registradas con filtros opcionales (nombre, sku).
 */
async function getAllSparePart(req, res) {
    try {
        const { name, sku } = req.query;
        const spareParts = await sparePartService.getAllSparePart({ name, sku });
        res.json({ success: true, data: spareParts });

    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
}

module.exports = {
    getSparePartsById,
    createSparePart,
    deleteSparePart,
    updateSparePart,
    getAllSparePart,
    getLowStockSpareParts,
    getOutOfStockSpareParts
}