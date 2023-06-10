<template>
  <div id="login-form">
    <h3 id="title" class="mx-auto" style="max-width: 40rem">Log in</h3>
    <b-card class="mx-auto" style="max-width: 40rem">
      <b-form @submit="onSubmit" @reset="onReset">
        <b-form-group label="User ID" label-for="id">
          <b-form-input
            id="id"
            v-model="user.id"
            required
            placeholder="Enter your user ID..."
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Password" label-for="pw">
          <b-form-input
            type="password"
            id="pw"
            v-model="user.pw"
            required
            placeholder="Enter your password..."
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" style="
          background-image: linear-gradient(135deg, #3670f7 0%, #9368f8 100%);
          color: white;
          font-weight: 500;
        " class="m-1">Log In</b-button>
        <b-button type="reset" variant="danger" class="m-1">Reset</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

const memberStore = "memberStore";
export default {
  name: "LoginUser",
  data() {
    return {
      // isLoginError: false,
      user: {
        id: null,
        pw: null,
      },
    };
  },
  computed: {
    ...mapState(memberStore, ["isLogin", "isLoginError", "userInfo"]),
  },
  methods: {
    ...mapActions(memberStore, ["userConfirm", "getUserInfo"]),
    async onSubmit(event) {
      event.preventDefault();
      await this.userConfirm(this.user);
      let token = sessionStorage.getItem("access-token");
      console.log("1. confirm() token >> " + token);
      console.log(this.isLogin);
      if (this.isLogin) {
        this.$router.push({ name: "MainVue" });
      }
    },
    onReset(evt) {
      evt.preventDefault();
      this.user.id = "";
      this.user.pw = "";
    },
    movePage() {
      this.$router.push({ name: "RegistUser" });
    },
  },
};
</script>

<style></style>
