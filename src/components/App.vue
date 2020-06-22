<template>
    <div id="app">
        <MusicMemu/>
        <Player/>
        <MusicContent/>
    </div>
</template>

<script>
  import MusicMemu from "./pages/MusicMemu";
  import Player from "./common/Player";
  import MusicContent from "./pages/MusicContent";

  export default {
    name: 'App',
    components: {
      MusicMemu,
      Player,
      MusicContent,
    },
  }
</script>

<style>
    body {
        height: 100vh;
        width: 100vw;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        font-family: PingFangSC-Regular, sans-serif;
    }

    * {
        margin: 0;
        padding: 0;
    }
</style>
