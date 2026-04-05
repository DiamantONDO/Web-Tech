<script setup lang="ts">
import { computed } from "vue";
import { useTaskStore } from "@/stores/useTaskStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";

const taskStore  = useTaskStore();
const authStore  = useAuthStore();
const userStore  = useUserStore();

const currentUserId = computed(() => authStore.currentUser?.id ?? -1);

const myTasks        = computed(() => taskStore.tasks.filter(t => t.assignedTo.includes(currentUserId.value)));
const todoCount      = computed(() => myTasks.value.filter(t => t.status === "todo").length);
const progressCount  = computed(() => myTasks.value.filter(t => t.status === "inprogress").length);
const completedCount = computed(() => myTasks.value.filter(t => t.status === "completed").length);

const recentTasks = computed(() => [...myTasks.value].reverse().slice(0, 6));

// Pending shares addressed to the logged-in user
const inbox = computed(() =>
  taskStore.sharedTasks.filter(
    s => s.toUserId === currentUserId.value && s.status === "pending"
  )
);

const priorityColor = (p: string) =>
  p === "High" ? "#b91c1c" : p === "Normal" ? "#92400e" : "#15803d";

const priorityBg = (p: string) =>
  p === "High" ? "#fee2e2" : p === "Normal" ? "#fef9c3" : "#dcfce7";

const statusLabel = (s: string) =>
  s === "todo" ? "To Do" : s === "inprogress" ? "In Progress" : "Completed";

const statusColor = (s: string) =>
  s === "todo" ? "#1e3a8a" : s === "inprogress" ? "rgb(212,149,40)" : "#15803d";

const statusBg = (s: string) =>
  s === "todo" ? "#e8edf8" : s === "inprogress" ? "rgba(212,149,40,0.15)" : "#dcfce7";

const acceptShare = (shareId: number) => {
  taskStore.acceptShare(shareId, currentUserId.value);
  alert("Task accepted and added to your tasks!");
};

const rejectShare = (shareId: number) => {
  if (confirm("Reject this shared task?")) {
    taskStore.rejectShare(shareId);
  }
};
</script>

<template>
  <div>

    <h1 class="page-title">Dashboard</h1>
    <p class="page-subtitle">
      Welcome back, {{ authStore.currentUser?.name }}.
    </p>

    <div class="stat-grid">
      <div class="stat-card">
        <span class="stat-number">{{ todoCount }}</span>
        <span class="stat-label">To Do</span>
      </div>
      <div class="stat-card in-progress">
        <span class="stat-number">{{ progressCount }}</span>
        <span class="stat-label">In Progress</span>
      </div>
      <div class="stat-card completed">
        <span class="stat-number">{{ completedCount }}</span>
        <span class="stat-label">Completed</span>
      </div>
      <div class="stat-card total">
        <span class="stat-number">{{ myTasks.length }}</span>
        <span class="stat-label">Total Tasks</span>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">Recent Tasks</h3>

      <p v-if="myTasks.length === 0" class="empty-msg">
        No tasks yet. Go to My Tasks to create your first task.
      </p>

      <div v-else class="card-grid">
        <div v-for="task in recentTasks" :key="task.id" class="card">
          <div class="card-top">
            <h3 class="card-title">{{ task.title }}</h3>
            <span class="priority-badge"
              :style="{ color: priorityColor(task.priority), backgroundColor: priorityBg(task.priority) }">
              {{ task.priority }}
            </span>
          </div>
          <p class="card-meta">{{ task.category }}</p>
          <p class="card-meta">Due: {{ task.dueDate || "—" }}</p>
          <span class="status-pill"
            :style="{ color: statusColor(task.status), backgroundColor: statusBg(task.status) }">
            {{ statusLabel(task.status) }}
          </span>
        </div>
      </div>
    </div>

    <div class="section inbox-section">

      <h3 class="section-title">
        Shared With Me
        <span class="inbox-count" v-if="inbox.length > 0">{{ inbox.length }} pending</span>
      </h3>

      <p v-if="inbox.length === 0" class="empty-msg">
        No pending shared tasks. When someone shares a task with you it will appear here.
      </p>

      <div v-else class="inbox-list">
        <div v-for="share in inbox" :key="share.id" class="inbox-card">

          <div class="inbox-card-left">
            <div class="inbox-from">
              Shared by
              <strong>{{ userStore.getUserById(share.fromUserId)?.name ?? "Someone" }}</strong>
            </div>

            <h4 class="inbox-task-title">{{ share.taskSnapshot.title }}</h4>

            <div class="inbox-meta-row">
              <span class="priority-badge"
                :style="{ color: priorityColor(share.taskSnapshot.priority), backgroundColor: priorityBg(share.taskSnapshot.priority) }">
                {{ share.taskSnapshot.priority }}
              </span>
              <span class="inbox-meta">{{ share.taskSnapshot.category }}</span>
              <span class="inbox-meta">Due: {{ share.taskSnapshot.dueDate || "—" }}</span>
            </div>
          </div>

          <div class="inbox-actions">
            <button class="btn-accept" @click="acceptShare(share.id)">Accept</button>
            <button class="btn-reject" @click="rejectShare(share.id)">Reject</button>
          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
.page-title { font-size: 26px; color: #1e3a8a; margin-bottom: 6px; }
.page-subtitle { font-size: 14px; color: gray; margin-bottom: 28px; }

.stat-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px; margin-bottom: 32px;
}
.stat-card {
  background-color: white; border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07); padding: 24px;
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; border-top: 4px solid #1e3a8a;
}
.stat-card.in-progress { border-top-color: rgb(212, 149, 40); }
.stat-card.completed   { border-top-color: #15803d; }
.stat-card.total       { border-top-color: #6b7280; }
.stat-number { font-size: 36px; font-weight: bold; color: #1e3a8a; }
.stat-card.in-progress .stat-number { color: rgb(212, 149, 40); }
.stat-card.completed   .stat-number { color: #15803d; }
.stat-card.total       .stat-number { color: #6b7280; }
.stat-label { font-size: 13px; color: gray; font-weight: bold; }

.section {
  background-color: white; border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
  padding: 24px; margin-bottom: 24px;
}
.inbox-section { border-top: 3px solid rgb(212, 149, 40); }

.section-title {
  font-size: 16px; font-weight: bold; color: #1e3a8a;
  margin-bottom: 20px; padding-bottom: 10px;
  border-bottom: 2px solid #e8edf8;
  display: flex; align-items: center; gap: 12px;
}
.inbox-count {
  font-size: 12px; background-color: rgba(212,149,40,0.15);
  color: rgb(212,149,40); padding: 2px 10px;
  border-radius: 20px; font-weight: bold;
}

.empty-msg { text-align: center; color: gray; font-size: 14px; padding: 24px 0; }

.card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.card {
  border: 1px solid #e8edf8; border-radius: 10px;
  padding: 16px; background-color: #f9faff;
}
.card-top {
  display: flex; justify-content: space-between;
  align-items: flex-start; margin-bottom: 8px;
}
.card-title { font-size: 15px; color: #1e3a8a; margin: 0; }
.priority-badge {
  font-size: 11px; font-weight: bold;
  padding: 2px 8px; border-radius: 20px; flex-shrink: 0;
}
.card-meta { font-size: 12px; color: gray; margin: 3px 0; }
.status-pill {
  display: inline-block; margin-top: 10px; font-size: 11px;
  padding: 2px 10px; border-radius: 20px; font-weight: bold;
}

.inbox-list { display: flex; flex-direction: column; gap: 12px; }

.inbox-card {
  display: flex; justify-content: space-between; align-items: center;
  border: 1px solid #fde68a; border-radius: 10px;
  padding: 16px 20px; background-color: #fffbeb;
  gap: 16px;
}

.inbox-card-left { display: flex; flex-direction: column; gap: 6px; flex: 1; }

.inbox-from {
  font-size: 12px; color: gray;
}
.inbox-from strong { color: #1e3a8a; }

.inbox-task-title { font-size: 15px; color: #1e3a8a; margin: 0; font-weight: bold; }

.inbox-meta-row {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.inbox-meta { font-size: 12px; color: gray; }

.inbox-actions { display: flex; gap: 8px; flex-shrink: 0; }

.btn-accept {
  background-color: rgb(8, 170, 127); color: white; border: none;
  padding: 7px 16px; border-radius: 6px; cursor: pointer;
  font-size: 13px; font-weight: bold;
}
.btn-reject {
  background-color: #e74c3c; color: white; border: none;
  padding: 7px 16px; border-radius: 6px; cursor: pointer;
  font-size: 13px; font-weight: bold;
}
</style>