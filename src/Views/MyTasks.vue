<script setup lang="ts">
import { ref, computed } from "vue";
import { useTaskStore } from "@/stores/useTaskStore";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";

const taskStore = useTaskStore();
const userStore = useUserStore();
const authStore = useAuthStore();

const currentUserId = computed(() => authStore.currentUser?.id ?? -1);

const myTasks = computed(() =>
  taskStore.tasks.filter(t => t.assignedTo.includes(currentUserId.value))
);

const showTaskModal = ref(false);
const isEditing     = ref(false);
const editingId     = ref<number | null>(null);
const taskTitle     = ref("");
const taskCategory  = ref<"Work" | "Personal">("Work");
const taskPriority  = ref<"High" | "Normal" | "Low">("Normal");
const dueDate       = ref("");
const assignedTo    = ref<number[]>([]);

const showShareModal = ref(false);
const sharingTaskId  = ref<number | null>(null);
const shareToUserId  = ref<number | null>(null);
const shareError     = ref("");

const shareableUsers = computed(() =>
  userStore.users.filter(u => u.id !== currentUserId.value)
);

const priorityColor = (p: string) =>
  p === "High" ? "#b91c1c" : p === "Normal" ? "#92400e" : "#15803d";

const priorityBg = (p: string) =>
  p === "High" ? "#fee2e2" : p === "Normal" ? "#fef9c3" : "#dcfce7";

const statusLabel = (s: string) =>
  s === "todo" ? "To Do" : s === "inprogress" ? "In Progress" : "Completed";

const statusColor = (s: string) =>
  s === "todo" ? "#1e3a8a" : s === "inprogress" ? "rgb(212,149,40)" : "#15803d";

const statusBg = (s: string) =>
  s === "todo" ? "#e8edf8" : s === "inprogress" ? "rgba(212,149,40,0.15)" : "#dcfce7";

const isOverdue = (d: string) => !!d && new Date(d) < new Date();
const isCreator = (task: any) => task.createdBy === currentUserId.value;

const resetForm = () => {
  taskTitle.value = ""; taskCategory.value = "Work";
  taskPriority.value = "Normal"; dueDate.value = "";
  assignedTo.value = []; editingId.value = null; isEditing.value = false;
};

const openCreate = () => {
  resetForm();
  assignedTo.value = [currentUserId.value];
  showTaskModal.value = true;
};

const openEdit = (taskId: number) => {
  const task = taskStore.tasks.find(t => t.id === taskId);
  if (!task) return;
  taskTitle.value = task.title; taskCategory.value = task.category;
  taskPriority.value = task.priority; dueDate.value = task.dueDate;
  assignedTo.value = [...task.assignedTo];
  editingId.value = task.id; isEditing.value = true;
  showTaskModal.value = true;
};

const closeTaskModal = () => { showTaskModal.value = false; resetForm(); };

const confirmTask = () => {
  if (!taskTitle.value.trim()) { alert("Please enter a task title"); return; }

  if (isEditing.value && editingId.value !== null) {
    const result = taskStore.updateTask(editingId.value, {
      title: taskTitle.value.trim(), category: taskCategory.value,
      priority: taskPriority.value, dueDate: dueDate.value,
      assignedTo: assignedTo.value,
    }, currentUserId.value);
    if (result === 'not_owner') {
      alert("Only the task creator can edit this task.");
      closeTaskModal(); return;
    }
    alert("Task updated!");
  } else {
    taskStore.addTask({
      title: taskTitle.value.trim(), category: taskCategory.value,
      priority: taskPriority.value, dueDate: dueDate.value,
      assignedTo: assignedTo.value, createdBy: currentUserId.value,
    });
    alert("Task created!");
  }
  closeTaskModal();
};

const deleteTask = (id: number) => {
  if (confirm("Remove this task from your list?"))
    taskStore.deleteTask(id, currentUserId.value);
};

const completeTask = (id: number) => {
  taskStore.completeTask(id);
  alert("Task marked as complete!");
};

const openShare = (taskId: number) => {
  sharingTaskId.value = taskId; shareToUserId.value = null;
  shareError.value = ""; showShareModal.value = true;
};

const closeShareModal = () => {
  showShareModal.value = false; sharingTaskId.value = null;
  shareToUserId.value = null; shareError.value = "";
};

const confirmShare = () => {
  if (!shareToUserId.value) { shareError.value = "Please select a user."; return; }
  const result = taskStore.shareTask(sharingTaskId.value!, currentUserId.value, shareToUserId.value);
  if (result === "already_assigned") { shareError.value = "This user already has this task."; return; }
  if (result === "already_pending")  { shareError.value = "Already sent to this user."; return; }
  alert("Task shared successfully!");
  closeShareModal();
};
</script>

<template>
  <div>

    <div class="page-header">
      <div>
        <h1 class="page-title">My Tasks</h1>
        <p class="page-subtitle"></p>
      </div>
      <button class="btn-create" @click="openCreate">
        <i class="fa-solid fa-plus"></i> Create Task
      </button>
    </div>

    <p v-if="myTasks.length === 0" class="empty-msg">
      No tasks yet. Click "Create Task" to get started!
    </p>

    <div v-else class="card-grid">
      <div
        v-for="task in myTasks" :key="task.id"
        class="card"
        :class="{ 'card-completed': task.status === 'completed' }"
      >

        <div class="card-top">
          <h3 class="card-title" :class="{ strikethrough: task.status === 'completed' }">
            {{ task.title }}
          </h3>
          <span class="priority-badge"
            :style="{ color: priorityColor(task.priority), backgroundColor: priorityBg(task.priority) }">
            {{ task.priority }}
          </span>
        </div>

        <p class="card-meta">{{ task.category }}</p>
        <p class="card-meta"
          :style="{ color: isOverdue(task.dueDate) && task.status !== 'completed' ? '#e74c3c' : 'gray' }">
          Due: {{ task.dueDate || "No date set" }}
        </p>

        <div class="assigned-row" v-if="task.assignedTo.length > 0">
          <span v-for="userId in task.assignedTo" :key="userId" class="assigned-badge">
            {{ userStore.getUserById(userId)?.name ?? "Unknown" }}
          </span>
        </div>

        <div class="card-footer">
          <span class="status-pill"
            :style="{ color: statusColor(task.status), backgroundColor: statusBg(task.status) }">
            {{ statusLabel(task.status) }}
          </span>
          <span class="owner-label" v-if="!isCreator(task)">
            <i class="fa-solid fa-share-nodes"></i>
            Shared by {{ userStore.getUserById(task.createdBy)?.name ?? "someone" }}
          </span>
        </div>

        <div class="card-actions">

          <button
            class="icon-btn edit"
            @click="openEdit(task.id)"
            :disabled="!isCreator(task) || task.status === 'completed'"
            :title="!isCreator(task) ? 'Only the creator can edit' : 'Edit task'"
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </button>

          <button
            class="icon-btn delete"
            @click="deleteTask(task.id)"
            :title="isCreator(task) ? 'Delete task' : 'Remove from my list'"
          >
            <i class="fa-solid fa-trash"></i>
          </button>

          <button
            class="icon-btn complete"
            v-if="task.status !== 'completed'"
            @click="completeTask(task.id)"
            title="Mark as complete"
          >
            <i class="fa-solid fa-circle-check"></i>
          </button>
          <span class="done-chip" v-else>
            <i class="fa-solid fa-check"></i> Done
          </span>

          <button
            class="icon-btn share"
            v-if="isCreator(task) && task.status !== 'completed'"
            @click="openShare(task.id)"
            title="Share task"
          >
            <i class="fa-solid fa-share-from-square"></i>
          </button>

        </div>
      </div>
    </div>

    <div v-if="showTaskModal" class="modal-overlay">
      <div class="modal">
        <h2>{{ isEditing ? "Edit Task" : "Create New Task" }}</h2>

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
          <button class="cancel"  @click="closeTaskModal">Cancel</button>
          <button class="confirm" @click="confirmTask">{{ isEditing ? "Update" : "Confirm" }}</button>
        </div>
      </div>
    </div>

    <div v-if="showShareModal" class="modal-overlay">
      <div class="modal">
        <h2>Share Task</h2>
        <p class="share-task-name">
          "{{ taskStore.tasks.find(t => t.id === sharingTaskId)?.title }}"
        </p>
        <div class="modal-field">
          <label>Share with</label>
          <div class="radio-group">
            <label v-for="user in shareableUsers" :key="user.id" class="radio-item">
              <input type="radio" :value="user.id" v-model="shareToUserId" />
              <span>
                {{ user.name }}
                <span class="user-role-tag">{{ user.role }}</span>
              </span>
            </label>
          </div>
        </div>
        <p class="share-error" v-if="shareError">{{ shareError }}</p>
        <div class="modal-actions">
          <button class="cancel"  @click="closeShareModal">Cancel</button>
          <button class="confirm" @click="confirmShare">
            <i class="fa-solid fa-paper-plane"></i> Send
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.page-header {
  display: flex; justify-content: space-between;
  align-items: flex-start; margin-bottom: 24px;
}
.page-title { font-size: 26px; color: #1e3a8a; margin: 0 0 4px; }
.page-subtitle { font-size: 14px; color: gray; margin: 0; }

.btn-create {
  background-color: #1e3a8a; color: white; border: none;
  padding: 10px 20px; border-radius: 8px; cursor: pointer;
  font-weight: bold; font-size: 14px;
  display: flex; align-items: center; gap: 8px;
  transition: background-color 0.2s;
}
.btn-create:hover { background-color: #162d6b; }

.empty-msg { text-align: center; color: gray; font-size: 14px; padding: 48px 0; }

.card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

.card {
  border: 1px solid #ddd; padding: 18px; border-radius: 10px;
  background-color: #f9f9f9; box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  display: flex; flex-direction: column; gap: 4px;
}
.card-completed { opacity: 0.75; }

.card-top {
  display: flex; justify-content: space-between;
  align-items: flex-start; margin-bottom: 8px;
}
.card-title { font-size: 15px; color: #1e3a8a; margin: 0; }
.strikethrough { text-decoration: line-through; opacity: 0.6; }

.priority-badge {
  font-size: 11px; font-weight: bold;
  padding: 2px 8px; border-radius: 20px; flex-shrink: 0;
}
.card-meta { font-size: 13px; color: gray; margin: 2px 0; }

.assigned-row { display: flex; flex-wrap: wrap; gap: 4px; margin: 6px 0; }
.assigned-badge {
  font-size: 11px; background-color: #e0e7ff;
  color: #3730a3; padding: 2px 8px; border-radius: 20px; font-weight: bold;
}

.card-footer {
  display: flex; align-items: center; gap: 8px;
  flex-wrap: wrap; margin-top: 4px;
}
.status-pill {
  font-size: 11px; padding: 2px 10px;
  border-radius: 20px; font-weight: bold;
}
.owner-label {
  font-size: 11px; color: rgb(212,149,40);
  font-style: italic; display: flex; align-items: center; gap: 4px;
}

.card-actions {
  display: flex; gap: 4px; margin-top: 14px;
  align-items: center; padding-top: 12px;
  border-top: 1px solid #e8edf8;
}

.icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border-radius: 8px; border: none;
  cursor: pointer; transition: background-color 0.15s, color 0.15s;
  background-color: transparent; color: #9ca3af; font-size: 15px;
}

.icon-btn.edit:hover:not(:disabled) { background-color: #e8edf8; color: #1e3a8a; }
.icon-btn.delete:hover              { background-color: #fee2e2; color: #b91c1c; }
.icon-btn.complete:hover            { background-color: #dcfce7; color: #15803d; }
.icon-btn.share:hover               { background-color: rgba(212,149,40,0.15); color: rgb(212,149,40); }
.icon-btn:disabled                  { opacity: 0.3; cursor: not-allowed; }

.done-chip {
  font-size: 12px; color: #15803d; font-weight: bold;
  background-color: #dcfce7; padding: 4px 10px;
  border-radius: 20px; display: flex; align-items: center; gap: 5px;
}

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.4); display: flex;
  justify-content: center; align-items: center; z-index: 100;
}
.modal {
  background: white; padding: 28px; border-radius: 12px; width: 380px;
  display: flex; flex-direction: column; gap: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  max-height: 90vh; overflow-y: auto;
}
.modal h2 { font-size: 18px; color: #1e3a8a; margin: 0; }

.share-task-name {
  font-size: 14px; color: #1e3a8a; font-weight: bold;
  background-color: #e8edf8; padding: 8px 12px; border-radius: 8px; margin: 0;
}
.modal-field { display: flex; flex-direction: column; gap: 5px; }
.modal-field label { font-size: 12px; font-weight: bold; color: #374151; }
.modal-field input, .modal-field select {
  padding: 9px 10px; border-radius: 8px; border: 1px solid #ccc;
  font-size: 14px; font-family: Arial, Helvetica, sans-serif;
}
.checkbox-group { display: flex; flex-direction: column; gap: 6px; }
.checkbox-item { display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; }

.radio-group { display: flex; flex-direction: column; gap: 10px; }
.radio-item {
  display: flex; align-items: center; gap: 10px; font-size: 14px; cursor: pointer;
  padding: 8px 12px; border-radius: 8px; border: 1px solid #e0e0e0;
  transition: background-color 0.15s;
}
.radio-item:hover { background-color: #f4f6fb; }
.radio-item input[type="radio"] { accent-color: #1e3a8a; width: 16px; height: 16px; }
.user-role-tag {
  font-size: 11px; background-color: #e8edf8; color: #1e3a8a;
  padding: 1px 7px; border-radius: 20px; margin-left: 6px;
}
.share-error {
  font-size: 13px; color: #e74c3c; background-color: #fdecea;
  padding: 8px 12px; border-radius: 8px; border-left: 3px solid #e74c3c; margin: 0;
}
.modal-actions {
  display: flex; justify-content: space-between; margin-top: 4px;
}
.cancel {
  background: #e74c3c; color: white; border: none;
  padding: 8px 18px; border-radius: 6px; cursor: pointer; font-weight: bold;
}
.confirm {
  background: #1e3a8a; color: white; border: none;
  padding: 8px 18px; border-radius: 6px; cursor: pointer; font-weight: bold;
  display: flex; align-items: center; gap: 6px;
}
</style>