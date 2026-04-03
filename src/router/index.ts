import { createRouter, createWebHistory } from "vue-router"
import Home from "@/pages/Home.vue"
import Register from "@/pages/Register.vue"
import Login from "@/pages/Login.vue"
import TaskBuddy from "@/pages/TaskBuddy.vue"
import MyDashboard from "@/views/MyDashboard.vue"
import MyTasks from "@/views/MyTasks.vue"
import ToDo from "@/views/ToDo.vue"
import InProgress from "@/views/InProgress.vue"
import Completed from "@/views/Completed.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/",         name: "home",     component: Home     },
    { path: "/register", name: "register", component: Register },
    { path: "/login",    name: "login",    component: Login    },
    {
      path: "/taskbuddy",
      name: "taskbuddy",
      component: TaskBuddy,
      meta: { requiresAuth: true },
      children: [
        { path: "",            redirect: "dashboard"                    },
        { path: "dashboard",   name: "dashboard", component: MyDashboard },
        { path: "my-tasks",    name: "mytasks",   component: MyTasks     },
        { path: "to-do",       name: "todo",      component: ToDo        },
        { path: "in-progress", name: "inprogress",component: InProgress  },
        { path: "completed",   name: "completed", component: Completed   },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) { next(); return; }
  const session = sessionStorage.getItem("currentUser")
  session ? next() : next({ name: "login" })
})

export default router