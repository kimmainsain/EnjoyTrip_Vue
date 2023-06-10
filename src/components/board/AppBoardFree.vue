<template>
  <b-row style="font-family: 'Ubuntu', sans-serif;">
    <b-col cols="9">
      <div class="board-list">
        <h3 id="title">Community</h3>
        <b-row class="mb-1">
          <b-col class="text-right">
            <div style="float: left">
              <input type="text" v-model="inputKeyword" placeholder="keyword to search" style="
              margin-left: 15px; margin-right: 5px;"/>
              <b-button @click="search" variant="outline-primary"><i class="fa-solid fa-magnifying-glass fa-lg"> search</i></b-button>
            </div>
            <div>
              <b-button v-if="logged" variant="outline-primary" @click="WriteArticle">
                <i class="fa-solid fa-pen-nib fa-2xl" style=""> Post</i>
              </b-button>
            </div>
          </b-col>
        </b-row>
        <div v-if="articles != null">
          <table class="board-list">
            <b-table striped hover :items="articles" :fields="fields" @row-clicked="BoardDetail">
              <template #cell(time)="data">
                {{ data.value | dateFormat }}
              </template>
            </b-table>
          </table>
        </div>
        <div v-else>등록된 사용자가 없습니다.</div>

        <!-- page -->
        <div class="overflow-auto">
          <b-pagination
            :total-rows="pages * numOfRows"
            :per-page="numOfRows"
            :current-page="pageNum"
            @change="mvPage"
            align="center"
          ></b-pagination>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import moment from "moment";

export default {
  name: "AppBoardFree",
  data() {
    return {
      numOfRows: 10,
      pageNum: 1,
      pages: 0,
      articles: [],
      fields: [
        { key: "articleNo", label: "ArticleNo" },
        { key: "title", label: "Title" },
        { key: "time", label: "Time" },
        { key: "nickName", label: "NickName" },
      ],
        keyword : "",
        inputKeyword : "",
        logged : false,
    };
  },
    created(){
      let user = sessionStorage.getItem('vuex');
      if(user == null){
          this.logged = false;
      }else{
          this.logged = true;
      }
    },
  filters: {
    dateFormat(time) {
      return moment(new Date(time)).format("MMMM DD, YYYY");
    },
  },
  mounted() {
    this.fnGetList();
  },
  methods: {
    fnGetList() {
        let url = '';
        if(this.keyword === ''){
            url = `/api/board/free/paging?pageNum=${this.pageNum}&numOfRows=${this.numOfRows}`;
        }else{
            url = `/api/board/free/search/paging?pageNum=${this.pageNum}&numOfRows=${this.numOfRows}&keyword=${encodeURI(this.keyword)}`
        }

        this.$axios
            .get(
                this.$serverUrl + url
            )
            .then((res) => {
                if(this.keyword === '')
                  this.articles = res.data.data; //서버에서 데이터를 목록으로 보내므로 바로 할당하여 사용할 수 있다.
                else this.articles = res.data.data.reverse()

                this.pages = res.data.pages;
                console.log(this.articles);
            })
            .catch((err) => {
                if (err.message.indexOf("Network Error") > -1) {
                    alert("네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.");
                }
            });
    },
    mvPage(page) {
      this.pageNum = page;
      console.log("mvPage + this.page : ", this.pageNum);
      this.fnGetList();
    },
    WriteArticle() {
      this.$router.push({ name: "BoardWrite", params: { boardtype: "free" } });
    },
    BoardDetail(article) {
      console.log(article);
      this.$router.push({
        name: "BoardDetail",
        params: { articleno: article.articleNo, boardtype: "free" },
      });
    },
      search(){
          this.keyword = this.inputKeyword;
          this.pageNum = 1;
          this.fnGetList();
      }
  },
};
</script>

<style scoped>
#title {
  background-image: linear-gradient(135deg, #3670f7 0%, #9368f8 100%);
  padding: 1rem;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 25px;
  margin: 18px;
}
</style>
