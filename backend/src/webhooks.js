const express = require("express");
const router = express.Router();

// Tipos de eventos permitidos (CP-008)
const SUPPORTED_EVENTS = ['user.created', 'order.created'];

router.post('/webhooks', (req, res) => {
    const payload = req.body;

    // Validar JSON malformado
    if (req.invalidJson) {
        return res.status(400).json({
            status: "error",
            code: "INVALID_PAYLOAD",
        });
    }

    // Validar payload vacío
    if (Object.keys(payload).length === 0) {
        return res.status(400).json({
            status: "error",
            code: "EMPTY_PAYLOAD",
        });
    }

    // Validar campos requeridos
    const missingFields = [];
    if (!payload.event) missingFields.push('event');
    if (!payload.data) missingFields.push('data');

    if (missingFields.length > 0) {
        return res.status(400).json({
            status: "error",
            code: "MISSING_REQUIRED_FIELD",
        });
    }

    // Validar tipos de datos
    if (payload.event === 'order.created' && typeof payload.data.amount !== 'number') {
        return res.status(400).json({
            //error_code: 'INVALID_DATA' 
            status: "error",
            code: "INVALID_DATA",
        });
    }

    // Validar eventos soportados
    if (!SUPPORTED_EVENTS.includes(payload.event)) {
        return res.status(400).json({
            //error_code: 'UNSUPPORTED_EVENT' 
            status: "error",
            code: "UNSUPPORTED_EVENT",
        });
    }

    return res.status(200).json({
        status: "success",
        code: "SUCCESSFUL_WEBHOOK",
    });
});

module.exports = router;