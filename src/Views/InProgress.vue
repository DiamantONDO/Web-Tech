<script setup lang="ts">
import { ref, computed } from "vue";

interface Task {
  id: number;
  title: string;
  priority: "High" | "Medium" | "Low";
  due_date: string;
  completed: boolean;
  status: "todo" | "inprogress" | "completed";
}

const tasks = ref<Task[]>(
  JSON.parse(localStorage.getItem("tasks") || "[]")
);

const inProgressTasks = computed(() =>
  tasks.value.filter(task => task.status === "inprogress")
);

// Mark as Completed
const completeTask = (id: number) => {
  const task = tasks.value.find(t => t.id === id);

  if (!task) return;

  task.status = "completed";
  task.completed = true;

  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};
</script>


<template>
  <div class="page-card">
    <h1>In-Progress Tasks</h1>
    <p>Your undergoing Tasks.</p>

    <ul class="task-list">
    </ul>
  </div>

  <div class="card-grid">
  <div v-for="task in inProgressTasks" :key="task.id" class="card">
    <h3 style="color: #1e3a8a;">{{ task.title }}</h3>
    <p>{{ task.priority }}</p>
    <p>Due date: {{ new Date(task.due_date).toLocaleString() }}</p>

    <button class="complete" @click="completeTask(task.id)">
      Mark Completed
    </button>
  </div>
</div>

</template>

<style scoped>
/* Same styles as ToDo.vue */

.card-grid {
  display: grid;
  /* Creates 3 columns of equal width */
  grid-template-columns: repeat(3, 1fr); 
  /* Adds spacing between cards */
  gap: 20px; 
  padding: 20px;
}

.card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-title {
  margin-top: 0;
  color: #333;
}

.page-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(5, 8, 216, 0.1);
  color: #1e3a8a;
  text-align: center;
}

.task-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.task-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f3f4f6;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.task-left span {
  margin-right: 10px;
  font-weight: bold;
}

.task-meta {
  font-size: 12px;
  color: gray;
}

.completed span:first-child {
  text-decoration: line-through;
  color: gray;
}

.task-actions button {
  margin-left: 8px;
  cursor: pointer;
  padding: 4px 10px;
  border: none;
  border-radius: 6px;
}

.task-actions button:disabled {
  cursor: not-allowed;
  color: gray;
}

.complete{
    background:#1e3a8a;
  color:white;
  border:none;
  padding:6px 12px;
  border-radius:6px;
  font-weight: bold;
}
</style>
