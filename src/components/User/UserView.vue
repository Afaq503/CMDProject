<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      class="bg-indigo-lighten-1"
      theme="dark"
      permanent>
      <v-list color="transparent">
        <v-list-item-title class="text-center">Vuetify ToDo</v-list-item-title>
        <v-list-item-subtitle class="text-center"
          >Best ToDo Ever!</v-list-item-subtitle
        >
        <v-list-item class="text-center">
          <v-avatar size="100" color="blue-lighten-4">
            <v-icon size="40" color="blue">mdi-account</v-icon>
          </v-avatar>
          <h3>User Dashborad</h3>
        </v-list-item>
        <v-list-item
          link=""
          prepend-icon="mdi-format-list-checks"
          title="ToDo"></v-list-item>
        <v-list-item
          link=""
          to="/task"
          prepend-icon="mdi-account-box"
          title="Task List"></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            @click="load"
            block
            :loading="loading"
            type="submit"
            append-icon="mdi-logout"
            color="blue-darken-4">
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      color="teal-darken-4"
      image="https://picsum.photos/1920/1080?random">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title> To Do Web Application</v-toolbar-title></v-app-bar
    >

    <v-main>
      <v-card class="mx-auto" color="indigo-lighten-1" max-width="600">
        <v-toolbar flat color="blue">
          <v-img src="../../assets/logo1.png"></v-img>

          <v-toolbar-title class="font-weight-light">
            Welcome to in Todo App
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form v-model="valid">
          <v-container>
            <v-form ref="form">
              <v-row class="d-flex justify-center mb-6">
                <v-col cols="15" md="9">
                  <v-text-field
                    v-model="taskname"
                    :rules="nameRules"
                    type="text"
                    label="Enter your task"
                    required></v-text-field>
                  <v-text-field
                    v-model="taskdate"
                    :rules="dateRules"
                    type="date"
                    label="Select your date"
                    required></v-text-field>
                  <v-text-field
                    v-model="tasktime"
                    type="time"
                    :rules="timeRules"
                    label="Select your time"
                    required></v-text-field>
                </v-col>

                <v-btn
                  @click="validate"
                  :loading="loading"
                  type="submit"
                  color="blue-darken-4"
                  variant="flat">
                  <span class="text-white px-8">Add Task</span>
                </v-btn>
              </v-row>
            </v-form>
          </v-container>
        </v-form>
      </v-card>
      <v-spacer></v-spacer>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "UserView",
  data: () => ({
    valid: true,
    drawer: null,
    loading: false,
    loading1: false,
    snackbar: false,

    taskname: "",
    nameRules: [
      (value) => !!value || "Name is required",
      (value) =>
        (value && value.length >= 3) || "Name must be up to 3 characters",
    ],
    taskstates: "",

    tasktime: "",
    timeRules: [(value) => !!value || "Time is required"],
    taskdate: "",
    dateRules: [(value) => !!value || "Date is required"],
  }),

  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        try {
          this.loading1 = true;
          let result = await axios.post("http://localhost:3000/taskslist", {
            taskname: this.taskname,
            taskdate: this.taskdate,
            tasktime: this.tasktime,
          });

          if (result.status == 201) {
            localStorage.setItem("user-info", JSON.stringify(result.data));
            setTimeout(() => {
              this.loading1 = false;
              localStorage.setItem("user-info", JSON.stringify(result.data[0]));
            }, [2000]);
            this.$router.push({ name: "ToDoView" });
          }
        } catch (error) {
          console.log("this is error");
        }
      }
    },

    load() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 2000);
      localStorage.clear();
      this.$router.push({ name: "LoginView" });
    },
  },
};
</script>
