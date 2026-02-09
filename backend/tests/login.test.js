const request = require('supertest');
const app = require('../app'); // Ajusta la ruta a tu archivo principal

describe('Casos de Prueba para Módulo de Login', () => {
    describe('Validación de campos vacíos', () => {
        test('CP-001: debería rechazar login sin email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ password: 'Password123!' });

            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe("INVALID_CREDENTIALS");
        });

        test('CP-002: debería rechazar login sin password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'usuario@example.com' });

            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe("INVALID_CREDENTIALS");
        });

        test('CP-003: debería rechazar login sin ambos campos', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe("INVALID_CREDENTIALS");
        });
    });

    describe('Validación de formato de email', () => {
        test('CP-004: debería rechazar email sin @', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'usuarioexample.com',
                    password: 'Password123!'
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe("INVALID_CREDENTIALS");
        });

        test('CP-005: debería rechazar email sin dominio', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'usuario@',
                    password: 'Password123!'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe("INVALID_CREDENTIALS");
        });
    });

    describe('Login exitoso', () => {
        test('CP-006: debería permitir login con credenciales válidas', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'user@example.com',
                    password: 'Password123!'
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.code).toBe("AUTHENTICATED");
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
        });
    });

    describe('Cuenta bloqueada', () => {
        test('CP-007: debería rechazar login de cuenta bloqueada', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'blocked@example.com',
                    password: 'Password123!'
                });

            expect(response.statusCode).toBe(403);
            expect(response.body.code).toBe("BLOCKED_ACCOUNT");
        });
    });

    describe('Credenciales incorrectas', () => {
        test('CP-008: debería rechazar email inexistente', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'noexiste@example.com',
                    password: 'Password123!'
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe("INVALID_CREDENTIALS");
        });

        test('CP-009: debería rechazar password incorrecta', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'user@example.com',
                    password: 'PasswordIncorrecta'
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe("INVALID_CREDENTIALS");
        });
    });

    describe('Detección de SQL Injection', () => {
        test('CP-010: debería detectar y rechazar SQL injection en email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: "' OR '1'='1",
                    password: 'Password'
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe("NOT_ALLOWED");
        });

        test('CP-011: debería detectar y rechazar SQL injection en password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'user1@example.com',
                    password: "'; DROP TABLE users;--"
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe("NOT_ALLOWED");
        });
    });

    describe('Detección de XSS', () => {
        test('CP-012: debería detectar y rechazar XSS en email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: '<script>alert("xss")</script>@example.com',
                    password: 'Password'
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe("NOT_ALLOWED");
        });

        test('CP-013: debería detectar y rechazar XSS en password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'user3@example.com',
                    password: '<script>alert("xss")</script>'
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe("NOT_ALLOWED");
        });
    });

});