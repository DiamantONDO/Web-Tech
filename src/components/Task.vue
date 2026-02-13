//For JavaScript
<script setup lang="ts">
import{ref} from 'vue';
import { f } from 'vue-router/dist/router-CWoNjPRp.mjs';
const name = ref('Task');
const firstName = ref('List');
const myName = ref("Anthony")
const emoji = ref('😊');
const year = ref('2005')
const newTask = ref("");
const taskList = ref<string[]>([]);
let count =0;
//Event listener

const isTaskVisible = ref(false);

const showTask = () => {
    if (newTask.value.trim() !== ""){
        taskList.value.push(newTask.value);
        newTask.value = "";
        count++;
    }
};
</script>


//For HTML
<template>
  <header></header>
  <h1> Congrats {{myName}} 
    <br>This is {{ name }} {{ firstName }}</h1>
    <h2>TaskBuddy</h2>
    <input type="text" placeholder="Enter your task">
    <button @click="showTask">Add Your Task</button><!--Display task input below-->
    

    <section v-if="isTaskVisible">
      <h2>Your Task(s):</h2>
      <h1>{{  }}</h1>
      <input type="text" v-model="newTask" placeholder="Enter your task here">
      <input @click="isTaskVisible = false"></input>
      <input @click="showTask"></input>
    </section>


  <header></header>
  <main></main>
  <footer></footer>  
   <p></p>
   <!--
   <input type="text" id="task-input" placeholder="Enter New Task">
   <button id="add-task-button">Add Task</button>
   -->
   <h2 id="countPosition">Count: {{ count }}</h2>
   <button id="countButton">Increase +</button>
</template>

//===============================================================
//For CSS
<style scoped>
footer p{
  color: blue;
}
main h1{
  display: block;
  text-align: center;
  padding: auto;
}
main h2{
    color: blue;
}
main button{
    background-color: skyblue;
    border-radius: 15%; 
    height: 38px;
    color: white;
    font-weight: bold;
}
p{
    display: block;
    text-align: center;
    border-radius: 1%;
}
main input{
    font-family: Arial;
    border-radius: 1%;
    width: 200px;
    height: 30px;
}
#countPosition{
    font-size: 20px;
    color: black;
}
#countButton{
    background-color: skyblue;
    border-radius: 15%; 
    height: 38px;
    color: white;
    height: 60px;
    font-weight: bold;
}
</style>

