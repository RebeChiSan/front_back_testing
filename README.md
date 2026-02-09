## 📋 Descripción.

El proyecto combina un backend construido con Express.js y un frontend interactivo desarrollado con Vue.js 3, utilizando Docker para la orquestación de servicios.

La aplicación proporciona funcionalidades de autenticación, manejo de errores y webhooks, con pruebas unitarias para garantizar la calidad del código.

---

## 🎯 Habilidades y Conocimientos Adquiridos.

- **Automatización de Pruebas**: Implementación y ejecución de pruebas unitarias y de integración.
- **Testing en Backend**: Jest, Supertest para pruebas de API REST
- **Testing en Frontend**: Vitest, Vue Test Utils para componentes Vue
- **Desarrollo Full-Stack**: Backend con Express.js y Frontend con Vue.js 3
- **Docker y Containerización**: Dockerfiles, Docker Compose para gestión de servicios
- **RESTful API**: Diseño y consumo de APIs con CORS y manejo de errores
- **Gestión de Dependencias**: NPM y gestión de versiones en Node.js
- **Control de Versiones**: Git y buenas prácticas de desarrollo

---

## 📁 Estructura Base Simplificada del Proyecto.

```
sdet_challenge/
├── backend/                      # Servidor Express.js
│   ├── app.js                   # Punto de entrada del servidor
│   ├── Dockerfile               # Configuración Docker para backend
│   └── src/
│       ├── login.js             # Lógica de autenticación
│       ├── ...
│
├── frontend/                     # Aplicación Vue.js 3
│   ├── index.html               # HTML principal
│   ├── Dockerfile               # Configuración Docker para frontend
│   └── src/
│       ├── main.js              # Punto de entrada
│       ├── App.vue              # Componente raíz
│       ├── components/          # Componentes reutilizables
│       │   ├── Login.vue
│       │   ├── ...
│       └── services/
│           └── api.js           # Cliente HTTP para la API
│
├── docker-compose.yml            # Orquestación de servicios Docker
└── README.md                     # Este archivo

```

---

## 💻 Como Instalar este Proyecto.

### Requisitos Previos
- **Node.js**: v20.19.0 o superior (v22.12.0+)
- **npm**: Viene incluido con Node.js
- **Docker**: (Opcional, para ejecutar con containerización)
- **Docker Compose**: (Opcional, para orquestación)

### Pasos de Instalación.

### Instalando desde terminal
1. **Clonar o descargar el proyecto**
   ```bash
   git clone https://github.com/RebeChiSan/front_back_testing.git
   
   ```
---

## 🚀 Como Ejecutar este Proyecto.

### Ejecución Local (Recomendado para Desarrollo)

#### 1. Ejecutar el Backend

```bash
cd backend
npm start
```

El servidor estará disponible en `http://localhost:3000`

#### 2. Ejecutar el Frontend (en otra terminal)

```bash
cd frontend
npm run dev
```

El frontend estará disponible en `http://localhost:5173` (Vite dev server)

### Ejecución con Docker Compose

```bash
# Desde la raíz del proyecto
docker-compose up --build
```

Esto levantará automáticamente el backend y frontend necesarios para el proyecto:

El frontend estará disponible en `http://localhost:5173`

### Ejecución de Pruebas

#### Pruebas del Backend

```bash
cd backend

# Ejecutar todas las pruebas
npm test

```

#### Pruebas del Frontend

```bash
cd frontend

# Ejecutar todas las pruebas
npm test
```

### Scripts Disponibles

**Backend:**
- `npm start` - Inicia el servidor
- `npm test` - Ejecuta las pruebas

**Frontend:**
- `npm run dev` - Inicia el servidor de desarrollo con Vite
- `npm test` - Ejecuta las pruebas

---

## 📝 Notas Adicionales.
- Asegúrate de que los puertos necesarios estén disponibles antes de ejecutar.

frontend: 5173

backend: 3000

---

#### ✨ Autor: Rebeca Chiñas