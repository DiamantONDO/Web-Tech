<script setup lang="ts">
import { ref, computed } from "vue";
import axios from "axios";
import { onMounted } from "vue";


const showPopup = ref(false);

const taskTitle = ref("");
const taskPriority = ref<"Low" | "Medium" | "High">("Medium")
const dueDate = ref("");

const openPopup = () => {
  showPopup.value = true;
};

const closePopup = () => {
  showPopup.value = false;
};

const confirmTask = async () => {
  if (!taskTitle.value || !dueDate.value) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await axios.post("http://localhost:5000/api/tasks", {
      title: taskTitle.value,
      priority: taskPriority.value,
      due_date: dueDate.value
    });

    // Push new task into card-grid instantly
    tasks.value.push(res.data);

    taskTitle.value = "";
    taskPriority.value = "Medium";
    dueDate.value = "";
    closePopup();

  } catch (err) {
    console.error(err);
    alert("Failed to create task");
  }
};




interface Task {
    id: number;
    title: string;
    priority: "High" | "Medium" | "Low";
    due_date: string;
    completed: boolean;
    status: "todo" | "inprogress" | "completed";
}

// For demo, you can fetch from backend later
const tasks = ref<Task[]>([]);

const fetchTasks = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/tasks");
    tasks.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchTasks);

// Filter To-Do tasks
const todoTasks = computed(() => tasks.value.filter(task => task.status === "todo"));

/* Complete a task
const completeTask = (id: number) => {
  const task = tasks.value[index];  // get the task first
  if (!task) return;                // exit if undefined

  task.completed = true;
  task.status = "completed";

  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};*/



const priorityColor = (priority: string)=>{
    if (priority === "High") return "red"
    if (priority === "Medium") return "blue"
    return "black"
}

const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date();
};

const deleteTask = (id: number) => {

  const storedTasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");

  const updatedTasks = storedTasks.filter(t => t.id !== id);

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));

  tasks.value = updatedTasks;
};


const completeTask = (id: number) => {
  const task = tasks.value.find(task => task.id === id);
  const storedTasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");

  if (!task) return;
  

  task.status = "completed";
  task.completed = true;

  localStorage.setItem("tasks", JSON.stringify(tasks.value));
  alert(`Task ${task.title} Completed`)
};

const startTask = (id: number) => {
  const task = tasks.value.find(t => t.id === id);
  if (!task) return;

  task.status = "inprogress";

  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};




</script>

<template>

  <div class="page">
    <h1>To-Do Tasks</h1>

    <button class="createButton" @click="openPopup">Create Task
    </button>
  </div>

  <!-- POP-UP MODAL -->
  <div v-if="showPopup" class="modal-overlay">

    <div class="modal">

      <h2>Create New Task</h2>

      <input
        type="text"
        placeholder="Task Title"
        v-model="taskTitle"
      />

      <select v-model="taskPriority">
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <input
        type="datetime-local"v-model="dueDate"/>

      <div class="modal-actions">
        <button class="cancel" @click="closePopup">Cancel</button>

        <button class="confirm" @click="confirmTask">Confirm</button>
      </div>

    </div>
  </div>

  <div class="card-grid">
    <div v-for="task in todoTasks" :key="task.id" class="card">
        <h3 class="card-title">{{ task.title }}</h3>
        <p style="font-weight: bold;" :style="{color: priorityColor(task.priority)}">{{ task.priority }}</p>
        <p style="font-weight: 200;" :style="{color: isOverdue(task.due_date) ? 'red' : 'black'}">Due date: {{ new Date(task.due_date).toLocaleString() }}</p>
        <div style="display: flex; gap: 12px">
            <button class="delete" @click="deleteTask(task.id)">Delete</button>
            <button class="complete" @click="completeTask(task.id)">Complete</button>
            <button class="start" @click="startTask(task.id)">Start</button>
        </div>
    </div>
  </div>

</template>


<style scoped>



.createButton{
    background-color: #1e3a8a;
    color: white;
    border-radius: 8px;
    height: 36px;
    width: 10%;
    font-weight: bold;
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
  height: 80%;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-title {
  margin-top: 0;
  color: #1e3a8a;
}

.page-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(5, 8, 216, 0.1);
  color: #1e3a8a;
  text-align: center;
}
.page{
    color: #1e3a8a;
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

.modal-overlay{
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.4);
  display:flex;
  justify-content:center;
  align-items:center;
}

/* Modal Box */
.modal{
  background:white;
  padding:20px;
  border-radius:10px;
  width:300px;
  display:flex;
  flex-direction:column;
  gap:10px;
}

/* Buttons */
.modal-actions{
  display:flex;
  justify-content:space-between;
}

.cancel{
  background:red;
  color:white;
  border:none;
  padding:6px 12px;
  border-radius:6px;
}

.confirm{
  background:#1e3a8a;
  color:white;
  border:none;
  padding:6px 12px;
  border-radius:6px;
  font-weight: bold;
}

.delete{
    background:red;
  color:white;
  border:none;
  padding:6px 12px;
  border-radius:6px;
}

.complete{
    background:#1e3a8a;
  color:white;
  border:none;
  padding:6px 12px;
  border-radius:6px;
}

.start{
    background:rgb(8, 170, 127);
  color:white;
  border:none;
  padding:6px 12px;
  border-radius:6px;
}
</style>
