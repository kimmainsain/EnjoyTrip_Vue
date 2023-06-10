import Vue from 'vue'
import VueRouter from 'vue-router'

import AppBoardFree from '../components/board/AppBoardFree.vue'
import AppBoardNotice from '../components/board/AppBoardNotice.vue'

import BoardDelete from '../components/board/BoardDelete.vue'
import BoardDetail from '../components/board/BoardDetail.vue'
import BoardModify from '../components/board/BoardModify.vue'
import BoardWrite from '../components/board/BoardWrite.vue'

import LoginUser from '../components/user/LoginUser.vue'
import RegistUser from '../components/user/RegistUser.vue'
import MyPage from '../components/user/MypageUser.vue'

import KakaoMap from '../components/kakaomap/KakaoMap.vue'
import RouteView from "@/components/kakaomap/RouteView.vue";
import SharedRoute from "@/components/Route/SharedRoute.vue";

import MainVue from '../components/Main.vue';
import ResetPassword from "@/components/user/ResetPassword.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/board/free',
    name: 'AppBoardFree',
    component: AppBoardFree
  },
  {
    path: '/board/notice',
    name: 'AppBoardNotice',
    component: AppBoardNotice
  },
  {
    path: '/',
    name: 'MainVue',
    component: MainVue
  },
  {
    path: '/login',
    name: 'LoginUser',
    component: LoginUser
  },
  {
    path: '/regist',
    name: 'RegistUser',
    component: RegistUser
  },
  {
    path: '/board/:boardtype/write',
    name: 'BoardWrite',
    component: BoardWrite
  },
  {
    // path: '/board/detail/:articleno',
    path: '/board/:boardtype/detail/:articleno',
    name: 'BoardDetail',
    component: BoardDetail
  },
  {
    path: '/board/:boardtype/modify/:articleno',
    name: 'BoardModify',
    component: BoardModify
  },
  {
    path: '/board/:boardtype/delete/:articleno',
    name: 'BoardDelete',
    component: BoardDelete
  },
  {
    path: '/map',
    name: 'KakaoMap',
    component: KakaoMap
  },
  {
    path: '/route',
    name: "Route",
    component: RouteView
  },
  {
    path: '/route/copy',
    name: "RouteCopy",
    component: RouteView
  },
  {
    path: '/mypage',
    name: 'MyPage',
    component: MyPage
  },
  {
    path: '/share',
    name: 'share',
    component: SharedRoute
  },
  {
    path: "/reset",
    name: "reset",
    component: ResetPassword
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
