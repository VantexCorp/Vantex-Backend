/**
 * @file Controlador que gestiona las rutas de la tabla 'Spare Parts'.
 * @module controller/sparePart
 */


const sparePartService = require('../services/spare_part.service');


/**
 * Obtiene piezas por su nombre (coincidencia parcial).
 * @param {Object} req - Objeto Request de Express.
 * @param {Object} res - Objeto Response de Express.
 */
async function getSparePartsByName(req, res) {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ message: 'Se requiere un nombre para la busqueda.' })
        }

        const spareParts = await sparePartService.findSparePartByName(name);
        res.json(spareParts);

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message })
    }
}


/**
 * Obtiene una pieza específica por su ID.
 * @param {Object} req - Objeto Request de Express.
 * @param {Object} res - Objeto Response de Express.
 */
async function getSparePartsById(req, res) {
    try {
        const { id } = req.params;

        const sparePart = await sparePartService.findSparePartById(id);

        if (!sparePart) {
            return res.status(404).json({ message: 'La Pieza con ese ID no existe' });
        }
        res.json(sparePart);

    } catch (error) {
        res.status(500).json({ message: 'Error al buscar la pieza', error: error.message })
    }
}


/**
 * Crea una nueva pieza en el inventario.
 * Verifica que el código SKU no esté duplicado antes de crearla.
 * @param {Object} req - Objeto Request de Express.
 * @param {Object} res - Objeto Response de Express.
 */
async function createSparePart(req, res) {
    try {
        const { sku, name, current_stock, minimum_stock, unit_price } = req.body;

        const existingSparePart = await sparePartService.findSparePartBySku(sku);
        if (existingSparePart) {
            return res.status(400).json({ message: 'El codigo SKU ya esta registrado.' });
        }

        const newSparePart = await sparePartService.addSparePart({ sku, name, current_stock, minimum_stock, unit_price });
        res.status(201).json({ message: 'Pieza registrada exitosamente', data: newSparePart });


    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}


/**
 * Elimina una pieza del inventario por su ID.
 * @param {Object} req - Objeto Request de Express.
 * @param {Object} res - Objeto Response de Express.
 */
async function deleteSparePart(req, res) {
    try {
        const { id } = req.params;

        const sparePart = await sparePartService.findSparePartById(id);

        if (!sparePart) {
            return res.status(404).json({ message: 'Esta pieza no se puede borrar ya que no existe.' })
        }

        await sparePartService.removeSparePart(id);
        res.status(200).json({ message: 'Pieza eliminada exitosamente del inventario.' })


    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message })
    }
}


/**
 * Actualiza los datos de una pieza existente por su ID.
 * @param {Object} req - Objeto Request de Express.
 * @param {Object} res - Objeto Response de Express.
 */
async function updateSparePart(req, res) {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const existingSparePart = await sparePartService.findSparePartById(id);
        if (!existingSparePart) {
            return res.status(404).json({ message: 'La pieza no se puede modificar ya que no existe.' });
        }

        const updatedSparePart = await sparePartService.modifySparePart(id, updatedData);
        res.status(200).json({ message: 'Pieza modificada correctamente', data: updatedSparePart });

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}


/**
 * Obtiene todas las piezas registradas en el inventario.
 * @param {Object} req - Objeto Request de Express.
 * @param {Object} res - Objeto Response de Express.
 */
async function getAllSparePart(req, res) {
    try {
        const spare_part = await sparePartService.getAllSparePart();
        res.json(spare_part);

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message })
    }
}


module.exports = {
    getSparePartsByName,
    getSparePartsBySku,
    getSparePartsById,
    createSparePart,
    deleteSparePart,
    updateSparePart,
    getAllSparePart
}

