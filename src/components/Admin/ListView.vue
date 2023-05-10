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
            <v-icon size="40" color="blue">mdi-gavel</v-icon>
          </v-avatar>
          <h3>Admin Dashborad</h3>
        </v-list-item>
        <v-list-item
          link=""
          to="/admin"
          prepend-icon="mdi-account"
          title="Create User"></v-list-item>
        <v-list-item
          link=""
          prepend-icon="mdi-account-box"
          title="UserList"></v-list-item>
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
          <v-toolbar-title class="font-weight-light">
            User List
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-toolbar>
      </v-card>
      <v-table fixed-header height="400px">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Role</th>
            <th class="text-left">Edit</th>
            <th class="text-left">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, id) in userList" :key="id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.admin }}</td>
            <td>
              <v-btn
                icon="mdi-pen"
                variant="tonal"
                @click="editUser(user.id)"></v-btn>
            </td>
            <td>
              <v-btn
                icon="mdi-delete"
                variant="tonal"
                @click="deleteUser(user.id)"></v-btn>
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
                v-model="editedItem.name"
                label="Name"
                :rules="[rules.required]"
                required></v-text-field>
              <v-text-field
                v-model="editedItem.email"
                label="Email"
                :rules="[rules.required, rules.email]"
                required></v-text-field>
              <v-text-field
                v-model="editedItem.password"
                label="Password"
                :rules="[rules.required]"
                required></v-text-field>
              <v-checkbox
                v-model="editedItem.admin"
                required
                label="Check when you permission as a Admin">
              </v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" @click="editDialog = false"
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
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "ListView",
  data: () => ({
    userList: [],
    editDialog: false,
    dialogTitle: "Edit From",
    selectedUser: null,
    editedItem: {
      id: "",
      name: "",
      email: "",
      password: "",
      admin: false,
    },
    valid: false,
    rules: {
      required: (value) => !!value || "Required.",
      email: (value) =>
        /.+@.+\..+/.test(value) || "Please enter a valid email.",
    },
    drawer: null,
    loading: false,
    snackbar: false,
  }),
  async mounted() {
    await this.listview();
  },
  created() {
    this.getUsers();
  },
  methods: {
    async listview() {
      const response = await axios.get("http://localhost:3000/users");
      this.userList = response.data;
    },
    async getUsers() {
      try {
        const response = await axios.get("http://localhost:3000/users");
        this.userList = response.data;
      } catch {
        console.log("error in getUser");
      }
    },
    async editUser(id, name, email, admin) {
      try {
        this.editDialog = true;
        this.editedItem.id = id;
        this.editedItem.name = name;
        this.editedItem.email = email;
        this.editedItem.admin = admin;
      } catch {
        console.log("error in edit user");
      }
    },
    async saveChanges() {
      try {
        // Update user on JSON server
        await axios.put(
          `http://localhost:3000/users/${this.editedItem.id}`,
          this.editedItem
        );

        // Update user in userList array
        const index = this.userList.findIndex(
          (user) => user.id === this.editedItem.id
        );
        if (index !== -1) {
          this.userList.splice(index, 1, this.editedItem);
        }
      } catch {
        console.log("error in Save changes");
      }
      this.editDialog = false;
    },

    async deleteUser(id) {
      try {
        // Delete user from JSON server
        await axios.delete(`http://localhost:3000/users/${id}`);

        // Remove user from userList array
        this.userList = this.userList.filter((user) => user.id !== id);
      } catch {
        console.log("error delet function");
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
