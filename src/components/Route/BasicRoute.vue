<template>
    <div>
        <b-card @click="mvPage">
            <b-carousel :interval="4000" controls indicators background="#ababab" img-width="200" img-height="300"
                        style="text-shadow: 1px 1px 2px #333">
                <b-carousel-slide v-for="(img, idx) in imgPath" :key="idx" :img-src="img"></b-carousel-slide>
            </b-carousel>
            <b-card-title style="padding: 0px 0px 0px 0px">{{ title }}</b-card-title>
            <b-card-body style="padding: 5px 5px 5px 5px">{{ memo }}</b-card-body>
            <b-card-footer style="padding: 0px 0px 0px 0px; text-align: center">
                <div style="display: inline-block; float:left;" v-if="star != null">
                    <img v-if="star != null" :src="starPath" width="150px" height="50px" />
                </div>
                <div style="display: inline-block; float: right">{{ nickname }}</div>
            </b-card-footer>
        </b-card>
    </div>
</template>

<script>

let starImg = [];
starImg[0] = require(`@/assets/star/1.png`)
for(let i = 1; i <= 10; ++i){
    starImg.push(require(`@/assets/star/${i}.png`));
}

export default {
    props: ['route'],
    data() {
        return {
            title: null,
            imgPath: [],
            memo: null,
            id: null,
            nickname: null,
            star: null,
            starPath: "",
        }
    },
    created() {
        console.log('img', starImg)
        if(this.route.img != null)
            this.imgPath = JSON.parse(this.route.img)
        else this.imgPath = [require("@/assets/no-image.png")]
        console.log(this.imgPath)
        this.title = this.route.title
        this.memo = this.route.memo;
        this.nickname = this.route.nickname;
        this.star = this.route.star;
        this.id = this.route.id;
        if(this.star === null || this.star === '')
            this.starPath = starImg[0]
        else this.starPath = starImg[Math.floor(this.star)];
    },
    methods: {
        mvPage() {
            this.$router.push({
                name: "Route",
                params: {
                    mode: "view",
                    routeId: this.id
                }
            })
        }
    }
}
</script>

<style scoped>

</style>