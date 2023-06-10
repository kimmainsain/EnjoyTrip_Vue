<template>
    <div class="comment-list" style="font-family: 'Ubuntu', sans-serif;">
        <div v-for="(comment, index) in comments" :key="index" class="comment">
            <div class="comment-content">{{ comment.content }}</div>
            <div class="comment-info">
                <i class="fa-solid fa-user fa"></i>
                <div class="comment-nickname"> {{ comment.nickname }}</div>
                <div class="comment-time">{{ comment.time | dateFormat }}</div>
            </div>
            <button class="comment-delete" @click="deleteComment(comment.replyNo)">
                Delete
            </button>
        </div>
    </div>
</template>

<script>
import moment from "moment";

export default {
    name: "CommentList",
    props: ['loggedUser'],
    data() {
        return {
            boardtype: this.$route.params.boardtype,
            articleNo: this.$route.params.articleno,
            comments: [],
        };
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
            this.$axios
                .get(
                    `${this.$serverUrl}/api/board/${this.boardtype}/reply/${this.articleNo}`,
                    {}
                )
                .then(({data}) => {
                    this.comments = data;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        deleteComment(replyNo) {
            this.$axios
                .delete(
                    `${this.$serverUrl}/api/board/${this.boardtype}/${this.articleNo}/${replyNo}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            jwt: sessionStorage.getItem("access-token"),
                        },
                    }
                )
                .then(() => {
                    this.fnGetList();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>

<style scoped>
.comment-list {
    margin-top: 20px;
}

.comment {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}

.comment-content {
    font-weight: bold;
    margin-right: auto;
}

.comment-info {
    display: flex;
    align-items: center;
    margin-left: 10px;
}

.comment-nickname {
    display: inline;
    font-style: italic;
    margin-right: 10px;
}

.comment-time {
    color: #888;
    margin-right: 10px;
}

.comment-delete {
    background-color: #dc3545;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}
</style>
