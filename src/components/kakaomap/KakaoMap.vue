
<template>
    <div style="width: 100%; height: 100%; font-family: 'Ubuntu', sans-serif;">
        <b-col cols="9">
            <b-row>
                <b-col cols="5"></b-col>
                <b-col cols="5" id="titless" style="
                    ">Tourist attractions</b-col>
            </b-row>
        </b-col>
        <div class="container-fluid" style="width: 100%; height: 100%; display: flex; flex-direction: column">
            <div class="row" style="margin-top: 10px; margin-bottom: 20px; height: 5%;">
                <div class="col-3">
                    <select id="search-area" class="form-select" v-model="region" required>
                        <option value="" disabled selected style="display: none">select region</option>
                        <option value="1">서울</option>
                        <option value="2">인천</option>
                        <option value="3">대전</option>
                        <option value="4">대구</option>
                        <option value="5">광주</option>
                        <option value="6">부산</option>
                        <option value="7">울산</option>
                        <option value="8">세종특별자치시</option>
                        <option value="31">경기도</option>
                        <option value="32">강원도</option>
                        <option value="33">충청북도</option>
                        <option value="34">충청남도</option>
                        <option value="35">경상북도</option>
                        <option value="36">경상남도</option>
                        <option value="37">전라북도</option>
                        <option value="38">전라남도</option>
                        <option value="39">제주도</option>
                    </select>
                </div>
                <div class="col-3">
                    <select id="search-content-id" class="form-select" v-model="content_id" required>
                        <option value="" disabled selected style="display: none">type</option>
                        <option value="12">관광지</option>
                        <option value="14">문화시설</option>
                        <option value="15">축제공연행사</option>
                        <option value="25">여행코스</option>
                        <option value="28">레포츠</option>
                        <option value="32">숙박</option>
                        <option value="38">쇼핑</option>
                        <option value="39">음식점</option>
                    </select>
                </div>
                <div class="col-4">
                    <input id="search-keyword" class="form-control" type="search" placeholder="enter the keyword..."
                        aria-label="검색어" v-model="keyword" @keyup.enter="search" />
                </div>
                <div class="col-2">
                    <i class="fa-solid">
                    <button id="btn-search" class="btn btn-outline-primary" type="button" @click="search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        search</button>
                    </i>
                </div>
            </div>
            <div class="row" style="height: 50%">
                <div class="col-8" style="height: 100%">
                    <div id="map" style="width: 100%;height: 100%"></div>
                </div>
                <div class="col-4" style="height: 100%">
                    <h1 id="titless">Travel route</h1>
                    <table class="table b-table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tourist attractions</th>
                                <th></th>
                            </tr>
                        </thead>
                        <draggable v-model="selectedAttraction" tag="tbody" @end="resequence">
                            <tr v-for="(elem, idx) in selectedAttraction" class="container" :key="idx">
                                <td>{{ elem.sequence }}</td>
                                <td>{{ elem.title }}</td>
                                <td><b-button variant="danger" @click="removeSelected(idx)"
                                        style="--mdb-btn-padding-top: 0.150rem; --mdb-btn-padding-bottom: 0.150rem; --mdb-btn-padding-x: 0.5rem; --mdb-btn-font-size: 0.50rem; --mdb-btn-line-height: 1.5;">
                                        X
                                    </b-button></td>
                            </tr>

                        </draggable>
                    </table>


                <!-- <b-table striped hover id="selected_route_list" :items="selectedAttraction"
                                :fields="selectedFields" tbody-tr-class="container drag_item"
                                primary-key="contentId" draggable="true"
                       >
                           <template #cell(btn)="row">
                               <div class="row">
                                   <div class="col-4">
                                       <b-button @click="moveUp(row.index)"
                                                 style="&#45;&#45;mdb-btn-padding-top: 0.150rem; &#45;&#45;mdb-btn-padding-bottom: 0.150rem; &#45;&#45;mdb-btn-padding-x: 0.5rem; &#45;&#45;mdb-btn-font-size: 0.50rem; &#45;&#45;mdb-btn-line-height: 1.5;">
                                           ↑
                                       </b-button>
                                   </div>
                                   <div class="col-4">
                                       <b-button @click="moveDown(row.index)"
                                                 style="&#45;&#45;mdb-btn-padding-top: 0.150rem; &#45;&#45;mdb-btn-padding-bottom: 0.150rem; &#45;&#45;mdb-btn-padding-x: 0.5rem; &#45;&#45;mdb-btn-font-size: 0.50rem; &#45;&#45;mdb-btn-line-height: 1.5;">
                                           ↓
                                       </b-button>
                                   </div>
                                   <div class="col-4">
                                       <b-button variant="danger" @click="removeSelected(row.index)"
                                                 style="&#45;&#45;mdb-btn-padding-top: 0.150rem; &#45;&#45;mdb-btn-padding-bottom: 0.150rem; &#45;&#45;mdb-btn-padding-x: 0.5rem; &#45;&#45;mdb-btn-font-size: 0.50rem; &#45;&#45;mdb-btn-line-height: 1.5;">
                                           X
                                       </b-button>
                                   </div>
                               </div>
                           </template>
                           </b-table> -->


                    <b-button v-if="mode === 'regist' && selectedAttraction.length != 0" @click="moveToRouteView"  variant="outline-primary">등록
                    </b-button>
                    <b-button variant="outline-warning" v-if="mode === 'edit' && selectedAttraction.length != 0"
                        @click="modifyRoute">수정
                    </b-button>
                </div>
            </div>
            <!-- <b-col cols="9" v-if="searchRst != null && searchRst.length !== 0">
                <b-row>
                    <b-col cols="5"></b-col>
                    <b-col cols="5" id="titless" style="
                    ">Tourist attractions</b-col>
                </b-row>
            </b-col> -->
            <b-pagination :per-page="numOfRows" :current-page="pageNum" :totalRows="pages * numOfRows" align="center"
                @change="mvPage" v-if="searchRst != null && searchRst.length !== 0"
                style="height: 5%; margin-top: 5px"></b-pagination>
            <div style="flex-grow: 1; overflow-y: scroll; height: 450px">
                <b-table striped hover id="resultTable" :items="getList" :fields="fields"
                    v-if="searchRst != null && searchRst.length !== 0">
                    <template #cell(img)="row">
                        <img :src="row.item.firstImage" alt="img" width="50" height="50" />
                    </template>
                    <template #cell(addBtn)="row">
                        <b-button @click="addBtnClick(row.item.contentId)" v-if="getFlag[row.index]" variant="outline-primary">add</b-button>
                    </template>
                </b-table>
            </div>

        </div>
    </div>
</template>


<script>
import { apiInstance } from "@/api";
import draggable from "vuedraggable";

const api = apiInstance();
export var overlay;
let closeBtn;

export default {
    name: "KakaoMap",
    components: {
        draggable,
    },
    data() {
        return {
            map: null,
            keyword: '',
            region: '',
            content_id: '',
            searchRst: null,
            numOfRows: 10,
            pageNum: 1,
            pages: 0,

            serachParam: null,

            fields: [
                { key: "img", label: "Picture" },
                { key: "title", label: "Tourist attractions" },
                { key: "addr1", label: "Address" },
                { key: "addBtn", label: "" }
            ],

            attractionMarkers: {},
            overlay: null,

            selectedAttraction: [],
            selectedFields: [
                { key: "sequence", label: "#", tdClass: "col-1" },
                { key: "title", label: "관광지", tdClass: "col-8" },
                { key: "btn", label: '', tdClass: "col-3" },
            ],

            adjacentAttraction: [],
            adjcanetId: {},
            adjacentAttractionMarker: {},

            elecMarkerOption: null,
            electricMarkers: {},
            routeLine: null,
            mode: "regist",
            logged : false,
            alerted : false,
        };
    },
    computed: {
        getFlag() {
            let flags = [];

            outer:
            for (let idx in this.searchRst) {
                for (let idx2 in this.selectedAttraction) {
                    if (this.searchRst[idx].contentId === this.selectedAttraction[idx2].contentId) {
                        flags.push(false);
                        continue outer;
                    }
                }
                flags.push(true);
            }

            outer2:
            for (let idx in this.adjacentAttraction) {
                for (let idx2 in this.selectedAttraction) {
                    if (this.adjacentAttraction[idx].contentId === this.selectedAttraction[idx2].contentId) {
                        flags.push(false)
                        continue outer2;
                    }
                }
                flags.push(true);
            }

            // outer:
            // for(let elem of this.searchRst){
            //     for(let selected of this.selectedAttraction){
            //         if(selected.content_id === elem.content_id){
            //             console.log(selected, elem);
            //             flags.push(false);
            //             continue outer;
            //         }
            //     }
            //     flags.push(true);
            // }

            return flags;
        },
        getList() {
            return this.searchRst.concat(this.adjacentAttraction);
        }
    },
    created() {
        if (Object.prototype.hasOwnProperty.call(this.$route.params, "mode") && this.$route.params['mode'] == 'edit') {
            let param = this.$route.params['routes']
            console.log(param)
            console.log(JSON.parse(param))

            this.mode = "edit"
            this.selectedAttraction = JSON.parse(param)
        }


        let user = sessionStorage.getItem("access-token");
        if(user == null){
            this.logged = false
        }else{
            this.logged = true;
        }
        this.alerted = false;

        closeBtn = require("@/assets/overlay_close.png")
        // eslint-disable-next-line no-undef
        this.debounceDrawLine = _.debounce(this.drawLine, 500)
        console.log(closeBtn)
    },
    // watch : {
    //     selectedAttraction : function(){
    //         this.debounceDrawLine();
    //     }
    // },
    mounted() {
        if (!window.kakao || !window.kakao.maps) {
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
            this.map.relayout();

        this.debounceDrawLine();
    },
    methods: {
        async fetchElectricData() {
            for (let elem of this.selectedAttraction) {
                let config = {
                    "attractionId": [elem.contentId],
                    "meters": process.env.VUE_APP_ELECTRIC_METERS
                };
                let res = await api.post(`/api/electric`, config);
                elem.electric = res.data;
            }
        },
        async initMap() {
            const container = document.getElementById("map");
            const options = {
                center: new kakao.maps.LatLng(37.5012733, 127.0396154),
                level: 5
            };
            this.map = new kakao.maps.Map(container, options);
            let mapTypeControl = new kakao.maps.MapTypeControl();
            this.map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT)
            let zoomControl = new kakao.maps.ZoomControl();
            this.map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);


            kakao.maps.event.addListener(this.map, 'dragend', () => {
                if (overlay != null) {
                    closeOverlay();
                }
            })


            // document.getElementById('map').addEventListener('resize', this.relayout);

            if (Object.prototype.hasOwnProperty.call(this.$route.params, "mode") && this.$route.params['mode'] === 'edit') {
                console.log("edit")
                await this.fetchElectricData()
                for (let elem of this.selectedAttraction) {
                    elem.marker = this.makeAttractionMarker(elem.contentId, elem.latitude, elem.longitude, elem.title, elem.firstImage, elem.addr1)
                }
            } else {
                let ssafyLogo = require("@/assets/mob_ssafy_logo_blue.png")
                this.makeAttractionMarker(0, 37.5012733, 127.0396154, 'SSAFY World!', ssafyLogo, '강남구 테헤란로 212, 301호')
            }

            this.reboundMap();
            this.drawLine();
            this.map.relayout();
        },
        async search() {
            if (this.region === '') {
                alert("검색할 지역을 골라주세요.")
                return
            }
            if (this.content_id === '') {
                alert("관광지 유형을 골라주세요")
                return
            }
            if (this.keyword === '') {
                alert("검색할 키워드를 넣어주세요")
                return;
            }

            if(!this.logged && !this.alerted){
                this.alerted = true;
                alert("로그인 되어 있지 않아 경로를 저장할 수 없습니다!\n유의하세요!");
            }

            this.pageNum = 1;

            this.serachParam = {
                region: this.region,
                content_id: this.content_id,
                keyword: this.keyword,
            }

            this.getData();

            this.region = ''
            this.content_id = ''
            this.keyword = ''
        },
        mvPage(page) {
            this.pageNum = page;
            this.getData()
        },
        async getData() {
            let res = await api.get(
                `/api/attraction/list/paging?contentTypeId=${this.serachParam.content_id}&sidoCode=${this.serachParam.region}&keyword=${this.serachParam.keyword}&pageNum=${this.pageNum}&numOfRows=${this.numOfRows}`
            )

            if (res.status != 200) {
                alert("에러가 발생하였습니다.")
            } else {
                let data = res.data;
                console.log('data', data);

                if (data.data.length === 0) {
                    alert("검색한 결과가 존재하지 않습니다!");
                    return;
                }

                this.pages = data.pages;
                this.searchRst = data.data;
                console.log(this.searchRst);
                this.removePreviousSearchedMarkers();
                for (let elem of this.searchRst) {
                    if (elem.firstImage == null || elem.firstImage === '') {
                        elem.firstImage = require('@/assets/no-image.png')
                    }

                    console.log(elem)
                    this.makeAttractionMarker(elem.contentId, elem.latitude, elem.longitude, elem.title, elem.firstImage, elem.addr1)
                }

                this.reboundMap();
            }
        },
        addBtnClick(content_id) {
            let found = false
            for (let elem of this.searchRst) {
                if (elem.contentId === content_id) {
                    console.log(elem);

                    ++this.attractionMarkers[elem.contentId].ref;

                    this.selectedAttraction.push(
                        {
                            sequence: this.selectedAttraction.length + 1,
                            title: elem.title,
                            contentId: content_id,
                            electric: [],
                            adj: [],
                            marker: elem.marker
                        }
                    )
                    found = true;
                    break;
                }
            }

            if (found === false) {
                for (let elem of this.adjacentAttraction) {
                    if (elem.contentId === content_id) {
                        ++this.attractionMarkers[elem.contentId].ref;

                        this.selectedAttraction.push({
                            sequence: this.selectedAttraction.length + 1,
                            title: elem.title,
                            contentId: content_id,
                            electric: [],
                            adj: [],
                            marker: elem.marker
                        })

                        break;
                    }
                }
            }

            this.getNearElectricStation(content_id);
            this.getAdjAttraction(content_id)
        },
        makeAttractionMarker(content_id, lat, lng, title, img, addr) {
            if (Object.prototype.hasOwnProperty.call(this.attractionMarkers, content_id)) {
                this.attractionMarkers[content_id].ref++;
                return null;
            } else {
                let pos = new kakao.maps.LatLng(lat, lng)
                let overlayContent = this.createOverlayContent(title, img, addr)
                let marker = new kakao.maps.Marker({
                    position: pos
                });

                marker.setMap(this.map);
                kakao.maps.event.addListener(marker, 'click', () => {
                    if (overlay == null) {
                        overlay = new kakao.maps.CustomOverlay({
                            content: overlayContent,
                            map: this.map,
                            position: marker.getPosition(),
                        })

                        console.log(overlay);
                        overlay.setMap(this.map);
                    } else {
                        closeOverlay();
                    }
                })

                return this.attractionMarkers[content_id] = {
                    ref: 1,
                    marker: marker,
                    type: "Attraction"
                }
            }
        },
        relayout() {
            if (this.map != null)
                this.map.relayout();
        },
        reboundMap() {
            let bounds = new kakao.maps.LatLngBounds();
            let acc = 0;
            for (let key in this.attractionMarkers) {
                console.log("key", key);
                console.log("elem", this.attractionMarkers[key]);
                bounds.extend(this.attractionMarkers[key].marker.getPosition());
                ++acc;
            }
            if (acc != 0)
                this.map.setBounds(bounds);
        },
        removePreviousSearchedMarkers() {
            // for (let key in this.attractionMarkers) {
            //     console.log(this.attractionMarkers[key])
            //     if (this.attractionMarkers[key].ref === 1) {
            //         this.attractionMarkers[key].marker.setMap(null);
            //
            //         this.$delete(this.attractionMarkers, key);
            //         // delete this.markers[key];
            //     }
            // }
            for (let key in this.attractionMarkers) {
                console.log(this.attractionMarkers[key])
                if (Object.prototype.hasOwnProperty.call(this.attractionMarkers, key) && Object.prototype.hasOwnProperty.call(this.attractionMarkers[key], "ref") && this.attractionMarkers[key].ref === 1) {
                    this.attractionMarkers[key].marker.setMap(null);

                    this.$delete(this.attractionMarkers, key);
                    // delete this.markers[key];
                }
            }
        },
        moveUp(index) {
            if (index === 0) {
                alert("첫번째 요소를 올릴 수 없습니다.")
                return;
            }

            console.log("arr", this.selectedAttraction)
            console.log("index ", index, "elem", this.selectedAttraction[index]);

            let tmp = this.selectedAttraction[index].title;
            this.$set(this.selectedAttraction[index], "title", this.selectedAttraction[index - 1].title)
            this.$set(this.selectedAttraction[index - 1], "title", tmp);

            tmp = this.selectedAttraction[index].contentId;
            this.$set(this.selectedAttraction[index], "contentId", this.selectedAttraction[index - 1].contentId);
            this.$set(this.selectedAttraction[index - 1], "contentId", tmp);

            tmp = this.selectedAttraction[index].electric;
            this.$set(this.selectedAttraction[index], "electric", this.selectedAttraction[index - 1].electric);
            this.$set(this.selectedAttraction[index - 1], "electric", tmp)


            // this.selectedAttraction[index] = this.selectedAttraction[index - 1];
            // this.selectedAttraction[index - 1] = tmp;
            // console.log('not sequence', this.selectedAttraction[index])
            // console.log('sequence', this.selectedAttraction[index].sequence)

            // [this.selectedAttraction[index], this.selectedAttraction[index + 1]] = [this.selectedAttraction[index + 1], this.selectedAttraction[index]];

            // this.selectedAttraction[index].sequence = index + 1;
            // this.selectedAttraction[index - 1].sequence = index - 1;
            this.drawLine()
        },
        moveDown(index) {
            if (index === this.selectedAttraction.length - 1) {
                alert("마지막 요소를 내릴 수 없습니다.")
                return;
            }

            let tmp = this.selectedAttraction[index].title;
            this.$set(this.selectedAttraction[index], "title", this.selectedAttraction[index + 1].title)
            this.$set(this.selectedAttraction[index + 1], "title", tmp);

            tmp = this.selectedAttraction[index].contentId;
            this.$set(this.selectedAttraction[index], "contentId", this.selectedAttraction[index + 1].contentId);
            this.$set(this.selectedAttraction[index + 1], "contentId", tmp);

            tmp = this.selectedAttraction[index].electric;
            this.$set(this.selectedAttraction[index], "electric", this.selectedAttraction[index + 1].electric)
            this.$set(this.selectedAttraction[index + 1], "electric", tmp);
            this.drawLine()
        },
        removeRef(contentId) {
            if (Object.prototype.hasOwnProperty.call(this.attractionMarkers, contentId) &&
                Object.prototype.hasOwnProperty.call(this.attractionMarkers[contentId], "ref") && --this.attractionMarkers[contentId].ref === 0) {
                this.attractionMarkers[contentId].marker.setMap(null);
                this.$delete(this.attractionMarkers, contentId);
            }
        },
        removeSelected(index) {
            console.log(this.selectedAttraction[index]);

            let id = this.selectedAttraction[index].contentId;

            if (Object.prototype.hasOwnProperty.call(this.adjcanetId, id)) {
                if (this.adjcanetId[id] === 1) {
                    delete this.adjcanetId[id];

                    for (let elem of this.adjacentAttraction) {
                        if (elem.contentId === id) {
                            for (let statId of elem.electric) {
                                this.removeElectricMarker(statId);
                            }

                            break;
                        }
                    }
                } else {
                    --this.adjcanetId[id];
                }
                return;
            }

            for (let statId of this.selectedAttraction[index].electric) {
                this.removeElectricMarker(statId);
            }
            this.removeRef(this.selectedAttraction[index].contentId)

            if (Object.prototype.hasOwnProperty.call(this.selectedAttraction[index], "adj")) {
                for (let elem of this.selectedAttraction[index].adj) {
                    console.log(elem.contentId, this.adjcanetId[elem.contentId])
                    if (this.adjcanetId[elem.contentId] === 1) {
                        console.log("here")
                        delete this.adjcanetId[elem.contentId];

                        for (let idx = 0; idx < this.adjacentAttraction.length; ++idx) {
                            console.log("idx : ", idx)
                            console.log(this.adjacentAttraction[idx]);
                            this.attractionMarkers[elem.contentId].marker.setMap(null);
                            if (this.adjacentAttraction[idx].contentId === elem.contentId) {
                                this.adjacentAttraction.splice(idx, 1);
                                break;
                            }
                        }
                    } else {
                        --this.adjcanetId[elem.contentId];
                    }
                }
            }

            this.selectedAttraction.splice(index, 1);
            for (let idx in this.selectedAttraction) {
                console.log(idx);
                this.$set(this.selectedAttraction[idx], 'sequence', Number(idx) + 1)
            }
            this.relayout();
        },
        async getNearElectricStation(...attractionId) {
            let config = {
                "attractionId": null,
                "meters": process.env.VUE_APP_ELECTRIC_METERS
            };

            for (let elem of attractionId) {
                config.attractionId = [elem];

                let res = await api.post("/api/electric", config);
                console.log(res);

                let list = [];

                if (res.status === 200) {
                    let data = res.data;
                    for (let elem of data) {
                        this.addElectricMarker(elem);
                        list.push(elem.statId);
                    }
                }

                for (let attraction of this.selectedAttraction) {
                    console.log(attraction)
                    if (Number(attractionId) === Number(attraction.contentId)) {
                        attraction.electric = list;
                        console.log("matched", list);
                        break;
                    }
                }
            }
        },
        addElectricMarker(station) {
            if (Object.prototype.hasOwnProperty.call(this.electricMarkers, station.statId)) {
                ++this.electricMarkers[station.statId].ref;
                console.log(station.statId, "already exists")
            } else {
                console.log(station)
                let pos = new kakao.maps.LatLng(station.lat, station.lng);

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

                this.electricMarkers[station.statId] = {
                    ref: 1,
                    marker: curMarker,
                }
            }
        },
        removeElectricMarker(statId) {
            if (Object.prototype.hasOwnProperty.call(this.electricMarkers, statId) && Object.prototype.hasOwnProperty.call(this.electricMarkers[statId], "ref") && --this.electricMarkers[statId].ref === 0) {
                this.electricMarkers[statId].marker.setMap(null);
                this.$delete(this.electricMarkers, statId);
            }
        },
        getElectricMarkerOption() {
            if (this.elecMarkerOption == null) {
                let imgSrc = require("@/assets/elec-station-mint.png");
                let imgSize = new kakao.maps.Size(30, 40)
                let imgOption = { offset: new kakao.maps.Point(15, 40) };

                this.elecMarkerOption = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption)
            }

            return this.elecMarkerOption;
        },
        drawLine() {
            if (this.routeLine != null) {
                this.routeLine.setMap(null);
            }

            let path = [];

            for (let elem of this.selectedAttraction) {
                if (Object.prototype.hasOwnProperty.call(this.attractionMarkers, elem.contentId) && Object.prototype.hasOwnProperty.call(this.attractionMarkers[elem.contentId], "marker"))
                    path.push(this.attractionMarkers[elem.contentId].marker.getPosition());
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
        },
        moveToRouteView() {
            console.log(this.selectedAttraction)
            this.$router.push({
                name: "Route",
                params: { routes: JSON.stringify(this.selectedAttraction), mode: "regist" }
            });
        },
        modifyRoute() {
            console.log(this.selectedAttraction);

            let list = [];
            for (let elem of this.selectedAttraction) {
                delete elem['electric'];
                delete elem['marker']
                list.push(elem)
            }

            this.$router.push({
                name: "Route",
                params: {
                    routes: JSON.stringify(list), mode: "edit", routeId: this.$route.params.routeId,
                    title: this.$route.params.title, memo: this.$route.params.memo
                }
            })
        },
        createOverlayContent(title, img, addr) {
            let overlayTitle, overlayAddr;
            console.log(title, img, addr);
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
            console.log(overlayTitle, overlayAddr)

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
                `/api/search?keyword=${encodeURI(keyword)}`
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
        async getAdjAttraction(...contentId) {
            let config = {
                "attractionIdList": null,
                "distInMeters": process.env.VUE_APP_ELECTRIC_METERS
            };

            for (let elem of contentId) {
                config.attractionIdList = [elem];

                let res = await api.post("/api/attraction/adjacent", config);
                console.log(res);

                let list = [];

                if (res.status === 200) {
                    let data = res.data;
                    console.log("adj res", data)
                    for (let elem of data) {
                        if (Object.prototype.hasOwnProperty.call(this.adjcanetId, elem.contentId)) {
                            ++this.adjcanetId[elem.contentId];
                        } else {
                            this.adjcanetId[elem.contentId] = 1;

                            if (elem.firstImage == null || elem.firstImage === '') {
                                elem.firstImage = require('@/assets/no-image.png')
                            }

                            this.makeAttractionMarker(
                                elem.contentId,
                                elem.latitude,
                                elem.longitude,
                                elem.title,
                                elem.firstImage,
                                elem.addr1
                            )

                            let contain = false;

                            for (let search of this.searchRst) {
                                if (search.contentId === elem.contentId) {
                                    contain = true;
                                    break;
                                }
                            }
                            if (!contain)
                                this.adjacentAttraction.push(elem);
                        }
                        list.push(elem);
                    }
                }

                for (let attraction of this.selectedAttraction) {
                    console.log(attraction)
                    if (Number(elem) === Number(attraction.contentId)) {
                        attraction.adj = list;
                        console.log("adj", list);
                        break;
                    }
                }
            }
        },
        resequence() {
            for (let idx in this.selectedAttraction) {
                this.selectedAttraction[idx].sequence = Number(idx) + 1;
            }
        }
    }
};

function closeOverlay() {
    if (overlay != null)
        overlay.setMap(null)
    overlay = null;
}

</script>

 
<style>
.wrap {
    position: absolute;
    left: 0;
    bottom: 40px;
    width: 288px;
    height: 132px;
    margin-left: -144px;
    text-align: left;
    overflow: hidden;
    font-size: 12px;
    font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;
    line-height: 1.5;
}

.wrap * {
    padding: 0;
    margin: 0;
}

.wrap .info {
    width: 286px;
    height: 120px;
    border-radius: 5px;
    border-bottom: 2px solid #ccc;
    border-right: 1px solid #ccc;
    overflow: hidden;
    background: #fff;
}

.wrap .info:nth-child(1) {
    border: 0;
    box-shadow: 0px 1px 2px #888;
}

.info .title {
    padding: 5px 0 0 10px;
    height: 30px;
    background: #eee;
    border-bottom: 1px solid #ddd;
    font-size: 18px;
    font-weight: bold;
}

.info .close {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #888;
    width: 17px;
    height: 17px;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAj0lEQVR42pXPXQqAIBAEYA+R3aHuoAiK5/fB60Q5kSHi3yzE4rLzacJ7fzvngjFmE0RhHznkhbU2sFAJIP8OGKgG/v1VqAuUCyNoCrSgcrE3H/5zGdBaHxTQgtJ30UAuvCAD6DhTgFJKpptj9ZKIOQ18wbM6SwpIfcccfQnqAbmm0AyYQqvAEGKAHiRYoAU9EjnJDlHMsrAAAAAASUVORK5CYII=');
}

.info .close:hover {
    cursor: pointer;
}

.info .body {
    position: relative;
    overflow: hidden;
}

.info .desc {
    position: relative;
    margin: 13px 0 0 90px;
    height: 75px;
}

.desc .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.desc .jibun {
    font-size: 11px;
    color: #888;
    margin-top: -2px;
}

.info .img {
    position: absolute;
    top: 6px;
    left: 5px;
    width: 73px;
    height: 71px;
    border: 1px solid #ddd;
    color: #888;
    overflow: hidden;
}

.info:after {
    content: '';
    position: absolute;
    margin-left: -12px;
    left: 50%;
    bottom: 0;
    width: 22px;
    height: 12px;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAMCAYAAABm+U3GAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozOUQxRDdGQTcwMERFNDExQUU3NkYxMDcyODhEMzY2QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozOEU5RkE1MTIwNzMxMUU0QTY0RDkwRDk4MURGQUE0NCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozOEU5RkE1MDIwNzMxMUU0QTY0RDkwRDk4MURGQUE0NCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OEI2NzczRUUyQjIwNjgxMTgzRDFDNUM1MTM2RTYxMEYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzlEMUQ3RkE3MDBERTQxMUFFNzZGMTA3Mjg4RDM2NkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz60SVY1AAAAyElEQVR42qzOPw6CMBgF8DZaI2N10LgxueoBvJbHqBfQOzgQOrohZ4CVwRE3jAF9JR0IfwpSX/KSpl+/X0qEEE6WZdfPf1KkaXokhExQ4riuu02S5GaLBkFwgrdBZwpm6JpzfoiiKByLep53gbNDF+WPcWmLN1EVBVvghe/7TbQKj8C70Tr8A25G2+AheC/aBZtwje6NqAmu43Ec36WU5yqq37SGmoblA0oVvmSMrd4Izg/0ib1cz9v3yLBM0TlaoC8071v4CjAASgAUID0QHaUAAAAASUVORK5CYII=')
}

.info .link {
    color: #5085BB;
}
</style>
