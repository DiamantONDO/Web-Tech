//For JavaScript
<script setup lang="ts">
import{ref} from 'vue';
const name = ref('Diamant');
const firstName = ref('Anthony');
const emoji = ref('😊');
const year = ref('2005')
let counter =0;
//Event listener

//For button 
import Task from './components/Task.vue';
import TaskExample from './components/TaskExample.vue';
</script>


//For HTML
<template>

  <header></header>
  <main>
    <TaskExample/>
  </main>
  <footer></footer>
  <header>
    <span>{{ emoji }}</span>
  </header>
  

  <footer>
    <p>&copy; copyright {{year}}</p></footer>
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
  padding:auto;
}
button {
  background-color: green;

  border-radius: 50%;
}
</style>

