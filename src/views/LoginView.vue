<template>
  <v-app>
    <div class="background"></div>
    <v-main class="d-flex justify-center align-center">
      <v-col cols="10" lg="4" class="mx-auto">
        <v-card class="pa-4">
          <div class="text-center">
            <v-avatar size="100" color="blue-lighten-4">
              <v-icon size="40" color="blue">mdi-account</v-icon>
            </v-avatar>
            <h2 class="text-blue">ToDo Login Page</h2>
          </div>
          <v-form ref="form">
            <v-card-text>
              <v-text-field
                v-model="email"
                :rules="emailRules"
                required
                color="blue"
                type="email"
                label="Email"
                placeholder="Email"
                hint="Enter your email to access this website"
                prepend-inner-icon="mdi-account" />
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                required
                color="blue"
                :type="passwordShow ? 'text' : 'password'"
                label="Password"
                placeholder="Password"
                prepend-inner-icon="mdi-key"
                hint="Enter your password to access this website"
                :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="passwordShow = !passwordShow" />
              <v-switch required label="Remember me" color="blue"></v-switch>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn
                @click="validate"
                :loading="loading"
                type="submit"
                color="blue-darken-4"
                variant="flat">
                <span class="text-white px-8">Login</span>
              </v-btn>
            </v-card-actions>
          </v-form>
          <h3 class="text-blue text-center">
            Don't Have an account?
            <router-link to="/signup">
              <v-btn variant="plain">
                <v-icon>mdi-account-box</v-icon>
                Sign Up
              </v-btn>
            </router-link>
          </h3>
        </v-card>
      </v-col>
    </v-main>
    <v-snackbar location="top" v-model="snackbar" color="green">
      {{ text }}
    </v-snackbar>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "LoginView",
  data: () => ({
    admin: false,
    valid: true,
    loading: false,
    snackbar: false,
    passwordShow: false,
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
    text: "",
  }),
  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        try {
          this.loading = true;

          let result = await axios.get(
            `http://localhost:3000/users?email=${this.email}&password=${this.password}`
          );
          if (result.status == 200 && result.data.length > 0) {
            this.text = "Login is Successfully";
            setTimeout(() => {
              localStorage.setItem("user-info", JSON.stringify(result.data[0]));
              this.loading = false;
              this.snackbar = true;
              const useradmin = JSON.parse(localStorage.getItem("user-info"));
              if ((this.admin = useradmin.admin)) {
                this.$router.push({ name: "AdminView" });
              } else {
                this.$router.push({ name: "UserView" });
              }
            }, [2000]);
          } else {
            this.text = "Email and Password is incorect";
            setTimeout(() => {
              this.loading = false;
              this.snackbar = true;
            }, [2000]);
          }
        } catch (error) {
          console.log("this is error");
        }
      }
    },
  },

  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      if (this.admin == true) {
        this.$router.push({ name: "AdminView" });
      } else {
        this.$router.push({ name: "UserView" });
      }
    }
  },
};
</script>

<style>
.background {
  background-image: url(../assets/todo-banner.jpg);
  height: 300px;
  width: 100%;
  display: block;
  position: absolute;
  top: 0;
  background-size: cover;
}
</style>
