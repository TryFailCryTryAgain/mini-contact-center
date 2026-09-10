<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { ChatMessage } from '@/stores/chat'

const props = defineProps<{
  messages: ChatMessage[]
  currentUsername: string
}>()

const containerRef = ref<HTMLElement | null>(null)

const rows = computed(() =>
  props.messages.map((m) => ({
    ...m,
    isSelf: m.username === props.currentUsername,
    time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })),
)

watch(
  () => props.messages.length,
  async () => {
    await nextTick()
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  },
)
</script>

<template>
  <div class="messages" ref="containerRef">
    <div v-if="rows.length === 0" class="empty-state">
      No messages yet — say something to get things started.
    </div>

    <div
      v-for="(row, i) in rows"
      :key="i"
      class="message-row"
      :class="row.isSelf ? 'self' : 'other'"
    >
      <div class="sender-name" v-if="!row.isSelf">{{ row.username }}</div>
      <div class="bubble">{{ row.text }}</div>
      <div class="message-time">{{ row.time }}</div>
    </div>
  </div>
</template>

<style scoped>
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  margin: auto;
  font-family: var(--font-primary);
  font-size: 0.85rem;
  color: var(--color-gray);
}

.message-row {
  display: flex;
  flex-direction: column;
  max-width: 68%;
}

.message-row.self {
  align-self: flex-end;
  align-items: flex-end;
}

.message-row.other {
  align-self: flex-start;
  align-items: flex-start;
}

.sender-name {
  font-family: var(--font-primary);
  font-size: 0.72rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray);
  margin: 0 4px 3px;
}

.bubble {
  padding: 9px 14px;
  border-radius: 14px;
  font-family: var(--font-primary);
  font-size: 0.9rem;
  line-height: 1.45;
}

.message-row.self .bubble {
  background: var(--color-purple);
  color: var(--color-white);
  border-bottom-right-radius: 4px;
}

.message-row.other .bubble {
  background: var(--color-purple-light);
  color: var(--color-black);
  border-bottom-left-radius: 4px;
}

.message-time {
  font-family: var(--font-primary);
  font-size: 0.7rem;
  color: var(--color-gray);
  margin-top: 4px;
  padding: 0 4px;
}
</style>