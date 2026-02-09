const express = require("express");
const router = express.Router();
// Utilidades y Almacenamiento
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const usersStore = new Map();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


// Listar usuarios
router.get('/users', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Users retrieved successfully',
        data: { users: Array.from(usersStore.values()), total: usersStore.size }
    });
});

// Crear usuario
router.post('/users', (req, res) => {
    const { name, email, age } = req.body;
    if (!isValidEmail(email)) {
        return res.status(400).json({ status: 'error', code: 'BAD_REQUEST', message: 'Invalid data' });
    }
    if (age <= 0) {
        return res.status(422).json({ status: 'error', code: 'VALIDATION_ERROR', message: 'Validation failed' });
    }

});

// Obtener por ID
router.get('/users/:id', (req, res) => {
    const user = usersStore.get(req.params.id);
    if (!user) return res.status(404).json({ status: 'error', code: 'NOT_FOUND', message: "Resource not found" });
});

router.get('/admin/users', (req, res) => {
    const user = usersStore.get(req.params.id);
    if (!user) return res.status(403).json({ status: 'error', code: 'FORBIDDEN', message: "You don't have permission to access this resource" });
});


// Auth simulation
router.get('/protected', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.set('WWW-Authenticate', 'Bearer');
        return res.status(401).json({ status: 'error', code: 'UNAUTHORIZED', message: "Authentication required" });
    }
});

// Timeout simulation
router.post('/slow-operation', async (req, res) => {
    await delay(2000);
    res.status(408).json({ status: 'error', code: 'REQUEST_TIMEOUT', message: 'Request timeout exceeded' });
});


// Server Errors
router.post('/process', (req, res) => {
    if (req.body.trigger === 'internal-error') return res.status(500).json({ status: 'error', code: 'INTERNAL_ERROR', message: "An internal server error occurred" });
});

router.get('/external-service', (req, res) => res.status(502).json({ status: "error", code: 'BAD_GATEWAY', message: "Invalid response from upstream server" }));
router.get('/maintenance', (req, res) => {
    res.set('Retry-After', '120');
    res.status(503).json({ status: "error", code: 'SERVICE_UNAVAILABLE', message: "Service temporarily unavailable" });
});
router.get('/slow-external-service', (req, res) => res.status(504).json({ status: "error", code: 'GATEWAY_TIMEOUT', message: "Upstream server timeout" }));

// Latency
router.get('/ping', (req, res) => res.status(200).json({ status: "success", message: "Excelent Latency" }));

router.get('/search', async (req, res) => {
    await delay(400);
    res.status(200).json({ status: 'success', responseTime: 400, message: "Normal Latency" });
});

router.post('/heavy-computation', async (req, res) => {
    await delay(3000);
    res.status(200).json({ status: 'success', responseTime: 3000, message: "High Latency" });
});

router.post('/batch-process', async (req, res) => {
    await delay(10000);
    res.status(200).json({ status: 'success', responseTime: 10000, message: "Very high Latency" });
});




module.exports = router;