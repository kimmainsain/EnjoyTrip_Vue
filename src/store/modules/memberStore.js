import jwtDecode from "jwt-decode";
// import router from "@/router";
import { login, findById, logout } from "@/api/member";

const memberStore = {
  namespaced: true,
  state: {
    isLogin: false,
    isLoginError: false,
    userInfo: null,
    isValidToken: false,
  },
  getters: {
    checkUserInfo: function (state) {
      return state.userInfo;
    },
    checkToken: function (state) {
      return state.isValidToken;
    },
  },
  mutations: {
    SET_IS_LOGIN: (state, isLogin) => {
      state.isLogin = isLogin;
    },
    SET_IS_LOGIN_ERROR: (state, isLoginError) => {
      state.isLoginError = isLoginError;
    },
    SET_IS_VALID_TOKEN: (state, isValidToken) => {
      state.isValidToken = isValidToken;
    },
    SET_USER_INFO: (state, userInfo) => {
      state.isLogin = true;
      state.userInfo = userInfo;
    },
  },
  actions: {
    async userConfirm({ commit }, user) {
      await login(
        user,
        ({ data }) => {
          console.log("1. userConfirm() data :: ", data);
          let accessToken = data["jwt"];
          // let refreshToken = data["refresh-token"];
          console.log("login success token created!!!! >> ", accessToken);
          // console.log("login success token created!!!! >> ", accessToken, refreshToken);
          commit("SET_IS_LOGIN", true);
          commit("SET_IS_LOGIN_ERROR", false);
          commit("SET_IS_VALID_TOKEN", true);
          commit("SET_USER_INFO", data);
          sessionStorage.setItem("access-token", accessToken);
          // sessionStorage.setItem("refresh-token", refreshToken);
          alert('로그인 되었습니다.')
        },
        (error) => {
          commit("SET_IS_LOGIN", false);
          commit("SET_IS_LOGIN_ERROR", true);
          commit("SET_IS_VALID_TOKEN", false);
          console.log(error);
          alert("로그인에 실패하였습니다.")
        }
      );
    },
    async getUserInfo({ commit, dispatch }, token) {
      let decodeToken = jwtDecode(token);
      console.log("2. getUserInfo() decodeToken :: ", decodeToken);
      await findById(decodeToken.id, ({ data }) => {
          console.log("3. getUserInfo() data :: ", data);
          commit("SET_USER_INFO", data.userInfo);
        },
        async (error) => {
          console.log("유저 정보 없음!!!!");
          console.log(
            "getUserInfo() error code [토큰 만료되어 사용 불가능.] ::: ",
            error.response.status
          );
          commit("SET_IS_VALID_TOKEN", false);
          await dispatch("tokenRegeneration");
        }
      );
    },
    async userLogout({ commit }, userid) {
      await logout(
        userid,
        ({ data }) => {
          if (data.message === "success") {
            commit("SET_IS_LOGIN", false);
            commit("SET_USER_INFO", null);
            commit("SET_IS_VALID_TOKEN", false);
          } else {
            console.log("유저 정보 없음!!!!");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
};

export default memberStore;
