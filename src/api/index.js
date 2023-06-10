import axios from "axios";

// local vue api axios instance
// const BASE_URL = process.env.VUE_APP_BASE_URL;
const BASE_URL = "http://localhost";
function apiInstance() {
  const instance = axios.create({
    // baseURL: process.env + "http://localhost",
    baseURL: BASE_URL,
    // baseURL: "localhost/",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return instance;
}

// // house deal API axios instance
// function houseInstance() {
//   const instance = axios.create({
//     baseURL: process.env.VUE_APP_HOUSE_DEAL_URL,
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//   });
//   return instance;
// }

export { apiInstance };
