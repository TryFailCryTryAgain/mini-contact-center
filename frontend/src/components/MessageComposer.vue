<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ send: [text: string] }>()

const text = ref('')

function handleSubmit() {
  if (!text.value.trim()) return
  emit('send', text.value)
  text.value = ''
}
</script>

<template>
  <form class="composer" @submit.prevent="handleSubmit">
    <input
      v-model="text"
      type="text"
      placeholder="Type a message…"
      autocomplete="off"
    />
    <button type="submit" class="send-btn" :disabled="!text.trim()">Send</button>
  </form>
</template>

<style scoped>
.composer {
  border-top: 1px solid var(--color-gray-light);
  padding: 14px 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  background: var(--color-white);
}

.composer input {
  flex: 1;
  font-family: var(--font-primary);
  font-size: 0.9rem;
  padding: 10px 14px;
  border: 1px solid var(--color-gray-light);
  border-radius: 10px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.composer input:focus-visible {
  border-color: var(--color-purple);
  box-shadow: 0 0 0 3px rgba(91, 42, 134, 0.15);
}

.send-btn {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-bold);
  font-size: 0.88rem;
  color: var(--color-white);
  background: var(--color-purple);
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  cursor: pointer;
  transition: background 0.15s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: var(--color-purple-dark);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>