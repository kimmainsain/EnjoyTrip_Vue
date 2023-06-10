<template>
  <b-container fluid>
    <b-form @submit="onSubmit">
      <b-row class="mt-4">
        <b-col sm="1"></b-col>
        <b-col sm="9">
          <b-form-textarea
          id="content"
          v-model="reply.content"
          placeholder="Comments"
          ></b-form-textarea>
        </b-col>
        <b-col sm="2">
          <b-button type="submit" pill class="m-1" id="btn">Submit</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import { replyWrite } from "@/api/board";

export default {
  name: "ReplyWrite",
  data() {
    return {
      reply: {
        content: "",
        boardtype: this.$route.params.boardtype,
        articleNo: this.$route.params.articleno,
      },
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      console.log("댓글 등록");
      console.log(this.reply);
      this.reg();
    },
    reg() {
      replyWrite(
        this.reply,
        () => {
          this.$router.go({
            name: "BoardDetail",
            params: {
              boardtype: this.$route.params.boardtype,
              articleno: this.$route.params.articleno,
            },
          });
        },
        (err) => {
          console.log(err);
        }
      );
    },
  },
};
</script>

<style>
  #btn {
    background-image: linear-gradient(135deg, #3670f7 0%, #9368f8 100%);
    color: white;
  }
  /* btn hover */
  #btn:hover {
    /* 1.1배 커짐 */
    transform: scale(1.1);
    /* 0.3초 동안 변화를 동작시킴 */
    transition: all 0.3s;
  }
</style>