<script setup lang="ts">
import { computed } from "vue";
import { useTaskStore } from "@/stores/useTaskStore";
import { useUserStore } from "@/stores/useUserStore";

const taskStore = useTaskStore();
const userStore = useUserStore();

const completedTasks = computed(() =>
  taskStore.tasks.filter(t => t.status === "completed")
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

const deleteTask = (id: number) => {
  if (confirm("Remove this completed task?")) {
    taskStore.deleteTask(id);
  }
};
</script>

<template>
  <div>

    <div class="page-header">
      <div>
        <h1 class="page-title">Completed</h1>
        <p class="page-subtitle"></p>
      </div>
      <span class="count-badge" v-if="completedTasks.length > 0">
        {{ completedTasks.length }} done
      </span>
    </div>

    <p v-if="completedTasks.length === 0" class="empty-msg">
      No completed tasks yet. Finish a task in In Progress to see it here!
    </p>

    <div v-else class="card-grid">
      <div v-for="task in completedTasks" :key="task.id" class="card">

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
        <p class="card-meta">Due: {{ task.dueDate || "—" }}</p>

        <div class="assigned-row" v-if="task.assignedTo.length > 0">
          <span
            v-for="userId in task.assignedTo"
            :key="userId"
            class="assigned-badge"
          >
            {{ userStore.getUserById(userId)?.name ?? "Unknown" }}
          </span>
        </div>

        <div class="done-indicator">
          <span class="checkmark">✓</span>
          <span>Completed</span>
        </div>

        <div class="card-actions">
          <button class="btn-delete" @click="deleteTask(task.id)">Remove</button>
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

.count-badge {
  background-color: #dcfce7;
  color: #15803d;
  font-size: 13px;
  font-weight: bold;
  padding: 4px 14px;
  border-radius: 20px;
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
  opacity: 0.9;
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
  text-decoration: line-through;
  opacity: 0.7;
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
  background-color: #dcfce7;
  color: #15803d;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: bold;
}

.done-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 12px 0 8px;
  font-size: 13px;
  color: #15803d;
  font-weight: bold;
}

.checkmark {
  width: 20px;
  height: 20px;
  background-color: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.card-actions {
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
</style>