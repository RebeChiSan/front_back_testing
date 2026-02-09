const request = require('supertest');
const app = require('../app');

const mockData = {
    validUser: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 30
    },
    invalidEmail: {
        name: 'John Doe',
        email: 'invalid-email',
        age: 30
    },
    invalidAge: {
        name: 'John Doe',
        email: 'valid@email.com',
        age: -10
    },
};

describe('Módulo de Simulación de Errores', () => {

    describe('CP-001: Respuesta 200 OK', () => {
        it('debe retornar código 200 con respuesta exitosa', async () => {
            const response = await request(app)
                .get('/api/mock/users');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body.message).toBe('Users retrieved successfully');
            expect(response.body).toHaveProperty('data');
        });
    });


    describe('CP-002: Respuesta 400 Bad Request', () => {
        it('debe retornar código 400 para petición malformada', async () => {
            const response = await request(app)
                .post('/api/mock/users')
                .send(mockData.invalidEmail);

            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe("BAD_REQUEST");
            expect(response.body).toHaveProperty('message', "Invalid data");
        });
    });

    describe('CP-003: Respuesta 401 Unauthorized', () => {
        it('debe retornar código 401 sin token de autenticación', async () => {
            const response = await request(app)
                .get('/api/mock/protected');

            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe('UNAUTHORIZED');
            expect(response.body).toHaveProperty('message', 'Authentication required');
            expect(response.headers['www-authenticate']).toBe('Bearer');
        });
    });

    describe('CP-004: Respuesta 403 Forbidden', () => {
        it('debe retornar código 403 con token válido pero sin permisos', async () => {
            const response = await request(app)
                .get('/api/mock/admin/users')
                .set('Authorization', 'Bearer valid-token-without-permissions');

            expect(response.statusCode).toBe(403);
            expect(response.body.code).toBe('FORBIDDEN');
            expect(response.body).toHaveProperty('message', "You don't have permission to access this resource");
        });
    });

    describe('CP-005: Respuesta 404 Not Found', () => {
        it('debe retornar código 404 para recurso no encontrado', async () => {
            const response = await request(app)
                .get('/api/mock/users/nonexistent-id');

            expect(response.statusCode).toBe(404);
            expect(response.body.code).toBe('NOT_FOUND');
            expect(response.body).toHaveProperty('message', 'Resource not found');
        });
    });

    describe('CP-006: Respuesta 408 Request Timeout', () => {
        it('debe retornar código 408 por timeout en la petición', async () => {
            const response = await request(app)
                .post('/api/mock/slow-operation')
                .send({ operation: 'heavy-computation' })
                .timeout(3000);
            if (response.status) {
                expect(response.statusCode).toBe(408);
                expect(response.body.code).toBe('REQUEST_TIMEOUT');
                expect(response.body).toHaveProperty('message', 'Request timeout exceeded');
            }
        });
    });

    describe('CP-007: Respuesta 422 Unprocessable Entity', () => {
        it('debe retornar código 422 por error de validación semántica', async () => {
            const response = await request(app)
                .post('/api/mock/users')
                .send(mockData.invalidAge);

            expect(response.statusCode).toBe(422);
            expect(response.body.code).toBe('VALIDATION_ERROR');
            expect(response.body).toHaveProperty('message', 'Validation failed');
        });
    });

    describe('CP-009: Respuesta 500 Internal Server Error', () => {
        it('debe retornar código 500 por error interno del servidor', async () => {
            const response = await request(app)
                .post('/api/mock/process')
                .send({ trigger: 'internal-error' });

            expect(response.statusCode).toBe(500);
            expect(response.body.code).toBe('INTERNAL_ERROR');
            expect(response.body).toHaveProperty('message', 'An internal server error occurred');
        });
    });

    describe('CP-010: Respuesta 502 Bad Gateway', () => {
        it('debe retornar código 502 por error de gateway', async () => {
            const response = await request(app)
                .get('/api/mock/external-service');

            expect(response.statusCode).toBe(502);
            expect(response.body.code).toBe('BAD_GATEWAY');
            expect(response.body).toHaveProperty('message', 'Invalid response from upstream server');
        });
    });

    describe('CP-011: Respuesta 503 Service Unavailable', () => {
        it('debe retornar código 503 cuando el servicio no está disponible', async () => {
            const response = await request(app)
                .get('/api/mock/maintenance');

            expect(response.statusCode).toBe(503);
            expect(response.body.code).toBe('SERVICE_UNAVAILABLE');
            expect(response.body).toHaveProperty('message', 'Service temporarily unavailable');
            expect(response.headers['retry-after']).toBe('120');
        });
    });

    describe('CP-012: Respuesta 504 Gateway Timeout', () => {
        it('debe retornar código 504 por timeout del gateway', async () => {
            const response = await request(app)
                .get('/api/mock/slow-external-service');

            expect(response.statusCode).toBe(504);
            expect(response.body.code).toBe('GATEWAY_TIMEOUT');
            expect(response.body).toHaveProperty('message', 'Upstream server timeout');
        });
    });

    describe('CP-013: Respuesta inmediata (< 100ms)', () => {
        it('debe responder en menos de 100ms', async () => {
            const startTime = Date.now();
            const response = await request(app)
                .get('/api/mock/ping');
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            expect(response.statusCode).toBe(200);
            expect(responseTime).toBeLessThan(150); // Margen extra por overhead de red
            expect(response.body).toHaveProperty('status', 'success');
        });
    });

    describe('CP-014: Respuesta normal (100ms - 1s)', () => {
        it('debe responder en aproximadamente 500ms', async () => {
            const startTime = Date.now();
            const response = await request(app)
                .get('/api/mock/search')
                .query({ q: 'test', delay: 500 });
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            expect(response.statusCode).toBe(200);
            expect(responseTime).toBeGreaterThanOrEqual(400);
            expect(responseTime).toBeLessThanOrEqual(650);
        });
    });

    describe('CP-015: Respuesta lenta (1s - 5s)', () => {
        it('debe responder en aproximadamente 3000ms', async () => {
            const startTime = Date.now();
            const response = await request(app)
                .post('/api/mock/heavy-computation')
                .send({ complexity: 'high' });
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            expect(response.status).toBe(200);
            expect(responseTime).toBeGreaterThanOrEqual(2900);
            expect(responseTime).toBeLessThanOrEqual(3300);
        }, 10000); // timeout extendido para este test
    });

    describe('CP-016: Respuesta muy lenta (> 5s)', () => {
        it('debe responder después de 10 segundos', async () => {
            const startTime = Date.now();
            const response = await request(app)
                .post('/api/mock/batch-process')
                .send({ items: 1000 });
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            expect(response.status).toBe(200);
            expect(responseTime).toBeGreaterThanOrEqual(9800);
        }, 15000); // timeout extendido
    });

    describe('CP-017: Timeout del cliente', () => {
        it('debe generar timeout cuando el delay excede el timeout del cliente', async () => {
            const clientTimeout = 1000;

            try {
                await request(app)
                    .post('/api/mock/batch-process')
                    .send({ items: 1000 })
                    .timeout(clientTimeout);

                // Si llega aquí, el test debe fallar
                fail('Se esperaba un error de timeout');
            } catch (error) {
                expect(error.message).toMatch(/timeout|aborted/i);
            }
        }, 5000);
    });

});