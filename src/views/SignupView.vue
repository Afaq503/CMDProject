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
            <h2 class="text-blue">ToDo Sign Up Page</h2>
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
              <v-text-field
                v-model="cpassword"
                :rules="cpasswordRules"
                color="blue"
                :type="cpasswordShow ? 'text' : 'password'"
                label=" Confirm Password"
                placeholder="Confirm Password"
                prepend-inner-icon="mdi-key"
                hint="Enter your Confirm password"
                :append-icon="cpasswordShow ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="cpasswordShow = !passwordShow" />
              <v-text-field
                v-model="phone"
                :rules="phoneRules"
                color="blue"
                type="number"
                label="Phone"
                placeholder="Phone"
                hint="Enter your phone number "
                prepend-inner-icon="mdi-phone" />
              <v-switch label="Remember me" color="blue"></v-switch>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn
                @click="validate"
                :loading="loading"
                type="submit"
                color="blue-darken-4"
                variant="flat">
                <span class="text-white px-8">Sign Up</span>
              </v-btn>
            </v-card-actions>
          </v-form>
          <h3 class="text-blue text-center">
            Have an account?
            <router-link to="/">
              <v-btn variant="plain">
                <v-icon>mdi-login</v-icon>
                Login
              </v-btn>
            </router-link>
          </h3>
        </v-card>
      </v-col>
    </v-main>
    <v-snackbar location="top" v-model="snackbar" color="green"
      >Sign Up is Successfully</v-snackbar
    >
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "SignupView",
  data: () => ({
    valid: true,
    loading: false,
    snackbar: false,
    passwordShow: false,
    cpasswordShow: false,
    name: "",
    nameRules: [
      (value) => !!value || "Name is required",
      (value) =>
        (value && value.length >= 3) || "Name must be up to 3 characters",
    ],
    phone: "",
    phoneRules: [
      (value) => !!value || "Phone is required",
      (value) =>
        (value && value.length >= 10) || "Phone number must be 11 characters",
    ],
    cpassword: "",
    cpasswordRules: [
      (value) => !!value || "Password is required",
      (value) =>
        (value && value.length >= 6) || "Password must be up to 6 characters",
    ],
    password: "",
    passwordRules: [
      (value) => !!value || "Password is required",
      (value) =>
        (value && value.length >= 6) || "Password must be up to 6 characters",
    ],
    email: "",
    emailRules: [
      (value) => !!value || "Email is required",
      (value) => /.+@.+\..+/.test(value) || "Email must be valuealid",
    ],
  }),
  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        try {
          this.loading = true;
          let result = await axios.post("http://localhost:3000/users", {
            name: this.name,
            email: this.email,
            password: this.password,
            cpassword: this.cpassword,
            phone: this.phone,
          });

          if (result.status == 201) {
            localStorage.setItem("user-info", JSON.stringify(result.data));
            this.$router.push({ name: "HomeView" });
            setTimeout(() => {
              localStorage.setItem("user-info", JSON.stringify(result.data[0]));
              this.loading = false;
              this.snackbar = true;
              this.$router.push({ name: "HomeView" });
            }, [2000]);
          }

          if (result.status == 200 && result.data.length > 0) {
            this.text = "Login is Successfully";
          } else {
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
      this.$router.push({ name: "HomeView" });
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
