<template>
  <div id="my-page">
    <h3 id="title" class="mx-auto">My Page</h3>
    <b-card class="mx-auto">
      <b-form>
        <b-form-group label="Nickname:" label-for="Nickname">
          <b-form-input
            id="Nickname"
            type="text"
            readonly
            ></b-form-input>
            <!-- v-model="user.username" -->
          </b-form-group>

        <b-form-group label="Email:" label-for="email">
          <b-form-input
            id="email"
            type="email"
            readonly
            ></b-form-input>
            <!-- v-model="user.email" -->
        </b-form-group>

        <b-form-group label="hint:" label-for="hint">
          <b-form-textarea
            id="hint"
            readonly
            ></b-form-textarea>
            <!-- v-model="user.bio" -->
        </b-form-group>
      </b-form>
    </b-card>
  </div>
</template>
<!-- 
<script>
import { getUserInfo } from "@/api/user";

export default {
  name: "MyPage",
  data() {
    return {
      user: {
        username: "",
        email: "",
      },
    };
  },
  mounted() {
    this.fetchUserInfo();
  },
  methods: {
    fetchUserInfo() {
      getUserInfo()
        .then((response) => {
          this.user.username = response.data.username;
          this.user.email = response.data.email;
        })
        .catch((error) => {
          console.log("Failed to fetch user information:", error);
        });
    },
  },
};
</script>
 -->
<style scoped>
#title {
  max-width: 40rem;
  background-image: linear-gradient(135deg, #3670f7 0%, #9368f8 100%);
  padding: 1rem;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 25px;
  margin: 20px;
}

#my-page {
  max-width: 40rem;
  margin: 2rem auto;
}
</style>
