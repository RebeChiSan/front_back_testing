<template>
  <div>
    <h2>Pruebas de Webhooks</h2>

    <p>Selecciona un escenario de prueba:</p>
    <select class="form-select" v-model="scenario">
      <option value="success">Webhook con payload válido y completo</option>
      <option value="missing_data">Webhook con campo data faltante</option>
      <option value="missing_event">Webhook con campo event faltante</option>
      <option value="invalid_data">Webhook con tipos de datos incorrectos</option>
      <option value="empty_payload">Webhook con payload vacío</option>
      <option value="unsopported_event">Webhook con tipo de evento no soportado</option>
    </select>

    <button class="btn-primary" @click="runTest" >Run</button>

    <div v-if="loading">Loading...</div>

    <div class="response" v-if="response">
      <p>Status: {{ response.status }}</p>
      <p>Response:</p>
      <pre>{{ response.data }}</pre>
    </div>
  </div>
</template>

<script>
import { webhooksTest } from "../services/api";

export default {
  data() {
    return {
      scenario: "success",
      response: null,
      loading: false
    };
  },
  methods: {
    async runTest() {
      this.loading = true;
      this.response = null;

      try {
        this.response = await webhooksTest(this.scenario);
      } catch (error) {
        this.response = { status: "Error", data: error.message };
      }finally {
        this.loading = false;
      }

    }
  }
};
</script>
<style scoped>
  .form-select{
    display: block;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }

  .btn-primary{
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 4px;
  }

  .response{
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f5f5f5; 
  }
</style>