//For JavaScript
<script setup lang="ts">
import{ref} from 'vue';
const name = ref('Diamant');
const firstName = ref('Anthony');
const emoji = ref('😊');
const year = ref('2005')
let counter =0;
//Event listener

</script>


//For HTML
<template>

  <header></header>
  <main></main>
  <footer></footer>
  <header>
    <span>{{ emoji }}</span>
  </header>
  <h1>You did it!</h1>
  <h1> Hi {{ name }}, it's Vue JS.</h1>
  <h1> Hi {{ firstName }}, it's Vue JS.</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
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
}
</style>

