<template>
  <div class="main-layout">
    <nav class="sidebar">
      <h2>Panel QA</h2>
      <button @click="seccionActual = 'Login'" :class="{ active: seccionActual === 'Login' }">
        Módulo de Pruebas de Autenticación
      </button>
      <button @click="seccionActual = 'Webhook'" :class="{ active: seccionActual === 'Webhook' }">
        Módulo de Pruebas de Webhooks
      </button>
      <button @click="seccionActual = 'Errors'" :class="{ active: seccionActual === 'Errors' }">
        Módulo de Simulación de Errores
      </button>
    </nav>

    <main class="content">
      <div v-if="seccionActual === 'Login'">
        <Login />
      </div>

      <div v-else-if="seccionActual === 'Webhook'">
        <Webhook />
      </div>

      <div v-else-if="seccionActual === 'Errors'">
        <Errors />
      </div>

      <div v-else>
        <p>Selecciona una opción del menú para comenzar.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import Login from '../src/components/Login.vue';
import Webhook from '../src/components/Webhook.vue';
import Errors from '../src/components/Errors.vue';

const seccionActual = ref('');
</script>

<style scoped>

.main-layout {
  display: flex;
  font-family: sans-serif;
  height: 100vh;
}

.sidebar {
  width: 200px;
  background: #000000;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-right: 1px solid #ddd;
  color: white;
}

.sidebar button {
  padding: 10px;
  cursor: pointer;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
}

.sidebar button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.content {
  flex: 1;
  padding: 40px;
}

h2 {
  font-size: 1.2rem;
  margin-bottom: 20px;
}
</style>

