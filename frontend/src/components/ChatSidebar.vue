<script setup lang="ts">
defineProps<{
  username: string
  onlineUsers: string[]
}>()

const emit = defineEmits<{ signOut: [] }>()
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <p class="sidebar-title">Mini Contact Center</p>
      <p class="sidebar-subtitle">{{ onlineUsers.length }} online</p>
    </div>

    <ul class="contact-list">
      <li v-for="user in onlineUsers" :key="user" class="contact">
        <div class="avatar">{{ user.slice(0, 2).toUpperCase() }}<span class="status-dot"></span></div>
        <div>
          <div class="contact-name">{{ user }}</div>
          <div class="contact-status">Online</div>
        </div>
      </li>
    </ul>

    <div class="sidebar-footer">
      <div class="me">
        <div class="avatar avatar-self">{{ username.slice(0, 2).toUpperCase() }}</div>
        <span class="me-name">{{ username }}</span>
      </div>
      <button class="logout-btn" type="button" @click="emit('signOut')">Sign out</button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  flex-shrink: 0;
  border-right: 1px solid var(--color-gray-light);
  display: flex;
  flex-direction: column;
  background: var(--color-white);
}

.sidebar-header {
  padding: 20px 18px;
  border-bottom: 1px solid var(--color-gray-light);
}

.sidebar-title {
  font-family: var(--font-primary);
  font-size: 0.95rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-black);
  margin: 0 0 2px;
}

.sidebar-subtitle {
  font-family: var(--font-primary);
  font-size: 0.78rem;
  color: var(--color-gray);
  margin: 0;
}

.contact-list {
  list-style: none;
  margin: 0;
  padding: 8px;
  overflow-y: auto;
  flex: 1;
}

.contact {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--color-purple);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-primary);
  font-size: 0.8rem;
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
  position: relative;
}

.avatar-self {
  background: var(--color-black);
}

.status-dot {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--color-success);
  border: 2px solid var(--color-white);
}

.contact-name {
  font-family: var(--font-primary);
  font-size: 0.88rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-black);
}

.contact-status {
  font-family: var(--font-primary);
  font-size: 0.75rem;
  color: var(--color-gray);
}

.sidebar-footer {
  padding: 14px 18px;
  border-top: 1px solid var(--color-gray-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.me {
  display: flex;
  align-items: center;
  gap: 10px;
}

.me-name {
  font-family: var(--font-primary);
  font-size: 0.85rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-black);
}

.logout-btn {
  font-family: var(--font-primary);
  font-size: 0.78rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}
</style>