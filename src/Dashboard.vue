<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// New Task Inputs
const newTaskText = ref("");
const newTaskPriority = ref<"High" | "Medium" | "Low">("Medium");
const newTaskDue = ref("");

// Task Interface
interface Task {
  text: string;
  priority: "High" | "Medium" | "Low";
  due: string;
  completed: boolean;
}

const tasks = ref<Task[]>([]);

// Add Task
const addTask = () => {
  if (!newTaskText.value.trim() || !newTaskDue.value) {
    alert("Please enter task and due date/time");
    return;
  }

  tasks.value!.push({
    text: newTaskText.value,
    priority: newTaskPriority.value,
    due: newTaskDue.value,
    completed: false,
  });

  newTaskText.value = "";
  newTaskPriority.value = "Medium";
  newTaskDue.value = "";
};

// Complete Task
const completeTask = (index: number) => {
  const task = tasks.value[index];
  if (!task) return;

  task.completed = true;
};

// Edit Task
const editTask = (index: number) => {
  const task = tasks.value[index];
  if (!task) return;

  const updatedText = prompt("Edit task:", task.text);
  if (updatedText !== null && updatedText.trim() !== "") {
    task.text = updatedText;
  }

  const updatedPriority = prompt(
    "Edit priority (High / Medium / Low):",
    task.priority
  ) as "High" | "Medium" | "Low";

  if (updatedPriority && ["High","Medium","Low"].includes(updatedPriority)) {
    task.priority = updatedPriority;
  }

  const updatedDue = prompt(
    "Edit due date & time (YYYY-MM-DDTHH:MM):",
    task.due
  );

  if (updatedDue) {
    task.due = updatedDue;
  }
};


// Delete Task
const deleteTask = (index: number) => {
  tasks.value.splice(index, 1);
};

// Logout
const logout = () => {
  router.push("/login");
};

const user = JSON.parse(localStorage.getItem("user") || "null");
const initials = computed(() => {
    if (!user || !user.full_name) return ""

    const names = user.full_name.split(" ");
    return names.map((name: string) => name[0]).join("").toUpperCase();
});
</script>


<template>
  <div class="dashboard-container">

    <!-- Navbar -->
    <nav class="navbar">
      <h2 class="logo">TaskBuddy</h2>
      <div class="dashboard">
        <div class="top-bar">
            <div class="avatar">
                {{ initials }}
            </div>
        </div>
      </div>
      <button class="logout-btn" @click="logout">Logout</button>
    </nav>

    <!-- Dashboard Card -->
    <div class="dashboard-card">
      <h1>My Tasks</h1>
      <p>Add your Task, Priority and Due Date below.</p>

      <!-- Add Task -->
      <div class="task-input">
        <input
          type="text"
          v-model="newTaskText"
          placeholder="Enter Your Task"
        />
        <select id="select" v-model="newTaskPriority">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input id="select" type="datetime-local" v-model="newTaskDue" />
        <button class="btn-primary" @click="addTask">Add</button>
      </div>

      <!-- Task List -->
      <ul class="task-list">
        <li
          v-for="(task, index) in tasks"
          :key="index"
          :class="{ completed: task.completed }"
        >
          <div class="task-left">
            <span>{{ task.text }}</span>
            <span class="task-meta">
              [{{ task.priority }}] - {{ new Date(task.due).toLocaleString() }}
            </span>
          </div>

          <div class="task-actions">
            <button id="complete" @click="completeTask(index)" :disabled="task.completed">
              Complete
            </button>
            <button @click="editTask(index)" id="edit">Edit</button>
            <button @click="deleteTask(index)" id="delete">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>


<style scoped>
.dashboard-container {
  font-family: Arial, Helvetica, sans-serif;
}

.dashboard {
  padding: 20px;
  padding-left: 85%;
}

.top-bar {
  display: flex;
  justify-content: flex-end;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4f46e5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

/* Navbar */
.navbar {
  padding: 20px 40px;
  background-color: #1e3a8a;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logout-btn {
  background: white;
  color: #1e3a8a;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

/* Card */
.dashboard-card {
  max-width: 900px;
  margin: 60px auto;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0,0,0,0.1);
  text-align: center;
}

.dashboard-card h1 {
  margin-bottom: 10px;
}

.dashboard-card p {
  color: gray;
  margin-bottom: 25px;
}

/* Task Input */
.task-input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  text-align: center;
  justify-content: center;
}

.task-input input{
    text-align: center;
    font-weight: bold;
    font-size: large;
}
.task-input select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.btn-primary {
  background-color: #1e3a8a;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.btn-primary:hover {
  background-color: #162d6b;
}

/* Task List */
.task-list {
  list-style: none;
  padding: 0;
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
  font-size: large;
  font-weight: bold;
}

.task-meta {
  color: gray;
  font-size: 12px;
}

.completed span:first-child {
  text-decoration: line-through;
  color: gray;
}

.task-actions button {
  margin-left: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: large;
}

#edit{
    color: blue;
}

#delete{
    color: red;
}

#complete{
    color: green;
}

#select{
    font-size: large;
}

.task-actions button:hover {
  color: #1e3a8a;
}

.task-actions button:disabled {
  color: gray;
  cursor: not-allowed;
}

</style>
