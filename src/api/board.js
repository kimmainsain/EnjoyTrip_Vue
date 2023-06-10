import { apiInstance } from "./index.js";

const api = apiInstance();

function replyWrite(article, success, fail) {
  console.log("article : ", article);
  api.post(`/api/board/${article.boardtype}/reply/${article.articleNo}`, {
    content : article.content,
  }, {
    headers: {
      "Content-Type": "application/json",
      "jwt": sessionStorage.getItem("access-token"),
    },
  }).then(success).catch(fail);
}

function writeArticle(article, success, fail) {
  api.post(`/api/board/${article.boardtype}`, {
    title: article.title,
    content: article.content,
  }, {
    headers: {
      "Content-Type": "application/json",
      "jwt": sessionStorage.getItem("access-token"),
    },
  }).then(success).catch(fail);
}

function modifyArticle(article, success, fail) {
  api.put(`/api/board/${article.boardtype}`, {
    title: article.title,
    content: article.content,
    articleNo: article.articleNo,
  }, {
    headers: {
      "Content-Type": "application/json",
      "jwt": sessionStorage.getItem("access-token"),
    },
  }).then(success).catch(fail);}

function deleteArticle(article, success, fail) {
  console.log("1. jwt : ", sessionStorage.getItem("access-token"));
  console.log("2. article : ", article);
  api.delete(`/api/board/${article.boardtype}?articleNo=${article.articleNo}`, {
    headers: {
      "Content-Type": "application/json",
      "jwt": sessionStorage.getItem("access-token"),
    },
  }).then(success).catch(fail);
  // api.delete(`/board/${articleno}`).then(success).catch(fail);
}

export { writeArticle, modifyArticle, deleteArticle, replyWrite };
