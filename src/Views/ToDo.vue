<script setup lang="ts">
import { ref, computed } from "vue";
import { useTaskStore } from "@/stores/useTaskStore";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";

const taskStore = useTaskStore();
const userStore = useUserStore();
const authStore = useAuthStore();

const currentUserId = computed(() => authStore.currentUser?.id ?? -1);

const showTaskModal = ref(false);
const isEditing     = ref(false);
const editingId     = ref<number | null>(null);
const taskTitle     = ref("");
const taskCategory  = ref<"Work" | "Personal">("Work");
const taskPriority  = ref<"High" | "Normal" | "Low">("Normal");
const dueDate       = ref("");
const assignedTo    = ref<number[]>([]);

const todoTasks = computed(() =>
  taskStore.tasks.filter(t =>
    t.status === "todo" &&
    t.assignedTo.includes(currentUserId.value)
  )
);

const resetForm = () => {
  taskTitle.value    = "";
  taskCategory.value = "Work";
  taskPriority.value = "Normal";
  dueDate.value      = "";
  assignedTo.value   = [];
  editingId.value    = null;
  isEditing.value    = false;
};

const openCreate = () => {
  resetForm();
  assignedTo.value = [currentUserId.value];
  showTaskModal.value = true;
};

const closeModal = () => {
  showTaskModal.value = false;
  resetForm();
};

const confirmTask = () => {
  if (!taskTitle.value.trim()) {
    alert("Please enter a task title");
    return;
  }

  taskStore.addTask({
    title:      taskTitle.value.trim(),
    category:   taskCategory.value,
    priority:   taskPriority.value,
    dueDate:    dueDate.value,
    assignedTo: assignedTo.value,
    createdBy:  currentUserId.value,
  });

  closeModal();
};

const priorityColor = (priority: string) => {
  if (priority === "High")   return "#b91c1c";
  if (priority === "Normal") return "#92400e";
  return "#15803d";
};

const priorityBg = (priority: string) => {
  if (priority === "High")   return "#fee2e2";
  if (priority === "Normal") return "#fef9c3";
  return "#dcfce7";
};

const isOverdue = (dueDate: string) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

const startTask = (id: number) => {
  taskStore.startTask(id);
};

const deleteTask = (id: number) => {
  if (confirm("Delete this task?")) taskStore.deleteTask(id, currentUserId.value);
};
</script>

<template>
  <div>

    <div class="page-header">
      <div>
        <h1 class="page-title">To Do</h1>
        <p class="page-subtitle"></p>
      </div>
      <button class="btn-create" @click="openCreate">
        <i class="fa-solid fa-plus"></i> Create Task
      </button>
    </div>

    <p v-if="todoTasks.length === 0" class="empty-msg">
      No to-do tasks yet. Click "Create Task" to add one!
    </p>

    <div v-else class="card-grid">
      <div v-for="task in todoTasks" :key="task.id" class="card">

        <div class="card-top">
          <h3 class="card-title">{{ task.title }}</h3>
          <span class="priority-badge"
            :style="{ color: priorityColor(task.priority), backgroundColor: priorityBg(task.priority) }">
            {{ task.priority }}
          </span>
        </div>

        <p class="card-meta">{{ task.category }}</p>
        <p class="card-meta"
          :style="{ color: isOverdue(task.dueDate) ? '#e74c3c' : 'gray' }">
          Due: {{ task.dueDate || "No date set" }}
        </p>

        <div class="assigned-row" v-if="task.assignedTo.length > 0">
          <span v-for="userId in task.assignedTo" :key="userId" class="assigned-badge">
            {{ userStore.getUserById(userId)?.name ?? "Unknown" }}
          </span>
        </div>

        <div class="card-actions">
          <button class="btn-delete" @click="deleteTask(task.id)">Delete</button>
          <button class="btn-start"  @click="startTask(task.id)">Start</button>
        </div>

      </div>
    </div>

    <div v-if="showTaskModal" class="modal-overlay">
      <div class="modal">

        <h2>Create New Task</h2>

        <div class="modal-field">
          <label>Title</label>
          <input type="text" v-model="taskTitle" placeholder="Task title" />
        </div>

        <div class="modal-field">
          <label>Category</label>
          <select v-model="taskCategory">
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>
        </div>

        <div class="modal-field">
          <label>Priority</label>
          <select v-model="taskPriority">
            <option value="High">High</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div class="modal-field">
          <label>Due Date</label>
          <input type="date" v-model="dueDate" />
        </div>

        <div class="modal-field">
          <label>Assign To</label>
          <div class="checkbox-group">
            <label v-for="user in userStore.users" :key="user.id" class="checkbox-item">
              <input type="checkbox" :value="user.id" v-model="assignedTo" />
              {{ user.name }} ({{ user.role }})
            </label>
          </div>
        </div>

        <div class="modal-actions">
          <button class="cancel"  @click="closeModal">Cancel</button>
          <button class="confirm" @click="confirmTask">Confirm</button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}
.page-title { font-size: 26px; color: #1e3a8a; margin: 0 0 4px; }
.page-subtitle { font-size: 14px; color: gray; margin: 0; }
.empty-msg { text-align: center; color: gray; font-size: 14px; padding: 48px 0; }

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.card {
  border: 1px solid #ddd;
  padding: 18px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}
.card-title { font-size: 15px; color: #1e3a8a; margin: 0; }
.priority-badge {
  font-size: 11px; font-weight: bold;
  padding: 2px 8px; border-radius: 20px; flex-shrink: 0;
}
.card-meta { font-size: 13px; color: gray; margin: 4px 0; }
.assigned-row { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
.assigned-badge {
  font-size: 11px; background-color: #e0e7ff;
  color: #3730a3; padding: 2px 8px; border-radius: 20px; font-weight: bold;
}
.card-actions { display: flex; gap: 8px; margin-top: 14px; }
.btn-delete {
  background-color: #e74c3c; color: white; border: none;
  padding: 6px 14px; border-radius: 6px; cursor: pointer;
  font-size: 13px; font-weight: bold;
}
.btn-start {
  background-color: rgb(8, 170, 127); color: white; border: none;
  padding: 6px 14px; border-radius: 6px; cursor: pointer;
  font-size: 13px; font-weight: bold;
}
.btn-create {
  background-color: #1e3a8a; color: white; border: none;
  padding: 10px 20px; border-radius: 8px; cursor: pointer;
  font-weight: bold; font-size: 14px;
  display: flex; align-items: center; gap: 8px;
  transition: background-color 0.2s;
}
.btn-create:hover { background-color: #162d6b; }

.modal-overlay {
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex; justify-content: center; align-items: center;
  z-index: 100;
}
.modal {
  background: white; padding: 28px; border-radius: 12px; width: 360px;
  display: flex; flex-direction: column; gap: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  max-height: 90vh; overflow-y: auto;
}
.modal h2 { font-size: 18px; color: #1e3a8a; margin: 0; }
.modal-field { display: flex; flex-direction: column; gap: 5px; }
.modal-field label { font-size: 12px; font-weight: bold; color: #374151; }
.modal-field input,
.modal-field select {
  padding: 9px 10px; border-radius: 8px; border: 1px solid #ccc;
  font-size: 14px; font-family: Arial, Helvetica, sans-serif;
}
.checkbox-group { display: flex; flex-direction: column; gap: 6px; }
.checkbox-item { display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; }
.modal-actions { display: flex; justify-content: space-between; margin-top: 4px; }
.cancel {
  background: #e74c3c; color: white; border: none;
  padding: 8px 18px; border-radius: 6px; cursor: pointer; font-weight: bold;
}
.confirm {
  background: #1e3a8a; color: white; border: none;
  padding: 8px 18px; border-radius: 6px; cursor: pointer; font-weight: bold;
}
</style>