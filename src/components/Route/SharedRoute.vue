<template>
    <div class="container-fluid" style="width: 100%; height: 100%">
        <div align="center">
            <b-pagination :per-page="numOfRows" :current-page="pageNum" :totalRows="pages * numOfRows" align="center" @change="mvPage" style="margin-top: 20px; width: fit-content">
            </b-pagination>
            <b-form-checkbox v-if="logged" @change="getData" v-model="bookmark">즐겨찾기</b-form-checkbox>
        </div>
        <div id="list" class="container">
            <div class="row">
                <basic-route v-for="route in routes" :route="route" :key="route.id" class="col-4"></basic-route>
            </div>
        </div>
    </div>
</template>

<script>
import {apiInstance} from "@/api";
import BasicRoute from "@/components/Route/BasicRoute.vue";
let api = apiInstance();

export default {
    components: {BasicRoute},
    data() {
        return {
            numOfRows : 9,
            pageNum : 1,
            pages : 1,
            routes : [],
            logged : false,
            bookmark : false,
            loggedUserNo : null,
        }
    },
    created() {
        this.getData();

        if(sessionStorage.getItem("access-token") != null){
            this.logged = true
            this.loggedUserNo = JSON.parse(sessionStorage.getItem('vuex'))['memberStore']['userInfo']['userNo'];
        }else{
            this.logged = false;
            this.loggedUserNo = null
        }
    },
    methods : {
        mvPage(page){
            this.pageNum = page;
            this.getData()
        },
        async getData(){
            let res = null;
            try{
                let path = this.bookmark ? `/api/route/bookmark/paging?pageNum=${this.pageNum}&numOfRows=${this.numOfRows}&userNo=${this.loggedUserNo}` : `/api/route/paging?pageNum=${this.pageNum}&numOfRows=${this.numOfRows}`;
                res = await api.get(path)
            }catch (e){
                console.log(e)
                return;
            }

            console.log(res);

            if(res.status !== 200){
                alert("에러가 발생하였습니다.");
                return;
            }

            let data = res.data.data;

            if(data == null || data.length === 0){
                this.routes = [];
                return;
            }

            let routes = []
            console.log(data);

            for(let elem of data){
                let route = elem;
                let img = [];
                console.log(elem.img)
                let parsed = JSON.parse(elem.img)
                console.log(parsed)

                if(parsed != null){
                    for(let i of parsed){
                        if(i != null && i !== ""){
                            img.push(i);
                        }
                    }
                }

                console.log(JSON.parse(elem.img))
                routes.push(route);
            }

            this.routes = routes;
            console.log(routes)
            this.pages = data.pages;
        }
    },
}
</script>

<style scoped>

</style>