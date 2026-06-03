const reviewService = require('../services/review.service');

const createReview = async (req, res) => {
    try {
        const { puntuacion, comentario, work_order_id } = req.body;
        
        if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
            return res.status(400).json({ message: 'La puntuación debe ser entre 1 y 5' });
        }
        if (!work_order_id) {
            return res.status(400).json({ message: 'work_order_id es obligatorio' });
        }
        
        console.warn('Nueva valoración recibida:', { puntuacion, comentario, work_order_id });
        
        const newReview = await reviewService.createReview(puntuacion, comentario || '', work_order_id);
        
        res.status(201).json({
            message: 'Reseña guardada con éxito',
            data: newReview
        });
    } catch (error) {
        console.error('Error al guardar reseña:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    createReview
};