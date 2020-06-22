<template>
    <div class="music-memu">
        <el-row :gutter="24">
            <el-col :span="21">
                <Search class="set-margin"/>
            </el-col>
        </el-row>
        <!--        <BrowseMusic />-->
        <!--        <MyMusic />-->
    </div>
</template>

<script>
  // import Search from "../common/Search";
  // import BrowseMusic from "../common/BrowseMusic";
  // import MyMusic from "../common/MyMusic";
  const Search = () => import('../common/Search')

  export default {
    name: "MusicMemu",
    components: {
      Search,
      // BrowseMusic,
      // MyMusic,
    }
  }
</script>

<style scoped>
    .music-memu {
        background: #e0e0e0;
        color: #fff;
        width: 200px;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
        border-right: 1px solid #ccc;
    }

    .music-memu > div {
        position: relative;
        left: 8%;
    }

    .set-margin {
        margin-top: 30%;
        margin-bottom: 10%;
    }
</style>