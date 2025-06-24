<script setup>

    defineProps({ personagem: Object })

</script>

<template>
    <div class="card">
        <img :src="personagem.image" alt="Imagem do personagem" class="card-img" />
        <div class="card-body">
            <h2>{{ personagem.name }}</h2>
            <p><strong>Status:</strong> {{ personagem.status }}</p>
            <p><strong>Espécie:</strong> {{ personagem.species }}</p>
        </div>
    </div>
</template>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    background-color: #fff;
    transition: transform 0.2s ease;
    max-width: 220px;
    margin: 10px;
}

.card:hover {
    transform: scale(1.03);
}

.card-img {
    width: 100%;
    object-fit: cover;
}

.card-body {
    padding: 16px;
    text-align: center;
}

.card-body h2 {
    margin-bottom: 8px;
    font-size: 1.2rem;
    color: #333;
}

.card-body p {
    margin: 4px 0;
    font-size: 0.95rem;
    color: #555;
}
</style>
