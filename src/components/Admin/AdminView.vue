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
          prepend-icon="mdi-account"
          title="Create User"></v-list-item>

        <v-list-item
          link=""
          to="/list"
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
      <v-toolbar-title> To Do Web Application</v-toolbar-title>
    </v-app-bar>
    <v-main class="d-flex justify-center align-center">
      <v-col cols="10" lg="4" class="mx-auto">
        <v-card class="pa-4" color="blue-lighten-4">
          <div class="text-center">
            <h2 class="text-blue">Create User</h2>
          </div>
          <v-form ref="form">
            <v-card-text>
              <v-text-field
                v-model="name"
                :rules="nameRules"
                color="blue"
                type="name"
                label="Name"
                placeholder="Name"
                hint="Enter your name "
                prepend-inner-icon="mdi-account" />
              <v-text-field
                v-model="email"
                :rules="emailRules"
                color="blue"
                type="email"
                label="Email"
                placeholder="Email"
                hint="Enter your email"
                prepend-inner-icon="mdi-email" />
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                color="blue"
                :type="passwordShow ? 'text' : 'password'"
                label="Password"
                placeholder="Password"
                prepend-inner-icon="mdi-key"
                hint="Enter your password"
                :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="passwordShow = !passwordShow" />

              <v-checkbox
                v-model="admin"
                required
                label="Check when you permission as a Admin">
              </v-checkbox>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn
                @click="validate"
                :loading="loading1"
                type="submit"
                color="blue-darken-4"
                variant="flat">
                <span class="text-white px-8">Create</span>
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import ListView from "./ListView.vue";
export default {
  name: "AdminView",
  data: () => ({
    admin: false,
    drawer: null,
    loading: false,
    loading1: false,
    snackbar: false,
    passwordShow: false,
    name: "",
    nameRules: [
      (value) => !!value || "Name is required",
      (value) =>
        (value && value.length >= 3) || "Name must be up to 3 characters",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 6) || "Password must be less than 10 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "Email is required",
      (v) => /.+@.+\..+/.test(v) || "Email must be valid",
    ],
  }),
  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        try {
          this.loading1 = true;
          let result = await axios.post("http://localhost:3000/users", {
            name: this.name,
            email: this.email,
            password: this.password,
            admin: this.admin,
          });

          if (result.status == 201) {
            localStorage.setItem("user-info", JSON.stringify(result.data));
            this.$router.push({ name: "ListView" });
            setTimeout(() => {
              localStorage.setItem("user-info", JSON.stringify(result.data[0]));
              this.loading1 = false;
              this.snackbar = true;
              this.$router.push({ name: "ListView" });
            }, [2000]);
          }

          if (result.status == 200 && result.data.length > 0) {
            this.text = "User create is Successfully";
          } else {
            setTimeout(() => {
              this.loading1 = false;
              this.snackbar = true;
            }, [2000]);
          }
        } catch (error) {
          console.log("this is error");
        }
      }
    },
    load() {
      this.loading = true;
      localStorage.clear();
      this.$router.push({ name: "LoginView" });
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
  },
};
</script>
