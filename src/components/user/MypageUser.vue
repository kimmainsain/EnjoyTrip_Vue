<template>
    <div id="my-page">
        <h3 id="title" class="mx-auto">My Page</h3>
        <b-card class="mx-auto">
            <b-form>
                <b-form-group label="Nickname:" label-for="Nickname">
                    <b-form-input
                            id="Nickname"
                            type="text"
                            v-model="nickname"
                            @change="checkNickname"
                    ></b-form-input>
                    <!-- v-model="user.username" -->
                </b-form-group>

                <b-form-group label="Password:" label-for="Password">
                    <b-form-input
                            id="Password"
                            type="password"
                            v-model="password"
                    ></b-form-input>
                    <!-- v-model="user.username" -->
                </b-form-group>

                <b-form-group label="Email:" label-for="email">
                    <b-form-input
                            id="email"
                            type="email"
                            v-model="email"
                    ></b-form-input>
                    <!-- v-model="user.email" -->
                </b-form-group>

                <b-form-group label="hint:" label-for="hint">
                    <b-form-textarea
                            id="hint"
                            v-model="hint"
                    ></b-form-textarea>
                    <!-- v-model="user.bio" -->
                </b-form-group>
                <b-button @click="submit" :disabled="!nicknameChecked" type="submit" style="
  background-image: linear-gradient(135deg, #3670f7 0%, #9368f8 100%); color: white;
        " class="m-1">Modify
                </b-button>
            </b-form>
        </b-card>
    </div>
</template>
<script>
import {apiInstance} from "@/api";
import {letHash} from '@/api/member'
let api = apiInstance();

export default {
    name: "MyPage",
    data() {
        return {
            nickname : "",
            email : "",
            hint : "",
            userNo : "",
            password : "",
            savedNickname : "",
            nicknameChecked : true,
            id : '',
        };
    },
    created() {
        let user = sessionStorage.getItem("vuex");
        if(user == null){
            alert("비정상적인 접근입니다.")
            this.$router.push("/")
        }
        let parsedData = JSON.parse(user)['memberStore']['userInfo'];
        this.userNo = parsedData['userNo']
        this.nickname = parsedData['nickname']
        this.savedNickname = this.nickname;
        this.nicknameChecked = true;

        this.getData()
    },
    mounted() {

    },
    methods: {
        async getData(){
            let res = await api.get(
                '/api/user/basicInfo',
                {
                  headers : {
                      jwt : sessionStorage.getItem("access-token")
                  }
                }
            )

            if(res.status !== 200){
                alert("에러 발생!");
                return;
            }

            let data = res.data;
            this.email = data.email;
            this.hint = data.hint;
            this.id = data.id;

            console.log(res);
        },
        async checkNickname(){
            if(this.nickname === this.savedNickname){
                this.nicknameChecked = true;
                return;
            }

            this.nicknameChecked = false;

            if(this.nickname === '')
                return;

            let res = await  api.get(`/api/user/nickname?nickname=${this.nickname}`)

            console.log(res);

            if(res.status !== 200){
                alert("에러가 발생하였습니다.")
                return;
            }

            if(res.data === true){
                this.nicknameChecked = true;
            }else {
                alert("닉네임이 중복되었습니다.")
                this.user.nickname = "";
            }
        },
        async submit(){
            if(this.nickname === ''){
                alert("닉네임을 넣어 주세요.")
                return;
            }

            if(this.password === ''){
                alert("패스워드를 넣어 주세요.");
                return;
            }

            if(this.email === ''){
                alert("이메일을 넣어 주세요.")
                return;
            }

            if(this.hint === ''){
                alert('힌트를 넣어 주세요.')
            }

            let hashed = letHash(this.id, this.password);
            console.log(hashed)

            let res = await api.put(
                `/api/user`,
                {
                    id : this.id,
                    email : this.email,
                    pw : hashed,
                    nickname : this.nickname,
                    hint : this.hint
                },
                {
                    headers : {
                        jwt : sessionStorage.getItem("access-token")
                    }
                }
            )

            console.log(res);

            if(res.status !== 200){
                alert("에러 발생!")
                return;
            }

            alert("수정 되었습니다.")
            this.$router.push("/");
        }
    },
};
</script>

<style scoped>
#title {
    max-width: 40rem;
    background-image: linear-gradient(135deg, #3670f7 0%, #9368f8 100%);
    padding: 1rem;
    color: white;
    font-weight: bold;
    font-size: 1.5rem;
    border-radius: 25px;
    margin: 20px;
}

#my-page {
    max-width: 40rem;
    margin: 2rem auto;
}
</style>
