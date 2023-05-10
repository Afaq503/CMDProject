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
          to="/user"
          prepend-icon="mdi-format-list-checks"
          title="ToDo"></v-list-item>
        <v-list-item
          link=""
          to=""
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

        <v-table fixed-header height="300px">
          <thead>
            <tr>
              <th class="text-left">Task</th>
              <th class="text-left">Date</th>
              <th class="text-left">Time</th>
              <th class="text-left">Edit</th>
              <th class="text-left">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(task, id) in taskList" :key="id">
              <td>{{ task.taskname }}</td>
              <td>{{ task.taskdate }}</td>
              <td>{{ task.tasktime }}</td>
              <td>
                <v-btn
                  @click="editUser(task.id)"
                  icon="mdi-pen"
                  variant="tonal"></v-btn>
              </td>
              <td>
                <v-btn
                  @click="deletetask(task.id)"
                  icon="mdi-delete"
                  variant="tonal"></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-dialog v-model="editDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ dialogTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="editForm" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="editedTask.taskname"
                  label="Task"
                  :rules="nameRules"
                  type="text"
                  required></v-text-field>
                <v-text-field
                  v-model="editedTask.taskdate"
                  label="Date"
                  :rules="dateRules"
                  type="date"
                  required></v-text-field>
                <v-text-field
                  v-model="editedTask.tasktime"
                  label="Time"
                  :rules="timeRules"
                  type="time"
                  required></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="editDialog = false"
                >Cancel</v-btn
              >
              <v-btn
                color="blue darken-1"
                text
                @click="saveChanges"
                :disabled="!valid"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
      <v-spacer></v-spacer>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "ToDoView",
  data: () => ({
    valid: false,
    drawer: null,
    loading: false,
    taskList: [],
    text: "",
    snackbar: false,
    taskname: "",
    nameRules: [
      (value) => !!value || "Task is required",
      (value) =>
        (value && value.length >= 3) || "Name must be up to 3 characters",
    ],
    tasktime: "",
    timeRules: [(value) => !!value || "Time is required"],
    taskdate: "",
    dateRules: [(value) => !!value || "Date is required"],
    editDialog: false,
    dialogTitle: "Edit From",
    selectedUser: null,
    editedTask: {
      id: "",
      taskname: "",
      taskdate: "",
      tasktime: "",
    },
  }),
  async mounted() {
    await this.listview();
  },
  created() {
    this.getUsers();
  },
  methods: {
    async listview() {
      const response = await axios.get("http://localhost:3000/taskslist");
      this.taskList = response.data;
    },
    async getUsers() {
      try {
        const response = await axios.get("http://localhost:3000/users");
        this.taskList = response.data;
      } catch {
        console.log("error in getUser");
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
    async editUser(id, taskname, taskdate, tasktime) {
      try {
        this.editDialog = true;
        this.editedTask.id = id;
        this.editedTask.taskname = taskname;
        this.editedTask.taskdate = taskdate;
        this.editedTask.tasktime = tasktime;
      } catch {
        console.log("error in edit user");
      }
    },
    async saveChanges() {
      try {
        // Update user on JSON server
        await axios.put(
          `http://localhost:3000/taskslist/${this.editedTask.id}`,
          this.editedTask
        );

        // Update user in userList array
        const index = this.taskList.findIndex(
          (task) => task.id === this.editedTask.id
        );
        if (index !== -1) {
          this.taskList.splice(index, 1, this.editedTask);
        }
      } catch {
        console.log("error in Save changes");
      }
      this.editDialog = false;
    },
    async deletetask(id) {
      try {
        // Delete user from JSON server
        await axios.delete(`http://localhost:3000/taskslist/${id}`);

        // Remove user from userList array
        this.taskList = this.taskList.filter((task) => task.id !== id);
      } catch {
        console.log("error delet function");
      }
    },
  },
};
</script>
