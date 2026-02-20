<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface Task {
  id: number;
  title: string;
  priority: "High" | "Medium" | "Low";
  due_date: string;
  completed: boolean;
  status: "todo" | "inprogress" | "completed";
}

const tasks = ref<Task[]>([]);

const loadTasks = () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.value = storedTasks;
};

onMounted(() => {
  loadTasks();
});

const completedTasks = computed(() =>
  tasks.value.filter(task => task.status === "completed")
);
</script>


<template>
  <div class="page-card">
    <h1>Completed Tasks</h1>
    <p>Tasks you have finished.</p>

    <ul class="task-list">
    </ul>
  </div>

  <div class="card-grid">
    <div v-for="task in completedTasks" :key="task.id" class="card">
      <h3 style="color: #1e3a8a;"> {{task.title}}</h3>
      <p>{{task.priority}}</p>
      <p>{{new Date(task.due_date).toLocaleString()}}</p>
    </div>
  </div>
</template>

<style scoped>
.page-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(5, 8, 216, 0.1);
  color: #1e3a8a;
  text-align: center;
}

.container{
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(5, 8, 216, 0.1);
  color: #1e3a8a;
  text-align: center;
}

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
</style>
