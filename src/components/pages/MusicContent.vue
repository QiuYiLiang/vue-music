<template>
    <div class="music-content">
        <SearchList/>
        <!--    <PlaylistInfo />-->
        <!--    <CurrentPlaylist />-->
        <!--    <CurrentPlayMusic />-->
        <!--    <Rank />-->
    </div>
</template>

<script>
  // import SearchList from "../common/SearchList";
  // import PlaylistInfo from "../common/PlaylistInfo";
  // import CurrentPlaylist from "../common/CurrentPlaylist";
  // import CurrentPlayMusic from "../common/CurrentPlayMusic"
  // import Rank from "../common/Rank";
  const SearchList = () => import('../common/SearchList')

  export default {
    name: "MusicContent",
    components: {
      SearchList,
      // PlaylistInfo,
      // CurrentPlaylist,
      // CurrentPlayMusic,
      // Rank,
    }
  }
</script>

<style scoped>
    .music-content {
        width: 85%;
        overflow: auto;
        height: calc(100% - 50px);
        position: fixed;
        top: 50px;
        right: 0;
        scroll-behavior: auto;
    }
</style>