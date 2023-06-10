<template>
    <div id="login-form">
        <h3 id="title" class="mx-auto" style="max-width: 40rem">Password Reset</h3>
        <b-card class="mx-auto" style="max-width: 40rem">
            <b-form>
                <b-form-group label="User ID" label-for="id">
                    <b-form-input
                            id="id"
                            v-model="id"
                            required
                            placeholder="Enter your user ID..."
                    ></b-form-input>
                </b-form-group>
                <b-form-group label="Hint" label-for="hint">
                    <b-form-input
                            type="text"
                            id="hint"
                            v-model="hint"
                            required
                            placeholder="Enter your hint"
                    ></b-form-input>
                </b-form-group>
                <b-button type="submit" @click="requestReset"
                          :disabled="id === '' || hint === ''"
                          style="
          background-image: linear-gradient(135deg, #3670f7 0%, #9368f8 100%);
          color: white;
          font-weight: 500;
        " class="m-1">Reset Password
                </b-button>
                <b-button type="reset" @click="reset" variant="danger" class="m-1">Reset</b-button>
            </b-form>
        </b-card>
    </div>
</template>

<script>
import {apiInstance} from "@/api";
let api = apiInstance();

export default {
    name: "ResetPassword",
    data() {
        return {
            id: "",
            hint: ""
        };
    },
    methods: {
        reset(){
          this.id = '';
          this.hint = ''
        },
        async requestReset(){
            let res = await api.post(
              `/api/user/reset`,
              {
                  id : this.id,
                  hint : this.hint
              }
            )
            console.log(res);

            if(res.status !== 200){
                alert("에러 발생")
                return;
            }

            console.log(res)
            if(res.data){
                alert("초기화 되었습니다. 가입시 사용한 이메일을 확인해주세요.")
                this.$router.push({name : "MainVue"})
            }else{
                alert("초기화에 실패하였습니다. 가입시 등록한 힌트를 다시 생각해보세요.")
                return;
            }
        }
    },
};
</script>

<style>
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
