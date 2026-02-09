<template>
  <div>
    <h2>Simulación de errores</h2>

    <p>Selecciona un escenario de prueba:</p>
    <select class="form-select" v-model="scenario">
      <option value="bad_request">Bad Request</option>
      <option value="unauthorized">Unauthorized</option>
      <option value="forbidden">Forbidden</option>
      <option value="not_found">Not found</option>
      <option value="request_timeout">Request Timeout</option>
      <option value="validation_error">Error de validación</option>
      <option value="internal_server_error">Internal Server Error</option>
      <option value="bad_gateway">Bad Gateway</option>
      <option value="service_unavailable">Service Unavailable</option>
      <option value="gateway_timeout">Gateway Timeout</option>
      <option value="excellent_latency">Latencia excelente</option>
      <option value="normal_latency">Latencia normal</option>
      <option value="high_latency">Latencia alta</option>
      <option value="very_high_latency">Latencia muy alta</option>
    </select>

    <button class="btn-primary" @click="runTest" >Run</button>

    <div v-if="loading">Loading...</div>

    <div class="response" v-if="response">
      <p class="response-status">Status: {{ response.status }}</p>
      <p>Response:</p>
      <pre class="response-data">{{ response.data }}</pre>
    </div>
  </div>
</template>

<script>
import { errorsTest } from "../services/api";

export default {
  data() {
    return {
      scenario: "bad_request",
      response: null,
      loading: false
    };
  },
  methods: {
    async runTest() {
      this.loading = true;
      this.response = null;

      try {
        this.response = await errorsTest(this.scenario);
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