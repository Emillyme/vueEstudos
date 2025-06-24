<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import PersonagemCard from '../components/BoxCharacter.vue'

const personagens = ref([])
const busca = ref('')

const personagensFiltrados = computed(() => {
  return personagens.value.filter(personagem =>
    personagem.name.toLowerCase().includes(busca.value.toLowerCase())
  )
})

onMounted(async () => {
  const response = await axios.get('https://rickandmortyapi.com/api/character')
  personagens.value = response.data.results
})
</script>

<template>
  <div class="container">
    <h1>🛸 Rick and Morty - Personagens</h1>

    <input
      v-model="busca"
      type="text"
      placeholder="Buscar personagem..."
      class="input-busca"
    />

    <div v-if="personagens.length" class="cards-container">
      <PersonagemCard
        v-for="personagem in personagensFiltrados"
        :key="personagem.id"
        :personagem="personagem"
      />
    </div>

    <p v-else class="loading">Carregando personagens...</p>
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  font-size: 2rem;
  color: #3c3c3c;
  margin-bottom: 24px;
}

.input-busca {
  width: 100%;
  max-width: 400px;
  display: block;
  margin: 0 auto 30px auto;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.loading {
  text-align: center;
  color: #777;
  margin-top: 30px;
}
</style>
