<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const email    = ref("");
const password = ref("");

const login = () => {
  if (!email.value || !password.value) {
    alert("Please enter email and password");
    return;
  }

  const match = userStore.users.find(
    (u) => u.email === email.value && u.password === password.value
  );

  if (!match) {
    alert("Login failed! Invalid email or password.");
    return;
  }

  authStore.login(match);

  alert("Login successful!");
  router.push("/taskbuddy/dashboard");
};
</script>

<template>
  <div class="login-container">

    <nav class="navbar">
      <RouterLink to="/" class="logo-link">
        <h2 class="logo">TaskBuddy</h2>
      </RouterLink>
    </nav>

    <div class="login-card">

      <h1>Welcome Back</h1>
      <p>Login to manage your tasks and stay organized.</p>

      <form @submit.prevent="login">

        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            v-model="email"
            placeholder="Enter your email"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            v-model="password"
            placeholder="Enter your password"
          />
        </div>

        <button class="btn-primary">Login</button>

      </form>

      <p class="register-link">
        Don't have an account?
        <span @click="router.push('/register')">Register</span>
      </p>

    </div>

  </div>
</template>

<style scoped>
.login-container {
  font-family: Arial, Helvetica, sans-serif;
}

/* Navbar */
.navbar {
  padding: 20px 40px;
  background-color: #1e3a8a;
  color: white;
}

.logo-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.logo {
  font-size: 24px;
}

.login-card {
  max-width: 400px;
  margin: 100px auto;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0,0,0,0.1);
  text-align: center;
}

.login-card h1 {
  margin-bottom: 10px;
}

.login-card p {
  color: gray;
  margin-bottom: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.btn-primary {
  width: 100%;
  background-color: #1e3a8a;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}

.btn-primary:hover {
  background-color: #162d6b;
}

.register-link {
  margin-top: 20px;
}

.register-link span {
  color: #1e3a8a;
  cursor: pointer;
  font-weight: bold;
}
</style>