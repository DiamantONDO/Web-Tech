<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTaskStore } from "@/stores/useTaskStore";

const router    = useRouter();
const route     = useRoute();
const authStore = useAuthStore();
const taskStore = useTaskStore();

const currentUserId = computed(() => authStore.currentUser?.id ?? -1);

const initials = computed(() => {
  const name = authStore.currentUser?.name ?? "";
  return name.split(" ").map((n: string) => n[0]).join("").toUpperCase();
});

// Counts scoped to logged-in user
const myTasks        = computed(() => taskStore.tasks.filter(t => t.assignedTo.includes(currentUserId.value)));
const todoCount      = computed(() => myTasks.value.filter(t => t.status === "todo").length);
const progressCount  = computed(() => myTasks.value.filter(t => t.status === "inprogress").length);
const completedCount = computed(() => myTasks.value.filter(t => t.status === "completed").length);

// Inbox badge — pending shares for logged-in user
const inboxCount = computed(() =>
  taskStore.sharedTasks.filter(
    s => s.toUserId === currentUserId.value && s.status === "pending"
  ).length
);

const logout = () => {
  authStore.logout();
  router.push("/login");
};

const isActive = (name: string) => route.name === name;
</script>

<template>
  <div class="taskbuddy-layout">

    <aside class="sidebar">

      <RouterLink to="/taskbuddy" class="logo-link">
        <h2 class="logo">TaskBuddy</h2>
      </RouterLink>

      <ul class="menu">

        <li :class="{ active: isActive('dashboard') }"
            @click="router.push('/taskbuddy/dashboard')">
          Dashboard
          <!-- Inbox notification badge on dashboard -->
          <span class="count inbox" v-if="inboxCount > 0">{{ inboxCount }} new</span>
        </li>

        <li :class="{ active: isActive('mytasks') }"
            @click="router.push('/taskbuddy/my-tasks')">
          My Tasks
          <span class="count" v-if="myTasks.length > 0">{{ myTasks.length }}</span>
        </li>

        <li :class="{ active: isActive('todo') }"
            @click="router.push('/taskbuddy/to-do')">
          To-Do
          <span class="count" v-if="todoCount > 0">{{ todoCount }}</span>
        </li>

        <li :class="{ active: isActive('inprogress') }"
            @click="router.push('/taskbuddy/in-progress')">
          In-Progress
          <span class="count progress" v-if="progressCount > 0">{{ progressCount }}</span>
        </li>

        <li :class="{ active: isActive('completed') }"
            @click="router.push('/taskbuddy/completed')">
          Completed
          <span class="count done" v-if="completedCount > 0">{{ completedCount }}</span>
        </li>

      </ul>

      <div class="account-section">
        <div class="avatar">{{ initials }}</div>
        <span class="username">{{ authStore.currentUser?.name }}</span>
        <span class="user-role">{{ authStore.currentUser?.role }}</span>
        <button class="logout-btn" @click="logout">Log out</button>
      </div>

    </aside>

    <main class="main-content">
      <router-view />
    </main>

  </div>
</template>

<style scoped>
.taskbuddy-layout {
  display: flex; min-height: 100vh;
  font-family: Arial, Helvetica, sans-serif; background: #f9fafb;
}
.sidebar {
  width: 220px; background-color: white; color: #1e3a8a;
  display: flex; flex-direction: column;
  padding: 20px; border-right: 1px solid #e8edf8;
}
.logo { font-size: 24px; font-weight: bold; margin-bottom: 24px; }
.logo-link { text-decoration: none; color: inherit; cursor: pointer; }

.menu { list-style: none; padding: 0; margin: 0; flex: 1; }
.menu li {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; cursor: pointer; border-radius: 6px;
  margin-bottom: 6px; transition: background 0.2s; font-size: 14px;
}
.menu li:hover { background: #f4f6fb; }
.menu li.active { background: #e8edf8; color: #1e3a8a; font-weight: bold; }

.count {
  font-size: 11px; font-weight: bold;
  background-color: #e8edf8; color: #1e3a8a;
  padding: 1px 7px; border-radius: 20px;
}
.count.progress  { background-color: rgba(212,149,40,0.2); color: rgb(212,149,40); }
.count.done      { background-color: #dcfce7; color: #15803d; }
.count.inbox     { background-color: rgba(212,149,40,0.9); color: white; }

.account-section {
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; margin-top: auto; padding-top: 20px;
  border-top: 1px solid #e8edf8;
}
.avatar {
  width: 50px; height: 50px; border-radius: 50%;
  background-color: #1e3a8a; color: white;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; font-size: 18px;
}
.username { font-size: 14px; font-weight: bold; color: #1e3a8a; text-align: center; }
.user-role {
  font-size: 11px; color: gray;
  background-color: #f4f6fb; padding: 1px 8px; border-radius: 20px;
}
.logout-btn {
  background: #1e3a8a; color: white; border: none;
  border-radius: 6px; padding: 7px 20px; cursor: pointer;
  font-weight: bold; font-size: 13px; margin-top: 4px; width: 100%;
  transition: background-color 0.2s;
}
.logout-btn:hover { background-color: #162d6b; }
.main-content { flex-grow: 1; padding: 30px 40px; overflow-y: auto; }
</style>