<!-- src/views/SignInView.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

async function handleSubmit() {
  error.value = ''

  if (!username.value.trim() || !password.value) {
    error.value = 'Enter a username and password.'
    return
  }

  loading.value = true
  try {
    await auth.login(username.value.trim(), password.value)
    router.push('/chat')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Something went wrong.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">Sign in</h1>
      <p class="auth-subtitle">Sign in to start chatting.</p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <label class="field">
          <span class="field-label">Username</span>
          <input
            v-model="username"
            type="text"
            autocomplete="username"
            placeholder="e.g. alexander"
          />
        </label>

        <label class="field">
          <span class="field-label">Password</span>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="At least 8 characters"
          />
        </label>

        <p v-if="error" class="form-error">{{ error }}</p>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Please wait…' : 'Sign in' }}
        </button>
      </form>

      <p class="switch-mode">
        Don't have an account?
        <RouterLink to="/register" class="link-btn">Create one</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-light);
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 380px;
  background: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: 12px;
  padding: 40px 32px;
}

.auth-title {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-bold);
  font-size: 1.5rem;
  color: var(--color-black);
  margin: 0 0 8px;
}

.auth-subtitle {
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--color-gray);
  margin: 0 0 28px;
  line-height: 1.5;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: var(--font-primary);
  font-size: 0.8rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-black);
}

input {
  font-family: var(--font-primary);
  font-size: 0.95rem;
  padding: 10px 12px;
  border: 1px solid var(--color-gray-light);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

input:focus-visible {
  border-color: var(--color-purple);
  box-shadow: 0 0 0 3px rgba(91, 42, 134, 0.15);
}

.form-error {
  font-family: var(--font-primary);
  font-size: 0.85rem;
  color: var(--color-error);
  margin: 0;
}

.submit-btn {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-bold);
  font-size: 0.95rem;
  color: var(--color-white);
  background: var(--color-purple);
  border: none;
  border-radius: 8px;
  padding: 11px 16px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-purple-dark);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-mode {
  font-family: var(--font-primary);
  font-size: 0.85rem;
  color: var(--color-gray);
  text-align: center;
  margin: 24px 0 0;
}

.link-btn {
  font-family: var(--font-primary);
  font-size: 0.85rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-purple);
  text-decoration: underline;
}
</style>