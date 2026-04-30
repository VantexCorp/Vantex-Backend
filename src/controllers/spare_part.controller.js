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