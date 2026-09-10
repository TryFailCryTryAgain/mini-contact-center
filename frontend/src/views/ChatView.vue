<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'
import { useChatStore } from '@/stores/chat.ts'
import ChatSidebar from '@/components/ChatSidebar.vue'
import MessageThread from '@/components/MessageThread.vue'
import MessageComposer from '@/components/MessageComposer.vue'

const auth = useAuthStore()
const chat = useChatStore()
const router = useRouter()

onMounted(() => {
  chat.connect()
})

onUnmounted(() => {
  chat.disconnect()
})

function handleSignOut() {
  chat.disconnect()
  auth.logout()
  router.push('/')
}
</script>

<template>
  <div class="chat-shell">
    <ChatSidebar
      :username="auth.username ?? ''"
      :online-users="chat.onlineUsers"
      @sign-out="handleSignOut"
    />

    <section class="chat-main">
      <header class="chat-header">
        <p class="chat-header-title">General</p>
        <span class="connection-pill" :class="{ disconnected: !chat.connected }">
          {{ chat.connected ? 'Connected' : 'Reconnecting…' }}
        </span>
      </header>

      <MessageThread :messages="chat.messages" :current-username="auth.username ?? ''" />
      <MessageComposer @send="chat.sendMessage" />
    </section>
  </div>
</template>

<style scoped>
.chat-shell {
  height: 100vh;
  display: flex;
  background: var(--color-gray-light);
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--color-white);
}

.chat-header {
  padding: 18px 24px;
  border-bottom: 1px solid var(--color-gray-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-header-title {
  font-family: var(--font-primary);
  font-size: 0.95rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-black);
  margin: 0;
}

.connection-pill {
  font-family: var(--font-primary);
  font-size: 0.72rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-success);
  background: #E7F3E8;
  padding: 4px 10px;
  border-radius: 999px;
}

.connection-pill.disconnected {
  color: var(--color-error);
  background: #FBEAE9;
}
</style>