import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('users', () => {

  const stored = localStorage.getItem('tb_users')
  const users = ref(
    stored
      ? JSON.parse(stored)
      : [
          { id: 15, name: 'Anthony',        role: 'Student', email: 'anthony@gmail.com' },
          { id: 4,  name: 'Anthony_Mother', role: 'Parent',  email: 'antho-mother@gmail.com' },
        ]
  )

  function saveToStorage() {
    localStorage.setItem('tb_users', JSON.stringify(users.value))
  }

  function addUser(user) {
    const newUser = { ...user, id: Date.now() }
    users.value.push(newUser)
    saveToStorage()
    return newUser
  }

  function getUserById(id) {
    return users.value.find(u => u.id === id) ?? null
  }

  function emailExists(email) {
    return users.value.some(u => u.email === email)
  }

  return { users, addUser, getUserById, emailExists }
})