const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');
const bcrypt = require('bcryptjs');

describe('Integration Test - Spare Parts API', () => {
    let token;
    let createdPartId;
    const testUser = {
        email: 'parts_test@vantexcorp.com',
        password: 'password123',
        role: 'admin'
    };

    beforeAll(async () => {
        await db('users').where({ email: testUser.email }).del();
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        await db('users').insert({
            email: testUser.email,
            password_hash: hashedPassword,
            full_name: 'Parts Tester',
            role: testUser.role
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: testUser.password });
        
        token = loginRes.body.data.token;

        await db('spare_parts').where('sku', 'like', 'TEST-%').del();
    });

    afterAll(async () => {
        await db('spare_parts').where('sku', 'like', 'TEST-%').del();
        await db('users').where({ email: testUser.email }).del();
        await db.destroy();
    });

    it('1. Debe crear un repuesto exitosamente', async () => {
        const response = await request(app)
            .post('/api/spare-parts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                sku: 'TEST-001',
                name: 'Rodamiento de prueba',
                current_stock: 10,
                minimum_stock: 5,
                unit_price: 25.50
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.sku).toBe('TEST-001');
        createdPartId = response.body.data.id;
    });

    it('2. Debe fallar al crear un repuesto con SKU duplicado', async () => {
        await request(app)
            .post('/api/spare-parts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                sku: 'TEST-002',
                name: 'Parte original',
                current_stock: 1,
                minimum_stock: 1,
                unit_price: 10
            });

        const response = await request(app)
            .post('/api/spare-parts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                sku: 'TEST-002',
                name: 'Parte duplicada',
                current_stock: 1,
                minimum_stock: 1,
                unit_price: 10
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/SKU ya está registrado/);
    });

    it('3. Debe actualizar un repuesto por ID', async () => {
        const response = await request(app)
            .put(`/api/spare-parts/${createdPartId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Rodamiento de prueba modificado',
                unit_price: 30.00
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Rodamiento de prueba modificado');
        expect(Number(response.body.data.unit_price)).toBe(30.00);
    });

    it('4. Debe eliminar un repuesto por ID', async () => {
        const response = await request(app)
            .delete(`/api/spare-parts/${createdPartId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('5. Debe fallar al actualizar un repuesto inexistente', async () => {
        const response = await request(app)
            .put(`/api/spare-parts/99999`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Parte fantasma'
            });

        expect(response.status).not.toBe(200);
        expect(response.body.success).toBe(false);
    });

    it('6. Debe fallar al eliminar un repuesto inexistente', async () => {
        const response = await request(app)
            .delete(`/api/spare-parts/99999`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });
});
