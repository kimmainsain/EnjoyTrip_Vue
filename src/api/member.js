import { sha256 } from "js-sha256";
import { apiInstance } from "./index.js";

const api = apiInstance();

async function login(user, success, fail) {
  let hash = sha256(user.id + user.pw);
  user.pw = hash;
  await api.post(`/api/user/login`, JSON.stringify(user)).then(success).catch(fail);
}

async function regist(user, success, fail) {
  let hash = sha256(user.id + user.pw);
  user.pw = hash;
  console.log("regist user : ", user);
  await api.post(`/api/user`, JSON.stringify(user)).then(success).catch(fail);
}

export function letHash(id, pw){
  return sha256(id + pw);
}

async function findById(userid, success, fail) {
  api.defaults.headers["access-token"] = sessionStorage.getItem("access-token");
  await api.get(`/api/user/${userid}`).then(success).catch(fail);
}

async function logout(userid, success, fail) {
  await api.get(`/user/logout/${userid}`).then(success).catch(fail);
}

export { login, findById, logout, regist };
