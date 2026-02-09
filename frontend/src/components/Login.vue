<template>
  <div>
    <h2>Pruebas de Autenticación</h2>

    <p>Selecciona un escenario de prueba:</p>
    <select class="form-select" v-model="scenario">
      <option value="success">Login con credenciales validas</option>
      <option value="empty_field_email">Login sin email</option>
      <option value="empty_field_password">Login sin password</option>
      <option value="empty fields">Login sin ambos campos</option>
      <option value="invalid_email_format_1">Login con email sin @</option>
      <option value="invalid_email_format_2">Login con email sin dominio</option>
      <option value="account_blocked">Login con cuenta bloqueada</option>
      <option value="invalid_email">Login con email que no existe</option>
      <option value="invalid_password">Login con password incorrecto</option>
      <option value="sql_injection_email">Inyeccion SQL en email</option>
      <option value="sql_injection_password">Inyeccion SQL en password</option>
      <option value="xss_email">XSS en email</option>
      <option value="xss_password">XSS en password</option>
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
import { loginTest } from "../services/api";

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
        this.response = await loginTest(this.scenario);
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