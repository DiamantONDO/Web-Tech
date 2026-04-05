<script setup lang="ts">
import { computed } from "vue";
import { useTaskStore } from "@/stores/useTaskStore";
import { useUserStore } from "@/stores/useUserStore";

const taskStore = useTaskStore();
const userStore = useUserStore();

const inProgressTasks = computed(() =>
  taskStore.tasks.filter(t => t.status === "inprogress")
);

const priorityColor = (priority: string) => {
  if (priority === "High")   return "#b91c1c";
  if (priority === "Normal") return "#92400e";
  return "#15803d";
};

const priorityBg = (priority: string) => {
  if (priority === "High")   return "#fee2e2";
  if (priority === "Normal") return "#fef9c3";
  return "#dcfce7";
};

const isOverdue = (dueDate: string) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

const completeTask = (id: number) => {
  taskStore.completeTask(id);
  alert("Task marked as complete!");
};

const deleteTask = (id: number) => {
  if (confirm("Delete this task?")) {
    taskStore.deleteTask(id);
  }
};
</script>

<template>
  <div>

    <div class="page-header">
      <div>
        <h1 class="page-title">In Progress</h1>
        <p class="page-subtitle"></p>
      </div>
    </div>

    <p v-if="inProgressTasks.length === 0" class="empty-msg">
      No tasks in progress. Go to To-Do and click "Start" on a task!
    </p>

    <div v-else class="card-grid">
      <div v-for="task in inProgressTasks" :key="task.id" class="card">

        <div class="card-top">
          <h3 class="card-title">{{ task.title }}</h3>
          <span
            class="priority-badge"
            :style="{ color: priorityColor(task.priority), backgroundColor: priorityBg(task.priority) }"
          >
            {{ task.priority }}
          </span>
        </div>

        <p class="card-meta">{{ task.category }}</p>
        <p
          class="card-meta"
          :style="{ color: isOverdue(task.dueDate) ? '#e74c3c' : 'gray' }"
        >
          Due: {{ task.dueDate || "No date set" }}
        </p>

        <div class="assigned-row" v-if="task.assignedTo.length > 0">
          <span
            v-for="userId in task.assignedTo"
            :key="userId"
            class="assigned-badge"
          >
            {{ userStore.getUserById(userId)?.name ?? "Unknown" }}
          </span>
        </div>

        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <p class="progress-label">In progress</p>

        <div class="card-actions">
          <button class="btn-delete"   @click="deleteTask(task.id)">Delete</button>
          <button class="btn-complete" @click="completeTask(task.id)">Complete</button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 26px;
  color: #1e3a8a;
  margin: 0 0 4px;
}

.page-subtitle {
  font-size: 14px;
  color: gray;
  margin: 0;
}

.empty-msg {
  text-align: center;
  color: gray;
  font-size: 14px;
  padding: 48px 0;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  border: 1px solid #ddd;
  padding: 18px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.card-title {
  font-size: 15px;
  color: #1e3a8a;
  margin: 0;
}

.priority-badge {
  font-size: 11px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 20px;
  flex-shrink: 0;
}

.card-meta {
  font-size: 13px;
  color: gray;
  margin: 4px 0;
}

.assigned-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.assigned-badge {
  font-size: 11px;
  background-color: #fef3c7;
  color: #92400e;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: bold;
}

.progress-bar {
  height: 4px;
  background-color: #e8edf8;
  border-radius: 2px;
  margin: 12px 0 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 55%;
  background-color: rgb(212, 149, 40);
  border-radius: 2px;
}

.progress-label {
  font-size: 11px;
  color: rgb(212, 149, 40);
  font-weight: bold;
  margin: 0 0 10px;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
}

.btn-complete {
  background-color: #1e3a8a;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
}
</style>