<template>
    <div class="container-fluid" style="height: 100%; font-family: 'Ubuntu', sans-serif;">
        <div class="row" style="height: 100%; margin-top: 10px; margin-bottom: 10px; width: 100%">
            <div id="map" class="col-7" style="margin-left: 10px; margin-bottom: 10px">
            </div>
            <div class="col" style="margin-left: 15px">
                <div class="container-fluid">
                    <div class="row" style="width: 100%">
                        <div>
                            <h5 id="title_background">Route</h5>
                            <div id="title_form">
                                <input type="text" v-model="title"
                                       v-if="mode === 'regist' || mode ==='edit'"/>
                                <h2 v-if="mode === 'view'">{{ title }}</h2>
                                <textarea v-model="memo"
                                          v-if="mode === 'regist' || mode === 'edit'"/>
                                <div v-if="mode === 'view'">{{ memo }}</div>
                                <b-table striped hover :items="routes" :fields="selectedFields"></b-table>
                                <b-button @click="regist" v-if="mode === 'regist'">등록</b-button>
                                <b-button variant="danger"
                                          v-if="mode !== 'regist' && (admin === true || userNo === loggedUserNo)"
                                          @click="removeRoute">삭제
                                </b-button>
                                <b-button variant="warning"
                                          v-if="mode !== 'regist' && (admin === true || userNo === loggedUserNo)"
                                          @click="copyRoute">복사
                                </b-button>
                                <b-button variant="primary"
                                          v-if="mode !== 'regist' && (admin === true || userNo === loggedUserNo)"
                                          @click="modifyRoute">수정
                                </b-button>
                            </div>
                        </div>
                        <div v-if="mode === 'view' || mode === 'edit'">
                            <h5 id="title_background">Review</h5>
                            <div id="title_form">
                                <div v-if="reviewable">
                                    <input type="text" placeholder="한 마디를 남겨 주세요!" v-model="reviewContent"/>
                                    <div>
                                        <span>별점 : </span>
                                        <input type="number" min="1" max="10" v-model="star" size="2" step="1"/>
                                        <span> / 10</span>
                                        <b-button style="margin-left: 5px; margin-top: 5px; margin-bottom: 5px"
                                                  @click="addReview">등록
                                        </b-button>
                                    </div>
                                </div>
                                <b-table striped hover :items="reviewList" :fields="reviewFields">
                                    <template #cell(etc)="row">
                                        <img src="@/assets/x.png" @click="removeReview(row.item.reviewId)"
                                             width="15"
                                             height="15" v-if="reviewRemovable[row.index]"/>
                                    </template>
                                </b-table>
                                <b-pagination align="center" :per-page="reviewNumOfRows"
                                              :current-page="reviewPageNum"
                                              :totalRows="reviewPages * reviewNumOfRows"
                                              @change="mvPage"></b-pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {apiInstance} from "@/api";

var overlay;
let api = apiInstance();

export default {
    data() {
        return {
            routes: [],
            mode: null,
            map: null,
            bounds: null,
            acc: 0,
            selectedFields: [
                {key: "sequence", label: "#", tdClass: "col-2"},
                {key: "title", label: "관광지", tdClass: "col-10"},
            ],
            title: "",
            memo: "",
            userNo: "",
            nickname: "",
            star: null,
            loggedUserNo: null,
            admin: false,
            routeId: '',
            reviewPageNum: 1,
            reviewNumOfRows: 5,
            reviewList: [],
            reviewFields: [
                {key: "review", label: "리뷰"},
                {key: "star", label: "별점"},
                {key: "etc", label: ""}
            ],
            reviewable: false,
            reviewPages: 1,

            reviewContent: "",
            bookmarked: false,
        }
    },
    created() {
        if (!Object.prototype.hasOwnProperty.call(this.$route.params, "mode")) {
            alert("유효하지 않은 접근입니다.")
            this.$router.push("/");
        }

        let user = sessionStorage.getItem("vuex");
        if (user != null) {
            let parsedData = JSON.parse(user)['memberStore']['userInfo'];
            console.log(parsedData)
            if (Object.prototype.hasOwnProperty.call(parsedData, "admin") && parsedData['admin'] === true) {
                this.admin = true
            }
            this.loggedUserNo = parsedData['userNo'];
        } else {
            this.loggedUserNo = null;
        }

        this.mode = this.$route.params.mode;

        if (this.mode === "regist") {
            this.routes = JSON.parse(this.$route.params.routes)
            for (let elem of this.routes) {
                console.log("created elem", elem);
                // delete elem['adj'];
                delete elem['electric']
            }
        } else if (this.mode === "view") {
            this.routes = [];
            console.log("route id ", this.routeId)
            this.routeId = this.$route.params.routeId;
            this.checkBookmark()
        } else if (this.mode === 'edit') {
            this.routes = JSON.parse(this.$route.params.routes);
            this.routeId = this.$route.params.routeId
            this.title = this.$route.params.title
            this.memo = this.$route.params.memo
            this.checkBookmark()
        }
        console.log("route view created, and parsed params are ", this.routes)
        console.log("mode", this.mode)
    },
    computed: {
        reviewRemovable() {
            if (this.admin === true) {
                return Array(this.reviewList.length).fill(true);
            }

            let rst = [];

            for (let elem of this.reviewList) {
                if (elem.userNo === this.loggedUserNo) {
                    rst.push(true)
                } else rst.push(false)
            }

            return rst;
        }
    },
    mounted() {
        console.log("mounted")
        if (!Object.prototype.hasOwnProperty.call(window, "kakao") || !Object.prototype.hasOwnProperty.call(window.kakao, "maps")) {
            const script = document.createElement("script");
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.VUE_APP_KAKAOMAP_KEY}`;

            /* global kakao */
            script.addEventListener("load", () => {
                kakao.maps.load(this.initMap)
            })

            document.head.append(script);
        } else {
            console.log("kakao map already loaded.")
            this.initMap();
        }
    },
    updated() {
        if (this.map != null)
            this.relayout();
    },
    methods: {
        async initRoutes() {
            console.log("init route")
            let res = await api.get(`/api/route/${this.routeId}`)

            if (res.status !== 200) {
                alert("에러 발생")
                return;
            }

            let data = res.data.data;
            let tmp = [];
            // console.log(data);
            for (let key in data) {
                tmp.push(
                    {
                        sequence: key,
                        contentId: data[key].attractionId,
                        detailId: data[key].detailId
                    }
                )
            }

            this.routes = tmp;

            console.log(res);

            res = res.data;

            this.title = res.title;
            this.memo = res.memo;
            this.userNo = res.userNo;
            this.nickname = res.nickname;
            this.star = res.star;


            this.checkReviewable();
            this.getReview();
            // await this.initMap();
        },
        async fetchAttractionData() {
            let id = [];

            console.log(this.routes)

            for (let elem of this.routes) {
                let res = await api.get(`/api/attraction/${elem.contentId}`);
                console.log(res)
                let data = res.data;

                id.push(elem.contentId)
                this.$set(elem, 'firstImage', data.firstImage)
                this.$set(elem, 'addr1', data.addr1)
                this.$set(elem, 'latitude', data.latitude)
                this.$set(elem, 'longitude', data.longitude)
                this.$set(elem, 'title', data.title)

                // console.log(elem);
            }
            console.log(id);
            let config = {
                "attractionId": id,
                "meters": process.env.VUE_APP_ELECTRIC_METERS
            };
            //tmp
            console.log(this.routes)
            let res = await api.post("/api/electric", config);
            this.routes[0].electric = res.data;
        },
        async initMap() {
            console.log("init map")

            if (this.mode === 'view') {
                await this.initRoutes();
            }

            this.acc = 0;
            this.bounds = new kakao.maps.LatLngBounds();
            await this.fetchAttractionData();
            const container = document.getElementById("map");
            const options = {
                center: new kakao.maps.LatLng(37.5012733, 127.0396154),
                level: 5
            };
            this.map = new kakao.maps.Map(container, options);

            console.log(this.map);

            let mapTypeControl = new kakao.maps.MapTypeControl();
            this.map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT)
            let zoomControl = new kakao.maps.ZoomControl();
            this.map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

            kakao.maps.event.addListener(this.map, 'dragend', () => {
                if (overlay != null) {
                    closeOverlay();
                }
            })

            let path = [];

            for (let elem of this.routes) {
                console.log(elem);
                this.makeAttractionMarker(elem.contentId, elem.latitude, elem.longitude, elem.title, elem.firstImage, elem.addr1)

                if (Object.prototype.hasOwnProperty.call(elem, "electric")) {
                    for (let elec of elem.electric) {
                        this.addElectricMarker(elec)
                    }
                }

                path.push(new kakao.maps.LatLng(elem.latitude, elem.longitude))
            }

            if (path.length > 1) {
                this.routeLine = new kakao.maps.Polyline({
                    path: path,
                    strokeWeight: 5,
                    strokeColor: '#FFAE00',
                    strokeOpacity: 0.7,
                    strokeStyle: 'longdash',
                });

                this.routeLine.setMap(this.map);
            }

            this.relayout();
            if (this.acc !== 0)
                this.map.setBounds(this.bounds);
        },
        makeAttractionMarker(content_id, lat, lng, title, img, addr) {
            console.log("addming marker")
            let pos = new kakao.maps.LatLng(lat, lng)
            let overlayContent = this.createOverlayContent(title, img, addr)
            let marker = new kakao.maps.Marker({
                position: pos
            });
            this.bounds.extend(pos);
            ++this.acc;

            marker.setMap(this.map);
            kakao.maps.event.addListener(marker, 'click', () => {
                if (overlay == null) {
                    overlay = new kakao.maps.CustomOverlay({
                        content: overlayContent,
                        map: this.map,
                        position: marker.getPosition(),
                    })

                    // console.log(overlay);
                    overlay.setMap(this.map);
                } else {
                    closeOverlay();
                }
            })
        },
        getElectricMarkerOption() {
            if (this.elecMarkerOption == null) {
                let imgSrc = require("@/assets/bulb.png");
                let imgSize = new kakao.maps.Size(30, 40)
                let imgOption = {offset: new kakao.maps.Point(15, 40)};

                this.elecMarkerOption = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption)
            }

            return this.elecMarkerOption;
        },
        addElectricMarker(station) {
            let pos = new kakao.maps.LatLng(station.lat, station.lng);
            this.bounds.extend(pos)
            ++this.acc;
            let curMarker = new kakao.maps.Marker({
                position: pos,
                image: this.getElectricMarkerOption()
            })

            curMarker.setMap(this.map);

            kakao.maps.event.addListener(curMarker, "click", () => {
                if (overlay != null) {
                    overlay.setMap(null);
                }
                overlay = new kakao.maps.CustomOverlay({
                    content: this.createElectricOverlayContent(station),
                    map: this.map,
                    position: pos,
                })
            })
        },
        relayout() {
            if (this.map != null)
                this.map.relayout();
        },
        createOverlayContent(title, img, addr) {
            let overlayTitle, overlayAddr;
            // console.log(title, img, addr);
            overlayTitle = title.length > 15 ? title.substring(0, 15) + "..." : title;
            if (addr.length > 20) {
                let l = "", r = "";
                if (addr.lastIndexOf(" ") === -1) {
                    l = addr.substring(0, 20);
                    r = addr.substring(20);
                } else {
                    l = addr.substring(0, addr.lastIndexOf(" "));
                    r = addr.substring(addr.lastIndexOf(" "));
                }
                overlayAddr = l + "\n" + r;
            } else {
                overlayAddr = addr
            }
            // console.log(overlayTitle, overlayAddr)

            let content = document.createElement("div");
            content.className = 'wrap';
            let info = document.createElement('div');
            info.className = 'info';
            content.appendChild(info);

            let titleDiv = document.createElement('div');
            titleDiv.className = 'title';
            titleDiv.innerText = overlayTitle;

            info.appendChild(titleDiv)

            let closeDiv = document.createElement("div")
            closeDiv.className = 'close';
            closeDiv.title = "닫기"
            closeDiv.onclick = closeOverlay;
            titleDiv.appendChild(closeDiv)

            let bodyDiv = document.createElement("div");
            bodyDiv.className = 'body';

            info.appendChild(bodyDiv)

            let imgDiv = document.createElement("div");
            imgDiv.className = 'img';

            bodyDiv.appendChild(imgDiv)

            let imgTag = document.createElement("img");
            imgTag.src = img;
            imgTag.width = 73;
            imgTag.height = 70;
            imgDiv.appendChild(imgTag);
            let descDiv = document.createElement("div")
            descDiv.className = 'desc';
            bodyDiv.appendChild(descDiv);
            let ellipsis = document.createElement("div")
            ellipsis.innerText = overlayAddr;
            descDiv.appendChild(ellipsis)

            let postDiv = document.createElement('div');
            postDiv.style = 'overflow-y: scroll; height : 55px;'
            descDiv.appendChild(postDiv);

            this.kakaoBlogSearch(title, postDiv);

            return content;
        },
        createElectricOverlayContent(station) {
            let content = document.createElement("div");
            content.className = 'wrap';
            let info = document.createElement('div');
            info.className = 'info';
            content.appendChild(info);

            let titleDiv = document.createElement('div');
            titleDiv.className = 'title';
            titleDiv.innerText = station.statNm;

            info.appendChild(titleDiv)

            let closeDiv = document.createElement("div")
            closeDiv.className = 'close';
            closeDiv.title = "닫기"
            closeDiv.onclick = closeOverlay;
            titleDiv.appendChild(closeDiv)

            let bodyDiv = document.createElement("div");
            bodyDiv.className = 'body';

            info.appendChild(bodyDiv)

            let descDiv = document.createElement("div")
            descDiv.className = 'desc';
            bodyDiv.appendChild(descDiv);

            let addrDiv = document.createElement("div");
            addrDiv.innerHTML = station.addr;

            if (station.location != null && station.location !== "" && station.location !== "null") {
                addrDiv.innerHTML += `<br/>${station.location}`
            }

            descDiv.appendChild(addrDiv);

            let acc = {};
            for (let elem of station.chargers) {
                if (Object.prototype.hasOwnProperty.call(acc, elem.chgerType)) {
                    ++acc[elem.chgerType];
                } else {
                    acc[elem.chgerType] = 1;
                }
            }

            let chargerDiv = document.createElement("ul");
            for (let key in acc) {
                console.log(key);
            }
            console.log(chargerDiv);

            return content;
        },
        async kakaoBlogSearch(keyword, postDiv) {
            let res = await api.get(
                `/api/search?keyword=${keyword}`
            )

            let posts = res.data.documents;

            for (let elem of posts) {
                let blog = document.createElement('a');
                blog.href = elem.url
                blog.target = '_blank'
                let title = document.createElement('span')
                title.innerHTML = elem.title;
                blog.appendChild(title)
                postDiv.appendChild(blog)
                postDiv.appendChild(document.createElement('br'))
            }
        },
        async regist() {
            if (this.mode !== "regist") {
                alert("비정상적인 접근")
                return;
            }

            if (this.title === "") {
                alert("제목을 넣어 주세요.")
                return;
            }

            if (this.memo === "") {
                alert("노트를 적어 주세요.");
                return;
            }

            let data = {};
            for (let elem of this.routes) {
                data[elem.sequence] = {
                    attractionId: elem.contentId,
                    routeSequence: elem.sequence,
                }
            }

            let res = await api.post(
                '/api/route',
                {
                    data: data,
                    title: this.title,
                    memo: this.memo
                },
                {
                    headers: {
                        jwt: sessionStorage.getItem("access-token")
                    }
                }
            )

            // console.log(res)

            if (res.status === 200) {
                alert("등록 되었습니다.")
                this.$router.push({name: "share"})
            } else {
                alert("등록에 실패하였습니다.");
            }
        },
        async getReview() {
            let res = await api.get(`/api/route/review/route/paging?routeId=${this.routeId}&numOfRows=${this.reviewNumOfRows}&pageNum=${this.reviewPageNum}`)
            console.log(res);
            if (res.status !== 200) {
                alert("리뷰를 가져오지 못 했습니다.")
                return;
            }

            this.reviewPages = res.data.pages;
            this.reviewList = res.data.data;
        },

        async checkReviewable() {
            if (this.loggedUserNo == null) {
                this.reviewable = false;
                return;
            }
            let res = await api.get(`/api/route/review/check?routeId=${this.routeId}&userNo=${this.loggedUserNo}`)

            if (res.status === 200) {
                console.log(res.data)
                if (res.data === false) {
                    this.reviewable = true;
                }
            }
        },
        mvPage(page) {
            this.reviewPageNum = page;
            this.getReview();
        },
        async removeReview(reviewId) {
            let res = await api.delete(
                `/api/route/review?reviewId=${reviewId}`,
                {
                    headers: {
                        jwt: sessionStorage.getItem('access-token')
                    }
                }
            )

            if (res.status !== 200) {
                alert("삭제 실패");
                return;
            }

            this.reviewable = true;
            this.getReview();
        },
        async addReview() {
            if (this.reviewContent === '') {
                alert("한 마디를 넣어주세요!")
                return;
            }

            let res = await api.post(
                '/api/route/review',
                {
                    review: this.reviewContent,
                    routeId: this.routeId,
                    star: Math.floor(this.star)
                },
                {
                    headers: {
                        jwt: sessionStorage.getItem('access-token')
                    }
                }
            )

            if (res.status !== 200) {
                alert("등록 실패")
                return;
            }

            this.reviewable = false;
            this.getReview();
        },
        async removeRoute() {
            let res = await api.delete(
                `/api/route?routeId=${this.routeId}`,
                {
                    headers: {
                        jwt: sessionStorage.getItem('access-token')
                    }
                }
            )

            if (res.status !== 200) {
                alert("삭제 실패");
                return;
            }

            this.$router.push({name: "share"})
        },
        async copyRoute() {
            this.mode = "regist"
            this.title = "";
            this.memo = "";
        },
        async modifyRoute() {
            console.log(this.routes)
            if (this.mode === 'view') {
                this.$router.push({
                    name: "KakaoMap", params: {
                        mode: "edit", routes: JSON.stringify(this.routes), routeId: this.routeId,
                        title: this.title, memo: this.memo
                    }
                })
            } else if (this.mode === 'edit') {
                let data = {};

                for (let elem of this.routes) {
                    data[elem.sequence] = {
                        detailId: elem.detailId,
                        routeSequence: elem.sequence,
                        attractionId: elem.contentId
                    }
                }

                console.log(data)
                let res = await api.put(
                    '/api/route',
                    {
                        id: this.routeId,
                        title: this.title,
                        memo: this.memo,
                        data: data
                    },
                    {
                        headers: {
                            jwt: sessionStorage.getItem('access-token')
                        }
                    }
                )

                if (res.status !== 200) {
                    alert("에러 발생")
                    return
                }

                this.mode = "view"
            }
        },
        async makeBookmark() {
            if (this.loggedUserNo === null || this.bookmarked)
                return;

            let res = await api.post(
                '/api/route/bookmark',
                {
                    id: this.routeId,
                },
                {
                    headers: {
                        jwt: sessionStorage.getItem("access-token")
                    }
                }
            )

            console.log(res);

            if (res.status !== 200) {
                alert("즐겨찾기 추가 실패!")
                return;
            }

            this.bookmarked = res.data === true;
        },
        async removeBookmark() {
            if (this.loggedUserNo === null || !this.bookmarked)
                return;

            let res = await api.delete(
                `/api/route/bookmark?routeId=${this.routeId}`,
                {
                    headers: {
                        jwt: sessionStorage.getItem("access-token")
                    }
                }
            )

            if (res.status !== 200) {
                alert("즐겨찾기 삭제 실패!")
                return;
            }

            console.log(res);
            this.bookmarked = res.data !== true;
        },
        async checkBookmark() {
            if (this.loggedUserNo === null)
                return;

            let res = await api.get(
                `/api/route/bookmark?routeId=${this.routeId}`,
                {
                    headers: {
                        jwt: sessionStorage.getItem("access-token")
                    }
                }
            )

            if (res.status !== 200) {
                alert("즐겨찾기 여부 확인 실패!")
                return;
            }

            console.log(res);
            this.bookmarked = res.data === true;
        }
    }
}

function closeOverlay() {
    if (overlay != null)
        overlay.setMap(null)
    overlay = null;
}

</script>

<style scoped>
#title_background {
    max-width: 40rem;
    background-image: linear-gradient(135deg, #3670f7 0%, #9368f8 100%);
    padding: 1rem;
    color: white;
    font-weight: bold;
    font-size: 1.5rem;
    border-radius: 25px;
    margin: 20px;
}

#title_form {
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
}
</style>