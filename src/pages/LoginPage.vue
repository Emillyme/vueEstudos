<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const router = useRouter()

const mostrarLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const response = await axios.post('https://dummyjson.com/auth/login', {
      username: username.value,
      password: password.value
    })
    console.log('Login feito com sucesso:', response.data)
    router.push('/home')
  } catch (error) {
    console.error('Erro no login:', error)
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Erro ao tentar fazer login. Verifique suas credenciais.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>

    <div class="form-group">
      <label>Usuário</label>
      <input type="text" v-model="username" placeholder="Digite seu usuário" />
    </div>

    <div class="form-group">
      <label>Senha</label>
      <input type="password" v-model="password" placeholder="Digite sua senha" />
    </div>

    <button @click="mostrarLogin" :disabled="isLoading">
      {{ isLoading ? 'Entrando...' : 'Entrar' }}
    </button>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fefefe;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #a0d5be;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #369f75;
}

.error {
  color: #d9534f;
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
}
</style>
