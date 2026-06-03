const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/services/review.service', () => ({
    createReview: jest.fn().mockResolvedValue({
        id: 1,
        puntuacion: 5,
        comentario: 'Excelente',
        work_order_id: 1
    })
}));

describe('Test de Reseñas', () => {
    it('debe guardar la reseña, devolver estado 201 y la estructura correcta', async () => {
        const respuesta = await request(app)
            .post('/api/reviews')
            .send({
                puntuacion: 5,
                comentario: 'Excelente',
                work_order_id: 1
            });

        expect(respuesta.statusCode).toBe(201);      
        expect(respuesta.body.message).toBeDefined();
        expect(respuesta.body.data).toBeDefined();
    });
});
