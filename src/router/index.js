import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import AdminView from "../components/Admin/AdminView.vue";
import UserView from "../components/User/UserView.vue";
import ListView from "../components/Admin/ListView.vue";
import ToDoView from "../components/User/ToDoView.vue";

const routes = [
  {
    path: "/",
    name: "LoginView",
    component: LoginView,
  },

  {
    path: "/signup",
    name: "Signup",
    component: SignupView,
  },
  {
    path: "/admin",
    name: "AdminView",
    component: AdminView,
  },
  {
    path: "/user",
    name: "UserView",
    component: UserView,
  },
  {
    path: "/list",
    name: "ListView",
    component: ListView,
  },
  {
    path: "/task",
    name: "ToDoView",
    component: ToDoView,
  },
];

const router = createRouter({
  // import.meta.env.BASE_URL
  history: createWebHashHistory(),
  routes,
});

export default router;
