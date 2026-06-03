const db = require('../config/database');

const createReview = async (puntuacion, comentario, work_order_id) => {
    const [id] = await db('resenas_users').insert({
        puntuacion,
        comentario,
        work_order_id
    });
    
    const review = await db('resenas_users').where({ id }).first();
    return review;
};

module.exports = {
    createReview
};