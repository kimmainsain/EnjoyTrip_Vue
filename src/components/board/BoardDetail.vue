<template>
    <b-row>
        <b-col cols="9">
            <div class="regist">
                <h3 id="title" style="font-family: 'Ubuntu', sans-serif;">Post Information</h3>
                <div class="regist_form">
                    <h1 style="font-family: 'Ubuntu', sans-serif;">{{ article.title }}</h1>
                    <div id="right">
                        <i class="fa-solid fa-user fa-lg"></i>
                        <h5 style="font-family: 'Ubuntu', sans-serif; display: inline; font-style: italic;">
                            {{ article.nickName }}</h5>
                    </div>
                    <div id="right" style="color: #888; ">
                        <i class="fa-regular fa-clock fa-sm"> {{ article.time | dateFormat }}</i>
                    </div>

                    <div id="left">
                        <!-- <i class="fa-solid fa-book-open fa-2xl"></i> -->
                        <br>
                        <div style="font-family: 'Ubuntu', sans-serif;"><h4>
                            {{ article.content }}</h4>
                        </div>
                    </div>

                    <div style="padding-top: 15px; font-family: 'Ubuntu', sans-serif;">
                        <b-button variant="outline-success" v-if="editable" pill @click="moveModifyArticle">Modify</b-button>
                        <b-button variant="outline-primary" pill @click="moveList">List</b-button>
                        <b-button variant="danger" v-if="editable" pill @click="deleteArticle">Delete</b-button>
                    </div>
                </div>
                <ReplyList ref ="replyList"
                        :articleno="article.articleNo"
                        :boardtype="boardtype"
                ></ReplyList>
                <ReplyWrite v-if="logged" @update="refresh"
                        :articleno="article.articleNo"
                        :boardtype="boardtype"
                ></ReplyWrite>
            </div>
        </b-col>
    </b-row>
</template>

<script>
import ReplyWrite from "../board/reply/ReplyWrite.vue";
import ReplyList from "../board/reply/ReplyList.vue";
import moment from "moment";

export default {
    name: "BoardDetail",
    components: {
        ReplyWrite,
        ReplyList,
    },
    filters: {
        dateFormat(time) {
            return moment(new Date(time)).format("MMMM DD, YYYY");
        },
    },
    data() {
        return {
            articleno: Number,
            article: Object,
            editable: false,
            logged : false,
        };
    },
    created() {
        this.articleno = this.$route.params.articleno;
        this.boardtype = this.$route.params.boardtype;
        this.GetView();
    },
    methods: {
        GetView() {
            this.$axios
                .get(this.$serverUrl + `/api/board/${this.boardtype}/` + this.articleno)
                .then((response) => {
                    this.article = response.data;
                        let user = sessionStorage.getItem("vuex");
                        if (user != null) {
                            let parsed = JSON.parse(user)['memberStore']['userInfo'];
                            if(parsed['userNo'] === this.article.authorNo || (Object.prototype.hasOwnProperty.call(parsed, "admin") && parsed.admin === true )){
                                this.editable = true;
                            }
                            this.logged = true;
                        }
                });
        },
        refresh(){
            console.log("refresh")
            this.$refs.replyList.fnGetList();
        },
        moveModifyArticle() {
            this.$router.push({
                name: "BoardModify",
                params: {articleno: this.article.articleNo, title : this.article.title, content : this.article.content},
            });
        },
        deleteArticle() {
            this.$router.push({
                name: "BoardDelete",
                params: {articleno: this.article.articleNo},
            });
        },
        moveList() {
            let str = this.$route.params.boardtype;
            let firstChar = str.charAt(0);
            let others = str.slice(1);
            let boardtype = firstChar.toUpperCase() + others;
            this.$router.push({
                name: "AppBoard" + boardtype,
                params: {boardtype: this.$route.params.boardtype},
            });
        },
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
    margin: 20px;
}

#right {
    text-align: right;
}

#left {
    text-align: left;
}

.regist {
    width: 768px;
    margin: 0 auto;
}

.regist_form {
    width: 768px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

</style>
