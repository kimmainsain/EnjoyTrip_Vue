<template>
  <b-row>
    <b-col cols="9">
      <h3 id="titles" class="mx-auto">Delete</h3>
    </b-col>
  </b-row>
</template>

<script>
import { deleteArticle } from "@/api/board";

export default {
  name: "BoardDelete",
  data() {
    return {
      article: {
        boardtype: this.$route.params.boardtype,
        articleNo: this.$route.params.articleno,
      },
    };
  },
  created() {
    deleteArticle(
      this.article,
      ({ data }) => {
        console.log(data);
        let msg = "삭제가 완료되었습니다.";
        alert(msg);
        let str = this.$route.params.boardtype;
        let firstChar = str.charAt(0);
        let others = str.slice(1);
        let boardtype = firstChar.toUpperCase() + others;
        this.$router.push({ name: "AppBoard" + boardtype });
      },
      (error) => {
        console.log(error);
      }
    );
  },
};
</script>

<style>
#titles {
  max-width: 40rem;
  background-image: linear-gradient(135deg, #3670f7 0%, #9368f8 100%);
  padding: 1rem;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 25px;
  margin: 20px;
}
</style>
