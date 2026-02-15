//For JavaScript
<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goToLogin = () => {
  router.push("/login");
};

const goToRegister = () => {
  router.push("/register");
};
</script>



//For HTML
<template>
  <div class="home-container">

    <!-- Navbar -->
    <nav class="navbar">
      <RouterLink to="/" class="logo-link">
        <h2 class="logo">TaskBuddy</h2>
      </RouterLink>

      <div class="nav-buttons">
        <button class="btn-outline" @click="goToLogin">Login</button>
        <button class="btn-primary" @click="goToRegister">Register</button>
        <button class="btn-primary" @click="goToLogin">Login</button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <h1>Organize Your Tasks Easily</h1>
      <p>
        TaskBuddy helps AUCA students and families manage daily tasks
         and stay productive.
      </p>

      <div class="hero-buttons">
        <button class="btn-primary" @click="goToRegister">
          Get Started
        </button>

        <button class="btn-outline" @click="goToLogin">
          I Already Have an Account
        </button>
      </div>
    </section>

    <h1 class="feature">Task Buddy Features</h1>

    <!-- Features -->
    <section class="features">

      <div class="feature-card">
        <h3>Task Management</h3>
        <p>Add, edit and delete your daily tasks.</p>
      </div>

      <div class="feature-card">
        <h3>Task Sharing</h3>
        <p>Share tasks with family members.</p>
      </div>

      <div class="feature-card">
        <h3>Due Date</h3>
        <p>Stay organized with due dates.</p>
      </div>

    </section>

    <footer>
      <p>© 2026 TaskBuddy | Designed by Anthony</p>
    </footer>

  </div>
</template>


//===============================================================
//For CSS
<style scoped>
.home-container {
  font-family: Arial, Helvetica, sans-serif;
}

/* NAVBAR */

.logo-link{
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.feature{
    text-align: center;
  padding: 1px 1px;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: #1e3a8a;
  color: white;
}

.logo {
  font-size: 24px;
}

/* HERO */
.hero {
  text-align: center;
  padding: 80px 20px;
}

.hero h1 {
  font-size: 40px;
  margin-bottom: 20px;
}

.hero p {
  font-size: 18px;
  color: gray;
  margin-bottom: 30px;
}

/* BUTTONS */
.btn-primary {
  background-color: #1e3a8a;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  margin: 5px;
}

.btn-outline {
  background: transparent;
  border: 2px solid #1e3a8a;
  color: #1e3a8a;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  margin: 5px;
}

.btn-primary:hover {
  background-color: #162d6b;
}

.btn-outline:hover {
  background-color: #1e3a8a;
  color: white;
}

/* FEATURES */
.features {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 20px 20px;
}

.feature-card {
  width: 250px;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
  text-align: center;
}

/* FOOTER */
footer {
  text-align: center;
  padding: 20px;
  background-color: #f3f4f6;
  margin-top: 50px;
}

</style>