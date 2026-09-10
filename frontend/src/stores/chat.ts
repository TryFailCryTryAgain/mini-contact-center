import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export interface ChatMessage {
  username: string
  text: string
  timestamp: number
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const onlineUsers = ref<string[]>([])
  const connected = ref(false)

  let socket: WebSocket | null = null

  function connect() {
    const auth = useAuthStore()
    if (!auth.token) {
      console.error('Cannot connect: no auth token.')
      return
    }

    socket = new WebSocket('ws://localhost:3000')

    socket.onopen = () => {
      connected.value = true
      socket?.send(JSON.stringify({ type: 'auth', token: auth.token }))
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      switch (data.type) {
        case 'message':
          messages.value.push({
            username: data.username,
            text: data.text,
            timestamp: data.timestamp,
          })
          break
        case 'presence':
          onlineUsers.value = data.users
          break
        case 'error':
          console.error('WebSocket error:', data.message)
          break
      }
    }

    socket.onclose = () => {
      connected.value = false
    }

    socket.onerror = (err) => {
      console.error('WebSocket connection error:', err)
    }
  }

  function sendMessage(text: string) {
    if (!text.trim() || !socket || socket.readyState !== WebSocket.OPEN) return
    socket.send(JSON.stringify({ type: 'message', text: text.trim() }))
  }

  function disconnect() {
    socket?.close()
    socket = null
    connected.value = false
    messages.value = []
    onlineUsers.value = []
  }

  return { messages, onlineUsers, connected, connect, sendMessage, disconnect }
})