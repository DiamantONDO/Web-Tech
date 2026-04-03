import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {

  //Pull existing session on app load so refresh doesn't log you out
  const storedUser = sessionStorage.getItem('currentUser')
  const currentUser = ref(storedUser ? JSON.parse(storedUser) : null)

  const isLoggedIn = computed(() => currentUser.value !== null)

  function login(user) {
    currentUser.value = user
    sessionStorage.setItem('currentUser', JSON.stringify(user))
  }

  function logout() {
    currentUser.value = null
    sessionStorage.removeItem('currentUser')
  }

  return { currentUser, isLoggedIn, login, logout }
})