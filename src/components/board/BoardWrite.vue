<template>
  <div id="board-write">
    <h3 id="titles" class="mx-auto">Write Article</h3>
    <b-card class="mx-auto">
      <b-form @submit="onSubmit" @reset="onReset">
        <b-form-group
          id="title-group"
          label="Title:"
          label-for="title"
          description="Please enter the title."
        >
          <b-form-input
            id="title"
            type="text"
            required
            v-model="article.title"
            placeholder="Enter the title..."
          ></b-form-input>
        </b-form-group>

        <b-form-group id="content-group" label="Content:" label-for="content">
          <b-form-textarea
            id="content"
            v-model="article.content"
            placeholder="Enter the content..."
            rows="10"
            max-rows="15"
          ></b-form-textarea>
        </b-form-group>

        <b-button
          type="submit"
          style="
            background-image: linear-gradient(135deg, #3670f7 0%, #9368f8 100%);
            color: white;
          "
          class="m-1"
          >Submit</b-button
        >
        <b-button type="reset" variant="danger" class="m-1">Reset</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { writeArticle } from "@/api/board";

export default {
  name: "BoardWrite",
  data() {
    return {
      article: {
        title: "",
        content: "",
        boardtype: "",
      },
    };
  },
  methods: {
    onSubmit(event) {
      this.article.boardtype = this.$route.params.boardtype;
      event.preventDefault();
      let err = true;
      let msg = "";
      !this.article.title &&
        ((msg = "Please enter the title."),
        (err = false),
        this.$refs.title.focus());
      err &&
        !this.article.content &&
        ((msg = "Please enter the content."),
        (err = false),
        this.$refs.content.focus());
      if (err) {
        this.registArticle();
      } else {
        console.log(msg);
      }
    },
    onReset(evt) {
      evt.preventDefault();
      this.article.title = "";
      this.article.content = "";
    },
    registArticle() {
      console.log("1. Calling registArticle");
      console.log(this.article);
      writeArticle(
        this.article,
        (res) => {
          console.log(res);
          let str = this.$route.params.boardtype;
          let firstChar = str.charAt(0);
          let others = str.slice(1);
          let boardtype = firstChar.toUpperCase() + others;
          this.$router.push({
            name: "AppBoard" + boardtype,
            params: { boardtype: boardtype },
          });
        },
        (err) => {
          console.log("2. Failed to register article");
          console.log(err);
        }
      );
    },
  },
};
</script>

<style scoped>
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

#board-write {
  max-width: 40rem;
  margin: 2rem auto;
}
</style>
