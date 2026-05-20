const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');
const bcrypt = require('bcryptjs');

describe('Integration Test - Machines API', () => {
    let token;
    let createdMachineId;
    const testUser = {
        email: 'machines_test@vantexcorp.com',
        password: 'password123',
        role: 'admin'
    };

    beforeAll(async () => {
        await db('users').where({ email: testUser.email }).del();
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        await db('users').insert({
            email: testUser.email,
            password_hash: hashedPassword,
            full_name: 'Machines Tester',
            role: testUser.role
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: testUser.password });
        
        token = loginRes.body.data.token;

        await db('machines').where('asset_code', 'like', 'TEST-%').del();
    });

    afterAll(async () => {
        await db('machines').where('asset_code', 'like', 'TEST-%').del();
        await db('users').where({ email: testUser.email }).del();
        await db.destroy();
    });

    it('1. Debe crear una máquina exitosamente', async () => {
        const response = await request(app)
            .post('/api/machines')
            .set('Authorization', `Bearer ${token}`)
            .send({
                asset_code: 'TEST-MAC-001',
                name: 'Torno de prueba',
                location: 'Planta A',
                status: 'operational',
                downtime_hourly_cost: 15.50
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.asset_code).toBe('TEST-MAC-001');
        createdMachineId = response.body.data.id;
    });

    it('2. Debe fallar al crear una máquina con asset_code duplicado', async () => {
        await request(app)
            .post('/api/machines')
            .set('Authorization', `Bearer ${token}`)
            .send({
                asset_code: 'TEST-MAC-002',
                name: 'Máquina original',
                location: 'Planta A'
            });

        const response = await request(app)
            .post('/api/machines')
            .set('Authorization', `Bearer ${token}`)
            .send({
                asset_code: 'TEST-MAC-002',
                name: 'Máquina duplicada',
                location: 'Planta A'
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/código de activo ya existe/);
    });

    it('3. Debe actualizar una máquina por ID', async () => {
        const response = await request(app)
            .put(`/api/machines/${createdMachineId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Torno de prueba modificado',
                status: 'maintenance'
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Torno de prueba modificado');
        expect(response.body.data.status).toBe('maintenance');
    });

    it('4. Debe eliminar una máquina por ID', async () => {
        const response = await request(app)
            .delete(`/api/machines/${createdMachineId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('5. Debe fallar al actualizar una máquina inexistente', async () => {
        const response = await request(app)
            .put(`/api/machines/99999`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Torno fantasma'
            });

        expect(response.status).not.toBe(200);
        expect(response.body.success).toBe(false);
    });

    it('6. Debe fallar al eliminar una máquina inexistente', async () => {
        const response = await request(app)
            .delete(`/api/machines/99999`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).not.toBe(200);
        expect(response.body.success).toBe(false);
    });
});
