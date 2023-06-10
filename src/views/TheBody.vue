<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Sidebar  -->
      <nav id="sidebar" class="col-1">
        <br />
        <br />
        <router-link to="/">
          <i class="fa-solid fa-apple-whole fa-2xl"></i>
        </router-link>
        <ul class="list-unstyled components">
          <!-- <p>유저정보</p> -->
          <li>
            <i class="fa-solid fa-plane fa-flip"></i>
            <router-link
              :to="{ name: 'AppBoardFree', params: { check: 'free' } }"
            >
              <i class="fa-regular fa-comments"></i>
              Community
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'AppBoardNotice', params: { check: 'notice' } }"
            >
              <i class="fa-regular fa-bell"></i> Announcement
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'KakaoMap' }">
              <i class="fa-solid fa-location-dot"></i>
              Tourist attractions
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'share' }">
              <i class="fa-regular fa-share-from-square"></i>
              Share the route
            </router-link>
          </li>
          <li><a href="#">Contact</a></li>
        </ul>
        <div id="icons">
        <i class="fa-brands fa-vuejs fa-2xl"></i>&nbsp; &nbsp; &nbsp; &nbsp;<i
          class="fa-brands fa-java fa-2xl"
        ></i>
        &nbsp; &nbsp; &nbsp; &nbsp;<i class="fa-brands fa-js fa-2xl"></i>
        <br />
        <br />
        <i class="fa-brands fa-instagram fa-2xl"></i>&nbsp; &nbsp; &nbsp;
        &nbsp;<i class="fa-brands fa-github fa-2xl"></i>&nbsp; &nbsp; &nbsp;
        &nbsp;<i class="fa-brands fa-gitlab fa-2xl"></i>
      </div>
      </nav>
      <div id="contents">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideHeader",
};
</script>

<style scoped>
p {
  font-size: 1.1em;
}

/* 마우스 올리면 hover로 크기가 1.3배가 됨 */
#icons i:hover {
  cursor: pointer;
  transform: scale(1.3);
  transition: all 0.3s ease-in-out;
}

a,
a:hover,
a:focus {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s;
}

#contents {
  width: calc(100% - 250px); /* Subtract the width of the sidebar */
  padding: 20px;
  min-height: 93.5vh;
  transition: all 0.3s;
  margin-left: 250px; /* Add a left margin equal to the width of the sidebar */
}
.navbar {
  padding: 15px 10px;
  background: #fff;
  border: none;
  border-radius: 0;
  margin-bottom: 40px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-btn {
  box-shadow: none;
  outline: none !important;
  border: none;
}

.line {
  width: 100%;
  height: 1px;
  border-bottom: 1px dashed #ddd;
  margin: 40px 0;
}

/* ---------------------------------------------------
    SIDEBAR STYLE
----------------------------------------------------- */
.wrapper {
  display: flex;
  width: 100%;
  align-items: stretch;
}

#sidebar {
  position: fixed;
  /* z-index: 999; */
  min-width: 250px;
  height: 70vh;
  /* max-height: 70vh; */
  /* background: #7386d5; */
  /* background-image: linear-gradient(135deg, #dbedff 0%, #4f1aa5 100%); */
  background-image: linear-gradient(135deg, #3670f7 0%, #9368f8 100%);
  color: #fff;
  transition: all 0.3s;
  border-radius: 40px 40px 40px 40px / 40px 40px 40px 40px;
  /* 오른쪽 margin을 제외하고 50px씩 줌 */
  margin: 50px 0 0 15px;
}

#sidebar.active {
  margin-left: -250px;
}

#sidebar .sidebar-header {
  padding: 20px;
  background: #6d7fcc;
}

#sidebar ul.components {
  padding: 20px 0;
  border-bottom: 1px solid #47748b;
}

#sidebar ul p {
  color: #fff;
  padding: 10px;
}

#sidebar ul li a {
  padding: 10px;
  font-size: 1.1em;
  display: block;
}

#sidebar ul li a:hover {
  color: #7386d5;
  background: #fff;
}

#sidebar ul li.active > a,
a[aria-expanded="true"] {
  color: #fff;
  background: #6d7fcc;
}

a[data-toggle="collapse"] {
  position: relative;
}

ul ul a {
  font-size: 0.9em !important;
  padding-left: 30px !important;
  background: #6d7fcc;
}

ul.CTAs {
  padding: 20px;
}

ul.CTAs a {
  text-align: center;
  font-size: 0.9em !important;
  display: block;
  border-radius: 5px;
  margin-bottom: 5px;
}

a.download {
  background: #fff;
  color: #7386d5;
}

a.article,
a.article:hover {
  background: #6d7fcc !important;
  color: #fff !important;
}

/* ---------------------------------------------------
    CONTENT STYLE
----------------------------------------------------- */

#content {
  width: 100%;
  padding: 20px;
  min-height: 100vh;
  transition: all 0.3s;
}

/* ---------------------------------------------------
    MEDIAQUERIES
----------------------------------------------------- */

@media (max-width: 768px) {
  #sidebar {
    margin-left: -250px;
  }

  #sidebar.active {
    margin-left: 0;
  }

  #sidebarCollapse span {
    display: none;
  }
}
</style>
