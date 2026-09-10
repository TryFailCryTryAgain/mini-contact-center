import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const username = ref<string | null>(null)
  const token = ref<string | null>(null)

  async function login(user: string, pass: string) {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new Error(body?.message ?? 'Invalid username or password.')
    }
    const data = await res.json()
    username.value = data.user.username
    token.value = data.token
  }

  async function register(user: string, pass: string) {
    const res = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new Error(body?.message ?? 'Could not create account.')
    }
    await login(user, pass)
  }

  function logout() {
    username.value = null
    token.value = null
  }

  return { username, token, login, register, logout }
})