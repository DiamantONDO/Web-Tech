//For JavaScript
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const fullName = ref("");
const email = ref("");
const password = ref("");
const role = ref("Student");

const register = async () => {
  // For now just simulate registration
  if (!fullName.value || !email.value || !password.value) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await axios.post("http://localhost:5000/api/register", {
      fullName: fullName.value,
      email: email.value,
      password: password.value,
      role: role.value,
    });
    alert("Registration Successful!");
  router.push("/login");
  } catch (error) {
   alert("Registration Failed!") 
  }
  
};
</script>



//For HTML
<template>
  <div class="register-container">

    <!-- Navbar -->
    <nav class="navbar">
      <h2 class="logo">TaskBuddy</h2>
    </nav>

    <!-- Register Card -->
    <div class="register-card">

      <h1>Create Account</h1>
      <p>Join TaskBuddy and start managing your tasks.</p>

      <form @submit.prevent="register">

        <div class="form-group">
          <label>Full Name</label>
          <input type="text" v-model="fullName" placeholder="Enter your name" />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="Enter your email" />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" placeholder="Enter password" />
        </div>

        <div class="form-group">
          <label>Role</label>
          <select v-model="role">
            <option value="Student">Student</option>
            <option value="Parent">Parent</option>
          </select>
        </div>

        <button class="btn-primary">Register</button>

      </form>

      <p class="login-link">
        Already have an account?
        <span @click="router.push('/login')">Login</span>
      </p>

    </div>

  </div>
</template>


//===============================================================
//For CSS
<style scoped>
.register-container {
  font-family: Arial, Helvetica, sans-serif;
}

/* Navbar */
.navbar {
  padding: 20px 40px;
  background-color: #1e3a8a;
  color: white;
}

.logo {
  font-size: 24px;
}

/* Card */
.register-card {
  max-width: 400px;
  margin: 80px auto;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0,0,0,0.1);
  text-align: center;
}

.register-card h1 {
  margin-bottom: 10px;
}

.register-card p {
  color: gray;
  margin-bottom: 25px;
}

/* Form */
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

.form-group input,
.form-group select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

/* Button */
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

/* Login link */
.login-link {
  margin-top: 20px;
}

.login-link span {
  color: #1e3a8a;
  cursor: pointer;
  font-weight: bold;
}

</style>

