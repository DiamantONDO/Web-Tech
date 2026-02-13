<script setup lang="ts">
import { computed, ref } from "vue";

interface User {
  id: number;
  name: string;
  role: "Parent" | "Student";
  email: string;
}

interface Task{
    id:number
    title: string
    category: "Work" | "Personal"
    priority: "High" | "Normal" | "Low"
    dueDate: string
    assignedTo: User[]
}

const tasks = ref<Task[]>([]);

const users = ref<User[]>([
    {id: 15, name: "Anthony", role: "Student", email: "anthony@gmail.com"},
    {id: 4, name: "Anthony_Mother", role: "Parent", email: "antho-mother@gmail.com"}
]);

const currentUser = ref<User | null>(null);

const loginAs = (user: User) => {
    currentUser.value = user;
};

const logout = (user: User) => {
        currentUser.value = null;
    };

const visibleTasks = computed(() => {
    if (!currentUser.value) return [];

    return tasks.value.filter((task) =>
    task.assignedTo.some((user) => user.id === currentUser.value?.id))
});


    
const formData = ref<Omit<Task, "id" | "assignedTo"> & { assignedTo: number[] }>({
  title: "",
  category: "Work",
  priority: "Normal",
  dueDate: "",
  assignedTo: [],
});
const selectedRow = ref<number | null>(null);

const showValidationError = ref(false);

const getTimeRemaining = (dueDate: string) => {
  if (!dueDate) return "No date set";
  const total = Date.parse(dueDate) - Date.now();
  if (total <= 0) return "EXPIRED";

  const sec = Math.floor((total / 1000) % 60);
  const mins = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return `${days}d ${hours}h ${mins}m ${sec}s` ;
};


function onFormSubmit() {
  if (!formData.value.title) {
    showValidationError.value = true;
    return;
  }
  showValidationError.value = false;

  const newTask: Task ={
    id: tasks.value.length + 1,
    title: formData.value.title,
    category: formData.value.category,
    priority: formData.value.priority,
    dueDate: formData.value.dueDate,
    assignedTo: formData.value.assignedTo.map(id=>users.value.find(user=>user.id===id)!)
  }

  if (selectedRow.value === null) {
    tasks.value.push(newTask);
  } else {
    tasks.value[selectedRow.value] = newTask;
    selectedRow.value = null;
  }
  resetForm();
}

function onEdit(index: number) {
  const task = tasks.value[index];
  if (!task) {
    alert("No task found");
    return;
} 
  
  formData.value = {
    title: task.title,
    category: task.category,
    priority: task.priority,
    dueDate: task.dueDate,
    assignedTo: task.assignedTo.map((user) => user.id),
  };
  selectedRow.value = index;
}

function onDelete(index: number) {
  if (confirm(`Are you sure to delete this record?`)) {
    tasks.value.splice(index, 1);
    resetForm();
  }
}

function completeTask (index: number){
    const task = tasks.value[index];
    if (task){
        alert(`Task completed!`)
        tasks.value.splice(index, 1);
    }
};

function resetForm() {
  formData.value = {
    title: "",
    category: "Work",
    priority: "Normal",
    dueDate: "",
    assignedTo: [],
  };
  selectedRow.value = null;
}
</script>




<template>
    <div style="padding-top: 35px; 
    font-size: 155%; 
    color:rgb(212, 149, 40);
    padding-bottom: 0%;
    padding-left: 1%;
    padding-right: 5%;
    padding-top: 1%;
    font-weight: bold;">
        Task Buddy
    </div>
    <div style="padding-top: 35px; 
    font-size: 125%; 
    padding-bottom: 0%;
    padding-left: 1%;
    padding-right: 5%;
    padding-top: 1%;
    font-weight: bold;">
        Please Login to see Your Tasks
    </div>
  <div class="form-row">
    <div class="form-row">
        <p></p>
      <h3>Currently logged in as: {{ currentUser?.name || 'Nobody' }}</h3>
      <div class="flex gap-2">
        <button v-for="user in users" :key="user.id" @click="loginAs(user)" 
                :class="{ 'active-user': currentUser?.id === user.id }">
          Login as {{ user.name }}
        </button>
        <button @click="logout" v-if="currentUser">Logout</button>
      </div>
    </div>

    <form v-if="currentUser" @submit.prevent="onFormSubmit">
    </form>

    <table v-if="currentUser">
      <thead>
        <tr>
          <th style="text-align: center;">Title</th>
          <th style="text-align: center;">Assigned To</th>
          <th style="text-align: center;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in visibleTasks" :key="task.id">
          <td style="text-align: center;">{{ task.title }}</td>
          <td style="text-align: center;">
            <span v-for="user in task.assignedTo" :key="user.id" class="user-badge">
              {{ user.name }}
            </span>
          </td>
          <td>
            <a @click="onEdit(index)" style="color: green;">Edit</a>
            <a @click="onDelete(index)" style="color: red;">Delete</a>
          </td>
        </tr>
      </tbody>
    </table>
    <p style="font-size: 100%; font-weight: bold;" v-else>Please login to see your tasks.</p>
  </div>

  <form class="app-container" @submit.prevent="onFormSubmit">
    <div class="form-row">
      <label style="width: 100%;">Enter Your Task:</label>
      <input  type="text" v-model="formData.title" />
    </div>

    <div class="form-row">
      <label>Category:</label>
      <select v-model="formData.category">
        <option value="High">Work</option>
        <option value="Normal">Personal</option>
      </select>
    </div>

    <div class="form-row">
      <label>Priority:</label>
      <select v-model="formData.priority">
        <option value="High">High</option>
        <option value="Normal">Normal</option>
        <option value="Low">Low</option>
      </select>
    </div>

    <div class="form-row">
        <label>Assigned To:</label>
          <div v-for="user in users" :key="user.id" class="flex items-center gap-2 mb-1">
            <input 
              type="checkbox" 
              :id="'user-' + user.id" 
              :value="user.id" 
              v-model="formData.assignedTo"
              />
              <label :for="'user-' + user.id">{{ user.name }} ({{ user.role }})</label>
            </div>
    </div>

    <div class="form-row">
        <label>Due Date:</label>
        <input type="date" v-model="formData.dueDate" />
    </div>

    <div class="addTask">
    <button style="width: 20%;" @click="onFormSubmit">Add Task</button>
    </div>
</form>
  <table id="table">
    <thead>
      <tr>
        <th style="text-align: center">Title</th>
        <th style="text-align: center">Assigned To</th>
        <th style="text-align: center">Category</th>
        <th style="text-align: center">Priority</th>
        <th style="text-align: center">Due Date</th>
        <th style="text-align: center">Time Remaining</th>
        <th style="text-align: center">Actions</th>
        
      </tr>
    </thead>
    <tbody>
      <tr id="table" v-for="(task, index) in tasks" :key="index">
        <td style="text-align: center">{{ task.title }}</td>
        <td style="text-align: center">
            <span v-for="user in task.assignedTo" :key="user.id" class="user-badge">
               {{ user.name }}
            </span>
        </td>
        <td style="text-align: center">{{ task.category }}</td>
        <td style="text-align: center">{{ task.priority }}</td>
        <td style="text-align: center">{{ task.dueDate }}</td>
        <td style="text-align: center" :class = "getTimeRemaining(task.dueDate) === 'Expired' ? 'text-red-600-font-bold' : '' ">
            {{ getTimeRemaining(task.dueDate) }}
        </td>
        <td style="text-align: center">
          <a @click="onEdit(index)" id="edit">Edit</a>
          <a @click="onDelete(index)" id="delete">Delete</a>
          <a @click="completeTask(index)" id="complete">Complete</a>
        </td>
      </tr>
    </tbody>
  </table>
</template>








<style scoped>
  body > table{
    width: 80%;
}
.addTask{
    padding-left: 80px;
    width: 100%;
    font-weight: bold;
    font-family: Impact;
}
.task-form {
  max-width: 500px;
  margin: 5px auto;          
  display: flex;
  flex-direction: column;
  align-items: center;        
  gap: 1px;
}
.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 6px;
}

.form-group select,
.form-group input[type="date"] {
  width: 100%;
  max-width: 300px;
  padding: 8px;
}
.form-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row label {
  width: 120px;         
  font-weight: bold;
  text-align: right;
}

.form-row select,
.form-row input[type="date"] {
  width: 200px;
  padding: 6px;
}



.app-container{
    display: flex;
    flex-direction: column;
    align-items: first baseline;
    gap: 5px auto;
}

table{
    border-collapse: collapse;
}
table.list{
    width:100%;
}

td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
}
tr:nth-child(even),table.list thead>tr {
    background-color: #dddddd;
}

input[type=text], input[type=number] {
    width: 100%;
    padding: 12px 60px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid rgb(212, 149, 40);
    border-radius: 25px;
    border-width: 2px;
    box-sizing: border-box;
}

input[type=submit]{
    width: 30%;
    background-color: #ddd;
    color: #000;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 50%;
}

form div.form-action-buttons{
    text-align: right;
}

a{
    cursor: pointer;
    text-decoration: underline;
    color: #0000ee;
    margin-right: 4px;
}

label.validation-error{
    color:   red;
    margin-left: 5px;
}

.hide{
    display:none;
}
.user-badge {
    background-color: #e0e7ff;
    color: #4338ca;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    margin-right: 4px;
    display: inline-block;
    border: 1px solid #c7d2fe;
}

input[type="checkbox"] {
    width: auto; 
    margin-right: 10px;
}
#delete{
    color: red;
}
#edit{
    color: green;
}
#complete{
    color: blue;
}
button{
    background-color: rgb(212, 149, 40);
    border-radius: 50px; 
    height: 38px;
    color: white;
    font-weight: bold;
    font-family: Helvetica;
    margin: 20px;
    border-color: rgb(212, 149, 40);
}

#table{
    margin: 20px auto;   
  width: 90%;
}

</style>