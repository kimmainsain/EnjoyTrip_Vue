<template>
    <div id="registration-form">
        <h3 id="title" class="mx-auto" style="max-width: 40rem">Sign up</h3>
        <b-card class="mx-auto" style="max-width: 40rem">
            <b-form @submit="onSubmit" @reset="onReset">
                <b-form-group label="User ID" label-for="id">
                    <b-form-input
                            id="id"
                            v-model.lazy="user.id"
                            @change="checkId"
                            required
                            placeholder="Enter your user ID..."
                    ></b-form-input>
                </b-form-group>
                <b-form-group label="Password" label-for="pw">
                    <b-form-input
                            type="password"
                            id="pw"
                            v-model="user.pw"
                            required
                            placeholder="Enter your password..."
                    ></b-form-input>
                </b-form-group>
                <b-form-group label="Email" label-for="email">
                    <b-form-input
                            type="email"
                            id="email"
                            v-model="user.email"
                            required
                            placeholder="Enter your email..."
                    ></b-form-input>
                </b-form-group>
                <b-form-group label="Nickname" label-for="nickname">
                    <b-form-input
                            type="text"
                            id="nickname"
                            v-model="user.nickname"
                            @change="checkNickname"
                            required
                            placeholder="Enter your nickname..."
                    ></b-form-input>
                </b-form-group>
                <b-form-group label="Hint" label-for="hint">
                    <b-form-input
                            type="text"
                            id="hint"
                            v-model="user.hint"
                            required
                            placeholder="Enter your hint..."
                    ></b-form-input>
                </b-form-group>
                <b-button :disabled="!idChecked || !nicknameChecked" type="submit" style="
  background-image: linear-gradient(135deg, #3670f7 0%, #9368f8 100%); color: white;
        " class="m-1">Sign Up
                </b-button>
                <b-button type="reset" variant="danger" class="m-1">Reset</b-button>
            </b-form>
        </b-card>
    </div>
</template>

<script>
import {regist} from "@/api/member";
import {apiInstance} from '@/api/index'
let api = apiInstance();

export default {
    name: "RegistUser",
    data() {
        return {
            user: {
                id: null,
                pw: null,
                nickname: null,
                hint: null,
                email: null,
            },
            idChecked : false,
            nicknameChecked : false,
        };
    },
    computed: {},
    methods: {
        onSubmit(event) {
            event.preventDefault();
            let err = true;
            let msg = "";
            if (!this.user.id) {
                msg = "Please enter your ID";
                err = false;
                this.$refs.id.focus();
            }

            if (err && !this.user.pw) {
                msg = "Please enter your password";
                err = false;
                this.$refs.pw.focus();
            }

            if (!this.user.nickname) {
                msg = "Please enter your nickname";
                err = false;
                this.$refs.nickname.focus();
            }

            if (err && !this.user.hint) {
                msg = "Please enter your hint";
                err = false;
                this.$refs.hint.focus();
            }

            if (!this.user.email) {
                msg = "Please enter your email";
                err = false;
                this.$refs.email.focus();
            }

            if (err) {
                this.reg();
            } else {
                console.log(msg);
            }
        },
        onReset(evt) {
            evt.preventDefault();
            this.user.id = "";
            this.user.pw = "";
            this.user.hint = "";
            this.user.nickname = "";
            this.user.email = "";
        },
        reg() {
            console.log(this.user);
            regist(this.user, () => {
                this.msg = "회원가입이 완료되었습니다.";
                alert(this.msg);
                this.$router.push({name: "LoginUser"});
            });
        },
        async checkId() {
            this.idChecked = false;

            if(this.user.id === '')
                return;

            let res = await api.get(`/api/user/${this.user.id}/available`)

            console.log(res);

            if(res.status !== 200){
                alert("에러가 발생하였습니다.")
                return;
            }

            if(res.data ===  true){
                this.idChecked = true;
            }else{
                alert("아이디가 중복되었습니다.")
                this.user.id = "";
            }

        },
        async checkNickname(){
            this.nicknameChecked = false;

            if(this.user.nickname === '')
                return;

            let res = await  api.get(`/api/user/nickname?nickname=${this.user.nickname}`)

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
        }
    },
};
</script>

<style scoped>
#submit {
    background-image: linear-gradient(135deg, #3670f7 0%, #9368f8 100%);
    color: #f0f0f0;
    font-weight: 500;
}

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
</style>
