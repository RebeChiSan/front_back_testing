const BASE_URL = "http://localhost:3000";

export const loginTest = async (scenario) => {
  const scenariosData = {
    "success": { email: "user@example.com", password: "Password123!" },
    "empty_field_email": { email: "", password: "Password123!" },
    "empty_field_password": { email: "user@example.com", password: "" },
    "empty_fields": { email: "", password: "" },
    "invalid_email_format_1": { email: "usuario-sin-arroba", password: "Password123!" },
    "invalid_email_format_2": { email: "usuario@", password: "Password123!" },
    "account_blocked": { email: "blocked@example.com", password: "Password123!" },
    "invalid_email": { email: "noexiste@example.com", password: "Password123!" },
    "invalid_password": { email: "user@example.com", password: "PasswordIncorrecta" },
    "sql_injection_email": { email: "' OR 1=1 --", password: "Password123!" },
    "sql_injection_password": { email: "user@example.com", password: "' OR '1'='1" },
    "xss_email": { email: '<script>alert("xss")</script>@example.com', password: 'Password123!' },
    "xss_password": { email: "user@example.com", password: "<script>alert('xss')</script>" },
  };

  const bodyData = scenariosData[scenario] || {};

  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Test-Scenario": scenario
    },
    body: JSON.stringify(bodyData)
  });

  const data = await res.json();
  return { status: res.status, data };
};


export const webhooksTest = async (scenario) => {
  const scenariosData = {
    "success": { event: "user.created", data: { id: 1, name: "John Doe" } },
    "invalid_payload": '{"event": "test", "data": {invalid json}',
    "missing_data": { event: "user.created" },
    "missing_event": { data: { id: 1, name: "John Doe" } },
    "invalid_data": { event: "order.created", data: { order_id: 12345, amount: "invalid" } },
    "empty_payload": {},
    "unsopported_event": { event: "unknown.event.type", data: {} },
  };

  const bodyData = scenariosData[scenario] || {};

  const res = await fetch(`${BASE_URL}/api/service/webhooks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Test-Scenario": scenario
    },
    body: JSON.stringify(bodyData)
  });

  const data = await res.json();
  return { status: res.status, data };
};


export const errorsTest = async (scenario) => {
  const scenariosData = {
    "bad_request": {
      method: "POST",
      path: "/users",
      body: { name: "John Doe", email: "invalid-email-format", age: 30 },
      description: "Email con formato incorrecto dispara el 400"
    },
    "unauthorized": {
      method: "GET",
      path: "/protected",
      headers: {},
      description: "Falta el token Bearer"
    },
    "forbidden": {
      method: "GET",
      path: "/admin/users",
      params: { id: "any-id" },
      description: "El endpoint admin siempre retorna 403 si el ID no existe en la lógica actual"
    },
    "not_found": {
      method: "GET",
      path: "/users/non-existent-id",
      description: "ID que no existe en el Map usersStore"
    },
    "request_timeout": {
      method: "POST",
      path: "/slow-operation",
      description: "Simulación forzada que devuelve 408 después de 2s"
    },
    "validation_error": {
      method: "POST",
      path: "/users",
      body: { name: "John Doe", email: "test@test.com", age: -5 },
      description: "Edad menor o igual a 0 dispara el 422"
    },
    "internal_server_error": {
      method: "POST",
      path: "/process",
      body: { trigger: "internal-error" },
      description: "Trigger específico para el 500"
    },
    "bad_gateway": {
      method: "GET",
      path: "/external-service",
      description: "Endpoint mockeado para retornar 502"
    },
    "service_unavailable": {
      method: "GET",
      path: "/maintenance",
      description: "Endpoint mockeado para retornar 503"
    },
    "gateway_timeout": {
      method: "GET",
      path: "/slow-external-service",
      description: "Endpoint mockeado para retornar 504"
    },
    "excellent_latency": {
      method: "GET",
      path: "/ping",
      description: "Respuesta inmediata (pong)"
    },
    "normal_latency": {
      method: "GET",
      path: "/search",
      description: "Simula latencia de 400ms"
    },
    "high_latency": {
      method: "POST",
      path: "/heavy-computation",
      description: "Simula latencia de 3000ms (3 segundos)"
    },
    "very_high_latency": {
      method: "POST",
      path: "/batch-process",
      description: "Simula latencia de 10000ms (10 segundos)"
    },
  };

  const config = scenariosData[scenario];

  try {
    const res = await fetch(`${BASE_URL}/api/mock${config.path}`, {
      method: config.method,
      headers: {
        "Content-Type": "application/json",
        ...(config.headers || {})
      },
      body: config.method !== "GET" ? JSON.stringify(config.body || {}) : undefined,
    });
    const contentType = res.headers.get("content-type");
    let data = null;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    return {
      status: res.status,
      data,
      headers: {
        retryAfter: res.headers.get("Retry-After"),
        rateLimitRemaining: res.headers.get("X-RateLimit-Remaining")
      }
    };
  } catch (error) {
    return { status: "CLIENT_ERROR", message: error.message };
  }
};