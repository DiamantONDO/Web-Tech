import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './useUserStore'

export const useTaskStore = defineStore('tasks', () => {

  const userStore = useUserStore()

  const stored = localStorage.getItem('tb_tasks')
  const tasks = ref(stored ? JSON.parse(stored) : [])

  const storedShares = localStorage.getItem('tb_shared')
  const sharedTasks = ref(storedShares ? JSON.parse(storedShares) : [])
  

  function saveToStorage() {
    localStorage.setItem('tb_tasks', JSON.stringify(tasks.value))
  }

  function saveSharedToStorage() {
    localStorage.setItem('tb_shared', JSON.stringify(sharedTasks.value))
  }

  function addTask(taskData) {
    const newTask = {
      id:         Date.now(),
      title:      taskData.title,
      category:   taskData.category,
      priority:   taskData.priority,
      dueDate:    taskData.dueDate,
      assignedTo: taskData.assignedTo,   
      createdBy:  taskData.createdBy,    
      completed:  false,
      status:     'inprogress',
    }
    tasks.value.push(newTask)
    saveToStorage()
  }

  function updateTask(id, updatedData, callerId) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index === -1) return 'not_found'
    if (tasks.value[index].createdBy !== callerId) return 'not_owner'
    tasks.value[index] = { ...tasks.value[index], ...updatedData }
    saveToStorage()
    return 'ok'
  }

  function deleteTask(id, callerId) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index === -1) return

    const task = tasks.value[index]

    if (task.assignedTo.length <= 1) {
      tasks.value.splice(index, 1)
    } else {
      task.assignedTo = task.assignedTo.filter(uid => uid !== callerId)
    }
    saveToStorage()
  }

  function startTask(id) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index === -1) return
    tasks.value[index].status = 'inprogress'
    saveToStorage()
  }

  function completeTask(id) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index === -1) return
    tasks.value[index].completed = true
    tasks.value[index].status   = 'completed'
    saveToStorage()
  }

  function shareTask(taskId, fromUserId, toUserId) {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task) return 'not_found'

    if (task.assignedTo.includes(toUserId)) return 'already_assigned'

    const alreadyPending = sharedTasks.value.some(
      s => s.taskId === taskId && s.toUserId === toUserId && s.status === 'pending'
    )
    if (alreadyPending) return 'already_pending'

    sharedTasks.value.push({
      id:           Date.now(),
      taskId:       task.id,
      taskSnapshot: { ...task },
      fromUserId,
      toUserId,
      status:       'pending',
    })

    saveSharedToStorage()
    return 'ok'
  }

  function acceptShare(shareId, receiverId) {
    const share = sharedTasks.value.find(s => s.id === shareId)
    if (!share) return

    const copy = {
      ...share.taskSnapshot,
      id:         Date.now(),
      assignedTo: [receiverId],   
      createdBy:  receiverId,      
      status:     'inprogress',
      completed:  false,
    }
    tasks.value.push(copy)

    share.status = 'accepted'

    saveToStorage()
    saveSharedToStorage()
  }

  function rejectShare(shareId) {
    const share = sharedTasks.value.find(s => s.id === shareId)
    if (!share) return
    share.status = 'rejected'
    saveSharedToStorage()
  }

  function getUserById(id) {
    return userStore.getUserById(id)
  }

  function resolveAssignees(assignedTo) {
    return assignedTo.map(id => userStore.getUserById(id)).filter(Boolean)
  }

  function getTimeRemaining(dueDate) {
    if (!dueDate) return 'No date set'
    const total = Date.parse(dueDate) - Date.now()
    if (total <= 0) return 'EXPIRED'
    const days  = Math.floor(total / (1000 * 60 * 60 * 24))
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
    const mins  = Math.floor((total / (1000 * 60)) % 60)
    return `${days}d ${hours}h ${mins}m`
  }

  return {
    tasks,
    sharedTasks,
    addTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
    shareTask,
    acceptShare,
    rejectShare,
    resolveAssignees,
    getTimeRemaining,
    getUserById,
  }
})