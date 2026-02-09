const request = require('supertest');
const app = require('../app');

describe('Casos de Prueba para Módulo de Webhooks', () => {
    describe('Validación Básica', () => {
        test('CP-001: Webhook con payload válido y completo', async () => {
            const response = await request(app)
                .post('/api/service/webhooks')
                .set('Content-Type', 'application/json')
                .send({
                    event: "user.created",
                    data: { id: 1, name: "John Doe" },
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');
        });
    });

    describe('Validación de Datos', () => {
        test('CP-003: Webhook con campo data faltante', async () => {
            const response = await request(app)
                .post('/api/service/webhooks')
                .send({ event: "user.created" });

            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('MISSING_REQUIRED_FIELD');

        });

        test('CP-004: Webhook con campo event faltante', async () => {
            const response = await request(app)
                .post('/api/service/webhooks')
                .send({
                    data: { id: 1, name: "John Doe" },
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('MISSING_REQUIRED_FIELD');

        });

        test('CP-005: Webhook con tipos de datos incorrectos', async () => {
            const response = await request(app)
                .post('/api/service/webhooks')
                .send({
                    event: "order.created",
                    data: { order_id: 12345, amount: "invalid" }
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('INVALID_DATA');
        });

        test('CP-006: Webhook con payload vacío', async () => {
            const response = await request(app)
                .post('/api/service/webhooks')
                .send({});

            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('EMPTY_PAYLOAD');
        });
    });

    describe('Tipos de Eventos', () => {
        test('CP-007: Webhook con tipo de evento no soportado', async () => {
            const response = await request(app)
                .post('/api/service/webhooks')
                .send({ event: "unknown.event.type", data: {} });

            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('UNSUPPORTED_EVENT');
        });
    });


});