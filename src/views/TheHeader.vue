<template>
  <div>
    <nav class="navbar navbar-expand-sm">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand" id="eden">
          <i class="fa-solid fa-apple-whole">  The eden</i>
        </router-link>
        <ul class="navbar-nav">
          <li class="nav-item" v-if="!isLogin" id="regist">
            <router-link :to="{ name: 'RegistUser' }" class="nav-link" id="test">Sign up</router-link>
          </li>
          <li class="nav-item" v-if="isLogin" id="mypage">
            <router-link :to="{ name: 'MyPage' }" class="nav-link" id="test">My Page</router-link>
          </li>
          <li class="nav-item" v-if="!isLogin" id="login" >
            <router-link :to="{ name: 'LoginUser' }" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item" v-else id="logout">
            <a @click.prevent="onClickLogout" class="nav-link">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

const memberStore = "memberStore";

export default {
  name: "TheHeader",
  data() {
    return {};
  },
  computed: {
    ...mapState(memberStore, ["isLogin", "userInfo"]),
    ...mapGetters(["checkUserInfo"]),
  },
  methods: {
    ...mapActions(memberStore, ["userLogout"]),
    ...mapMutations(memberStore, ["SET_IS_LOGIN"]), // Import and map the SET_IS_LOGIN mutation

    onClickLogout() {
      this.SET_IS_LOGIN(false);

      sessionStorage.clear();

      if (this.$route.path !== "/") {
        this.$router.push({ name: "AppMain" });
      }
    },
  },
};
</script>

<style scoped>
/* nav {
  margin: 0;
} */
#eden {
  /* 왼쪽에 여백 조금 남게 */
  margin-left: 70px;
}

#content {
  /* header는 항상 상단에 고정 */
  position: fixed;
}

/* navbar-nav */
.navbar-nav {
  /* 오른쪽에 여백 조금 남게 */
  margin-right: 50px;
}

#test {
  color: #f0f0f0;

  /* 글자 두께 bold보단 작게, 지금보단 크게 */
  font-weight: 500;
  /* font-weight: bold; */

}

#regist, #mypage {
  background-image: linear-gradient(135deg, #3670f7 0%, #9368f8 100%);
  /* 테두리 둥글게 */
  border-radius: 20px;
  /* 오른쪽에 간격 조금 있게 */
  margin-right: 10px;
  /* 글자 색은 흰색 */
  color: white;
  /* 글자 두껍게 */
  font-family: 'Ubuntu', sans-serif;
}

/* 로그인 로그아웃 동시제어 */
#login, #logout {
  background-color: #e8e9ed;
  /* 테두리 둥글게 */
  border-radius: 20px;
  /* 오른쪽에 간격 조금 있게 */
  margin-right: 10px;
  /* 글자 색은 흰색 */
  color: black;
  /* 글자 두껍게 */
  font-weight: bold;
  font-family: 'Ubuntu', sans-serif;
  /* 마우스 올리면 살짝 커지게 */
  transition: all 0.3s ease-in-out;
  /* 마우스 올리면 마우스 포인터 바꾸기 */
  cursor: pointer;
}

</style>
