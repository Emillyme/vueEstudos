<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Refs para armazenar estado da aplicação
const tarefas = ref([])          // Lista de tarefas
const novaTarefa = ref('')       // Texto da nova tarefa que será adicionada
const tarefaEditando = ref(null) // ID da tarefa que está em modo edição (null se nenhuma)
const textoEditando = ref('')    // Texto da tarefa enquanto está sendo editada
const loading = ref(false)        // Estado de carregamento (para bloquear UI)
const error = ref('')             // Mensagem de erro, se houver

// URL base da API fake para testes
const API_URL = 'https://jsonplaceholder.typicode.com/posts'

// Função para buscar a lista de tarefas (Read)
async function buscarTarefas() {
  loading.value = true    // ativa loading
  error.value = ''        // limpa erro anterior
  try {
    // Requisição GET para buscar tarefas, limitando a 20
    const res = await axios.get(API_URL + '?_limit=20')
    tarefas.value = res.data   // atualiza lista com dados recebidos
  } catch (e) {
    error.value = 'Erro ao carregar tarefas.' // trata erro
  } finally {
    loading.value = false   // desativa loading
  }
}

// Função para criar nova tarefa (Create)
async function adicionarTarefa() {
  if (!novaTarefa.value.trim()) return  // evita criar tarefa vazia
  loading.value = true
  error.value = ''
  try {
    // POST para criar uma tarefa nova na API
    const res = await axios.post(API_URL, {
      title: novaTarefa.value,
      body: '', // campo body vazio (não usado aqui)
      userId: 1 // campo obrigatório na API
    })
    // Insere a nova tarefa no começo da lista local
    tarefas.value.unshift(res.data)
    novaTarefa.value = '' // limpa o input
  } catch (e) {
    error.value = 'Erro ao adicionar tarefa.'
  } finally {
    loading.value = false
  }
}

// Função para deletar tarefa (Delete)
async function deletarTarefa(id) {
  loading.value = true
  error.value = ''
  try {
    // DELETE na API usando o id da tarefa
    await axios.delete(`${API_URL}/${id}`)
    // Remove localmente a tarefa deletada
    tarefas.value = tarefas.value.filter(t => t.id !== id)
  } catch (e) {
    error.value = 'Erro ao deletar tarefa.'
  } finally {
    loading.value = false
  }
}

// Função para iniciar a edição de uma tarefa
function iniciarEdicao(tarefa) {
  tarefaEditando.value = tarefa.id      // seta o id da tarefa editando
  textoEditando.value = tarefa.title    // carrega texto atual para edição
}

// Função para salvar edição da tarefa (Update)
async function salvarEdicao(tarefa) {
  if (!textoEditando.value.trim()) return // evita salvar texto vazio
  loading.value = true
  error.value = ''
  try {
    // PUT para atualizar tarefa na API
    const res = await axios.put(`${API_URL}/${tarefa.id}`, {
      ...tarefa,
      title: textoEditando.value   // novo título
    })
    // Atualiza localmente o item com os dados atualizados
    const index = tarefas.value.findIndex(t => t.id === tarefa.id)
    if (index !== -1) tarefas.value[index] = res.data
    tarefaEditando.value = null   // sai do modo edição
  } catch (e) {
    error.value = 'Erro ao editar tarefa.'
  } finally {
    loading.value = false
  }
}

// Função para cancelar edição (voltar ao modo visualização)
function cancelarEdicao() {
  tarefaEditando.value = null
}

// Ao montar o componente, buscar a lista inicial de tarefas
onMounted(() => {
  buscarTarefas()
})
</script>

<template>
  <div class="app">
    <h1>Lista de Tarefas (CRUD com API)</h1>

    <!-- Input para nova tarefa + botão de adicionar -->
    <div class="input-group">
      <input
        v-model="novaTarefa"
        @keyup.enter="adicionarTarefa"
        placeholder="Nova tarefa"
        :disabled="loading"
        class="input-text"
      />
      <button @click="adicionarTarefa" :disabled="loading" class="btn btn-primary">
        Adicionar
      </button>
    </div>

    <!-- Mensagem de erro, se existir -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Mensagem de carregamento -->
    <p v-if="loading && tarefas.length === 0" class="loading">Carregando tarefas...</p>

    <!-- Lista de tarefas -->
    <ul class="lista-tarefas">
      <li v-for="tarefa in tarefas" :key="tarefa.id" class="tarefa-item">

        <!-- Se a tarefa está em modo edição, mostrar inputs de edição -->
        <template v-if="tarefaEditando === tarefa.id">
          <input v-model="textoEditando" :disabled="loading" class="input-text edit" />
          <button @click="salvarEdicao(tarefa)" :disabled="loading" class="btn btn-success">Salvar</button>
          <button @click="cancelarEdicao" :disabled="loading" class="btn btn-cancel">Cancelar</button>
        </template>

        <!-- Caso contrário, mostrar a tarefa normalmente com botões -->
        <template v-else>
          <span class="tarefa-texto">{{ tarefa.title }}</span>
          <button @click="iniciarEdicao(tarefa)" :disabled="loading" class="btn btn-edit">Editar</button>
          <button @click="deletarTarefa(tarefa.id)" :disabled="loading" class="btn btn-delete">Deletar</button>
        </template>

      </li>
    </ul>
  </div>
</template>

<style scoped>
.app {
  max-width: 600px;
  margin: 2rem auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.1);
  color: #333;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.input-group {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.input-text {
  flex-grow: 1;
  padding: 0.6rem 1rem;
  border: 1.8px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-text:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 6px #42b983aa;
}

.btn {
  padding: 0.55rem 1.2rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.25s ease;
  color: white;
  user-select: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #42b983;
}

.btn-primary:hover:not(:disabled) {
  background-color: #389e6b;
}

.btn-success {
  background-color: #28a745;
}

.btn-success:hover:not(:disabled) {
  background-color: #1e7e34;
}

.btn-cancel {
  background-color: #6c757d;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #565e64;
}

.btn-edit {
  background-color: #3498db;
  margin-left: 1rem;
}

.btn-edit:hover:not(:disabled) {
  background-color: #217dbb;
}

.btn-delete {
  background-color: #e74c3c;
  margin-left: 0.5rem;
}

.btn-delete:hover:not(:disabled) {
  background-color: #b43c2c;
}

.lista-tarefas {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tarefa-item {
  background: white;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  margin-bottom: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 6px rgba(0,0,0,0.05);
}

.tarefa-texto {
  flex: 1;
  font-size: 1rem;
  color: #2d2d2d;
  word-break: break-word;
}

input.edit {
  flex-grow: 1;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1.5px solid #aaa;
  border-radius: 8px;
  margin-right: 0.7rem;
}

.loading {
  text-align: center;
  color: #666;
  font-style: italic;
  margin-top: 1rem;
}

.error {
  color: #cc0000;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;
}
</style>
