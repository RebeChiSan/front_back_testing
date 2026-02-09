const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Validación de campos vacíos
    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            code: "INVALID_CREDENTIALS",
        });
    }

    // Detección básica de SQL injection
    const sqlPatterns = /('|"|;|--|\bOR\b|\bAND\b|\/\*|\*\/|xp_|sp_|DROP|DELETE|INSERT|UPDATE)/i;
    if (sqlPatterns.test(email) || sqlPatterns.test(password)) {
        return res.status(401).json({
            status: "error",
            code: "NOT_ALLOWED",
        });
    }

    // Detección básica de XSS
    const xssPatterns = /<script|javascript:|onerror=|onload=/i;
    if (xssPatterns.test(email) || xssPatterns.test(password)) {
        return res.status(401).json({
            status: "error",
            code: "NOT_ALLOWED",
        });
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            status: "error",
            code: "INVALID_CREDENTIALS",
        });
    }

    // Credenciales válidas para testing
    const validCredentials = {
        email: "user@example.com",
        password: "Password123!"
    };


    // Email de cuenta bloqueada
    const blockedEmail = "blocked@example.com";

    // Verificar si la cuenta está bloqueada
    if (email === blockedEmail) {
        return res.status(403).json({
            status: "error",
            code: "BLOCKED_ACCOUNT",
        });
    }

    // Verificar credenciales
    if (email === validCredentials.email && password === validCredentials.password) {
        return res.status(200).json({
            status: "success",
            code: "AUTHENTICATED",
            message: "Authentication successful",
            token: "mock_token",
            user: {
                id: "123",
                email: email,
                name: "User Test"
            }
        });
    }

    // Credenciales inválidas
    return res.status(401).json({
        status: "error",
        code: "INVALID_CREDENTIALS",
    });
});

module.exports = router;