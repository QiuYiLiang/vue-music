<template>
    <el-row align="middle" class="player" type="flex">
        <el-row align="middle" class="player-control" type="flex">
            <i class="iconfont icon-suiji"></i>
            <i @click="onBack" class="iconfont icon-youqianjin"></i>
            <i :class="['btn-play','iconfont', playOrStop ? 'icon-zanting' : 'icon-icon_play']" @click="onPlay"></i>
            <i @click="onNext" class="iconfont icon-zuoqianjin"></i>
            <i class="iconfont icon-ziyuan"></i>
        </el-row>
        <div class="song-info-group" ref="songInfoGroup">
            <div :style="{ backgroundImage: 'url(' + nowSongPicUrl + ')' }" class="song-bg"></div>
            <div :style="{width: songInfoWidth}" class="song-info" v-if="nowSongInfo">
                <p class="song-name">{{ nowSongInfo.name }}<i class="iconfont icon-gengduo"></i></p>
                <p class="song-album">{{ nowSongInfo.ar[0].name }} - {{ nowSongInfo.al.name }}</p>
                <input :max="playEndTime"
                       :style="{background: 'linear-gradient(to right,#666666 ' + parseFloat(nowPlayTime / playEndTime * 100) + '%, #cecece 1%,#e8e8e8)'}"
                       :value="nowPlayTime" @click="setProgress" class="song-progressBar" min="0" step="1"
                       type="range"/>
                <span class="song-time-passed">{{ parseNowPlayTime }}</span>
                <span class="song-time-Remaining">{{ parseTimeRemaining }}</span>
            </div>
        </div>
        <el-row class="player-volime" justify="center" type="flex">
            <i class="iconfont icon-yinliang-guan"></i>
            <input @mousedown="setIsVolumeMousedowm(true)" @mouseleave="setIsVolumeMousedowm(false)"
                   @mousemove="setVolume" class="player-button-volume-slider" max="100" min="0" step="1" type="range"
                   value="50"/>
            <i class="iconfont icon-yinliang-gao"></i>
        </el-row>
        <div class="player-tools">
            <el-row justify="center" type="flex">
                <i :style="{color: isActionLyrics ? '#fff' : '#a0a0a0',background:  isActionLyrics ? '#666' : 'rgba(0,0,0,0)'}"
                   @click="onBtnLyrics" class="iconfont icon-xiaoxi"></i>
                <i :style="{color: isActionPlaylist ? '#fff' : '#a0a0a0',background:  isActionPlaylist ? '#666' : 'rgba(0,0,0,0)'}"
                   @click="onBtnPlaylist" class="iconfont icon-liebiao"></i>
            </el-row>
            <transition name="boxRight">
                <div :style="{overflow: ((!lyrics || lyrics == null) && isActionLyrics) ? 'hidden' : 'auto'}"
                     class="box-right" ref="boxRight" v-show="isActionLyrics || isActionPlaylist">
                    <ul @mouseenter="isHoverLyrics = true" @mouseleave="isHoverLyrics = false" class="lyrics-group"
                        ref="lyrics" v-if="isActionLyrics">
                        <div class="lyrics-not-play" v-if="!lyrics">
                            <p>播放歌曲并在此处查看歌词。</p>
                        </div>
                        <div class="lyrics-null" v-if="lyrics == null">
                            <p>无可用歌词</p>
                            <p>此歌曲没有任何可用歌词</p>
                        </div>
                        <li :key="i.time" @click="setNowPlayTime(i.time)" v-for="i in lyrics">
                            {{ i.lyric }}
                        </li>
                    </ul>
                    <div class="playlist-group" v-if="isActionPlaylist">
                        <div class="playlist-title-bg">
                            <div class="playlist-title">
                                <div class="playlist-waiting">{{ waitingOrHistory ? '待播清单' : '历史记录' }}</div>
                                <div @click="setWaitingOrHistory" class="playlist-history">{{ waitingOrHistory ? '历史记录'
                                    : '待播清单' }}
                                </div>
                            </div>
                        </div>
                        <ul class="playlist-content">
                            <li :key="item.id" :style="{background: index == clickIndex ? '#225DD0' : '#fff'}"
                                @click="setColor(index)" @dblclick="playSong(index)"
                                @mousemove="setIsActionPlaylistItem(index)" @mouseout="setIsActionPlaylistItem(-1)"
                                class="playlist-item"
                                v-for="(item, index) in (waitingOrHistory ? nowPlaylist : historyPlaylist)">
                                <div :style="{ backgroundImage: 'url(' + item.al.picUrl + '?param=40y40)' }"
                                     class="playlist-item-pic"></div>
                                <div class="playlist-item-content">
                                    <div class="playlist-item-title">
                                        <p :style="{color: index == clickIndex ? '#fff' : '#000'}"
                                           class="playlist-item-title-name">{{ item.name }}</p>
                                        <p :style="{color: index == clickIndex ? '#fff' : '#888'}"
                                           class="playlist-item-title-album">{{ parseArtists(item.ar) + '—' +
                                            item.al.name }}</p>
                                    </div>
                                    <div :style="{color: index == clickIndex ? '#fff' : '#888'}"
                                         class="playlist-item-duration" v-show="isActionPlaylistItem != index">{{
                                        parseTime(item.dt/1000) }}
                                    </div>
                                    <div class="playlist-item-action" v-show="isActionPlaylistItem == index">
                                        <div @click="delSong(index)" class="iconfont icon-jian"></div>
                                        <div class="iconfont icon-gengduo"></div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="playlist-clear-box"
                             v-if="waitingOrHistory ? nowPlaylist.length : historyPlaylist.length">
                            <div @click="clear" class="playlist-clear">清除</div>
                        </div>
                        <div class="playlist-null"
                             v-if="waitingOrHistory ? !nowPlaylist.length : !historyPlaylist.length">{{ waitingOrHistory
                            ? '无待播歌曲。' : '您尚未播放任何歌曲。' }}
                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <audio autoplay ref="song"></audio>
    </el-row>
</template>

<script>
  import {mapMutations, mapState} from 'vuex';
  import servicePath from "../../config/apiUrl";
  import parseParams from "../../config/parseParams";
  import parseTime from "../../config/parseTime";
  import parseArtists from '../../config/parseArtists'
  import parseLyrics from "../../config/parseLyrics";
  import defaultPic from "../../assets/music.png";

  export default {
    name: "Player",
    data() {
      return {
        nowSongInfo: false,
        songInfoWidth: '',
        nowPlayTime: false,
        playEndTime: false,
        timer: '',
        isVolumeMousedowm: false,
        isActionLyrics: false,
        isActionPlaylist: false,
        lyrics: false,
        isHoverLyrics: false,
        nowPlaylist: [],
        historyPlaylist: [],
        waitingOrHistory: true,
        isActionPlaylistItem: -1,
        clickIndex: -1,
      }
    },
    mounted() {
      this.$refs.song.volume = .5;
    },
    beforeDestroy() {
      window.onresize = null;
    },
    methods: {
      onBack() {
        let listArr = this.nowPlaylistId;
        listArr.unshift(this.historyPlaylist[0].id);
        this.historyPlaylist.shift();
        this.setNowPlaylistId(listArr);
        this.setNowSongId(listArr[0]);
      },
      onPlay() {
        this.setPlayOrStop();
        this.playOrStop ? this.$refs.song.play() : this.$refs.song.pause();
      },
      onNext() {
        let listArr = this.nowPlaylistId;
        this.historyPlaylist.unshift(this.nowPlaylist[0]);
        listArr.shift();
        this.setNowPlaylistId(listArr);
        this.setNowSongId(listArr[0]);
      },
      setIsVolumeMousedowm(isVolumeMousedowm) {
        this.isVolumeMousedowm = isVolumeMousedowm
      },
      setVolume(e) {
        if (this.isVolumeMousedowm) {
          e.target.style.background = "linear-gradient(to right,#666 " + e.target.value + "%, #cecece 1%,#cecece)";
          this.$refs.song.volume = e.target.value / 100
        }
      },
      playSong(index) {
        if (this.waitingOrHistory) {
          this.historyPlaylist.unshift(this.nowPlaylist[0]);
          this.nowPlaylist = this.nowPlaylist.splice(index);
          this.setNowSongId(this.nowPlaylist[0].id);
          this.setColor(-1);
        } else {
          let listArr = this.nowPlaylistId;
          listArr.unshift(this.historyPlaylist[index].id);
          this.historyPlaylist.splice(index, 1)
          this.setNowPlaylistId(listArr);
          this.setNowSongId(listArr[0]);
        }
      },
      setProgress(e) {
        e.target.style.background = "linear-gradient(to right,#e4e4e4 " + parseInt(e.target.value / e.target.max * 100) + "%, #cecece 1%,#cecece)";
        this.$refs.song.currentTime = e.target.value;
      },
      onBtnLyrics() {
        this.isActionLyrics = !this.isActionLyrics;
        if (this.isActionPlaylist) {
          this.isActionPlaylist = false;
        }
      },
      onBtnPlaylist() {
        this.isActionPlaylist = !this.isActionPlaylist;
        if (this.isActionLyrics) {
          this.isActionLyrics = false;
        }
      },
      setNowPlayTime(nowPlayTime) {
        this.nowPlayTime = nowPlayTime;
      },
      parseArtists(artists) {
        return parseArtists(artists)
      },
      parseTime(time) {
        return parseTime(time)
      },
      setWaitingOrHistory() {
        this.waitingOrHistory = !this.waitingOrHistory;
      },
      clear() {
        if (this.waitingOrHistory) {
          this.setNowPlaylistId([]);
        } else {
          this.historyPlaylist = [];
        }
      },
      setIsActionPlaylistItem(index) {
        this.isActionPlaylistItem = index;
      },
      delSong(index) {
        if (this.waitingOrHistory) {
          let playlistId = this.nowPlaylistId;
          playlistId.splice(index, 1);
          this.setNowPlaylistId(playlistId);
        } else {
          this.historyPlaylist.splice(index, 1)
        }
      },
      setColor(index) {
        this.clickIndex = index
      },
      ...mapMutations([
        'setNowSongId',
        'setPlayOrStop',
        'setNowPlaylistId',
      ]),
    },
    computed: {
      nowSongPicUrl() {
        if (this.nowSongInfo) {
          return parseParams(this.nowSongInfo.al.picUrl, {param: '40y40'})
        } else {
          return defaultPic
        }
      },
      parseNowPlayTime() {
        if (this.nowPlayTime) {
          return parseTime(parseInt(this.nowPlayTime))
        } else {
          return '0:00'
        }
      },
      parseTimeRemaining() {
        if (this.nowPlayTime) {
          return '-' + parseTime(this.playEndTime - this.nowPlayTime)
        } else {
          return '-0:00'
        }
      },
      lyricIndex() {
        if (this.isActionLyrics && this.nowPlayTime) {
          return this.lyrics.findIndex((item) => {
            return item.time >= this.nowPlayTime
          }) - 1
        } else {
          return -1
        }
      },
      ...mapState([
        'nowSongId',
        'playOrStop',
        'nowPlaylistId',
      ])
    },
    watch: {
      nowSongId(newVal) {
        this.axios
          .get(parseParams(servicePath.getSongUrl, {id: newVal,}))
          .then((res) => {
            this.$refs.song.src = parseParams(res.data.data[0].url, {
              timestamp: new Date().getTime(),
            });
          })
          .catch((err) => {
            console.log(err);
          })
        this.axios
          .get(parseParams(servicePath.getSongInfo, {ids: newVal}))
          .then((res) => {
            this.nowSongInfo = res.data.songs[0];
          })
          .catch((err) => {
            console.log(err);
          })
        this.axios
          .get(parseParams(servicePath.getLyric, {id: this.nowSongId}))
          .then((res) => {
            this.lyrics = parseLyrics(res.data.lrc.lyric);
          })
          .catch((err) => {
            console.log(err)
            this.lyrics = false;
          })
        this.$refs.boxRight.scrollTop = 0
      },
      playOrStop(newVal) {
        if (newVal) {
          this.nowPlayTime = true;
          this.timer = setInterval(() => {
            this.nowPlayTime = this.$refs.song.currentTime;
            this.playEndTime = this.$refs.song.duration;
          }, 1000);
        } else {
          clearTimeout(this.timer)
        }
      },
      lyricIndex(newVal, oldVal) {
        if (!this.isHoverLyrics) {
          this.$refs.boxRight.scrollTop = this.$refs.lyrics.children[newVal].offsetTop - 32;
        }
        (oldVal != -1) && (this.$refs.lyrics.children[oldVal].style.color = '#999');
        this.$refs.lyrics.children[newVal].style.color = '#3a3a3a';
      },
      nowPlaylistId() {
        if (this.nowPlaylistId.length) {
          this.axios
            .get(parseParams(servicePath.getSongInfo, {ids: this.nowPlaylistId.join(',')}))
            .then((res) => {
              this.nowPlaylist = res.data.songs
            })
            .catch((err) => {
              console.log(err);
            })
        } else {
          this.nowPlaylist = []
        }
      },
      nowPlayTime() {
        if (this.nowPlayTime == this.playEndTime) {
          this.onNext();
        }
      },
      historyPlaylist() {
        this.historyPlaylist = [...new Set(this.historyPlaylist)]
      }
    },
  }
</script>

<style scoped>
    .player {
        width: calc(100% - 200px);
        position: fixed;
        top: 0;
        right: 0;
        height: 50px;
        background: #fff;
        border-bottom: 1px solid #ccc;
        z-index: 1;
    }

    .player-control {
        width: 140px;
        margin: 0 8% 0 8%;
    }

    .player-control i {
        margin-right: 10px;
    }

    .icon-suiji {
        font-size: .9em;
    }

    .icon-youqianjin {
        font-size: 1.3em;
    }

    .btn-play {
        font-size: 1.6em;
    }

    .icon-zuoqianjin {
        font-size: 1.3em;
    }

    .icon-ziyuan {
        font-size: .7em;
    }

    .song-info-group {
        position: relative;
        width: 40%;
        height: 40px;
        background: #fff;
        border: 1px solid #e4e4e4;
        border-radius: 3px;
    }

    .song-bg {
        width: 40px;
        height: 40px;
        border-radius: 2px 0 0 2px;
        background-size: 40px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }

    .song-info {
        position: absolute;
        top: 0;
        right: 0;
        width: calc(100% - 40px);
        height: 100%;
    }

    .song-name,
    .song-album {
        text-align: center;
        font-size: .8em;
        overflow: hidden;
        height: 18px;
        width: calc(100% - 68px);
        margin: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .song-album {
        color: #666666;
        font-size: .7em;
    }

    .song-progressBar {
        appearance: none;
        width: 100%;
        height: 3px;
        position: absolute;
        bottom: 0;
        background: linear-gradient(to right, #666666 0%, #cecece 1%, #e4e4e4);
        border-radius: 2px;
        outline: none;
    }

    .song-info-group:hover .song-time-passed,
    .song-info-group:hover .song-time-Remaining,
    .song-info-group:hover .icon-gengduo,
    .song-info-group:hover .song-progressBar::-webkit-slider-thumb {
        display: inline-block;
    }

    .song-progressBar::-webkit-slider-thumb {
        appearance: none;
        display: none;
        height: 7px;
        width: 6px;
        border-radius: 4px 4px 0 0;
        border-left: 1px solid #fff;
        border-right: 1px solid #fff;
        background: #666666;
        margin-bottom: 3px;
    }

    .song-time-passed,
    .song-time-Remaining {
        display: none;
        font-size: .7em;
        transform: scale(.9);
        position: absolute;
        bottom: 3px;
        color: #ccc;
    }

    .song-info .icon-gengduo {
        display: none;
        font-size: 14px;
        font-weight: bold;
        color: dodgerblue;
        position: absolute;
        margin-left: 2px;
        padding: 3px;
    }

    .song-time-passed {
        left: 5px;
    }

    .song-time-Remaining {
        right: 5px;
    }

    .player-volime {
        margin-left: 9%;
    }

    .player-button-volume-slider {
        appearance: none;
        width: 70px;
        margin: 8px 5px 0 2px;
        height: 3px;
        background: linear-gradient(to right, #666666 50%, #cecece 1%, #e4e4e4);
        border-radius: 2px;
        outline: none;
    }

    .player-button-volume-slider::-webkit-slider-thumb {
        appearance: none;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 0 2px 0 #a0a0a0;
    }

    .icon-yinliang-guan,
    .icon-yinliang-gao {
        color: #bbb;
        font-size: 1.1em;
    }

    .player-tools {
        position: absolute;
        top: 12px;
        right: 10px;
    }

    .icon-xiaoxi,
    .icon-liebiao {
        line-height: 25px;
        width: 30px;
        text-align: center;
        border-radius: 5px;
        font-weight: bold;
    }

    .icon-xiaoxi {
        font-size: .9em;
    }

    .icon-liebiao {
        font-size: 1.5em;
    }

    .icon-liebiao > div {
        left: 30px;
    }

    .box-right {
        position: fixed;
        top: 50px;
        right: 0;
        background: #fff;
        width: 312px;
        height: calc(100% - 50px);
        border-left: 1px solid #ccc;
        scroll-behavior: smooth;
    }

    .boxRight-enter-active {
        animation: boxRight-enter-active .3s;
    }

    .boxRight-leave-active {
        animation: boxRight-leave-active .3s;
    }

    @keyframes boxRight-enter-active {
        0% {
            right: -280px;
        }
        100% {
            right: 0;
        }
    }

    @keyframes boxRight-leave-active {
        0% {
            right: 0;
        }
        100% {
            right: -280px;
        }
    }

    .lyrics-group {
        list-style: none;
        font-size: 1.4em;
        margin: 0 25px calc(100vh - 2.8em - 50px) 16px;
        font-weight: bold;
    }

    .lyrics-group::after {
        content: '';
        width: 300px;
        height: calc(100% - 150px);
        top: 150px;
        position: fixed;
        bottom: 0;
        right: 0;
        background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0) 100%);
        z-index: 20;
    }

    .lyrics-group li {
        margin-top: 32px;
        color: #999;
    }

    .lyrics-group li:hover {
        color: #3a3a3a;
    }

    .playlist-content {
        list-style: none;
        position: relative;
        top: 50px;
    }

    .playlist-title {
        width: 256px;
        height: 50px;
        border-bottom: 1px solid #ccc;
    }

    .playlist-title-bg {
        width: 120%;
        height: 50px;
        position: fixed;
        top: 50px;
        background: #fff;
        z-index: 1;
        padding: 0 22px;
    }

    .playlist-title div {
        margin-top: 10px;
        height: 50px;
        line-height: 40px;
    }

    .playlist-waiting {
        font-size: 1.2em;
        float: left;
        font-weight: bold;
    }

    .playlist-history {
        color: dodgerblue;
        float: right;
    }

    .playlist-clear-box {
        height: 50px;
        margin-top: 50px;
        border-top: 1px solid #ccc;
    }

    .playlist-clear {
        line-height: 40px;
        width: 50px;
        margin: auto;
        text-align: center;
        color: dodgerblue;
    }

    .playlist-item {
        width: 100%;
        height: 50px;
        border-radius: 3px;
        position: relative;
        padding: 5px 0;
        margin-bottom: 1px;
    }

    .playlist-item-pic {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 10px;
        left: 20px;
        border-radius: 5px;
    }

    .playlist-item-content {
        height: 91%;
        position: absolute;
        top: 5px;
        left: 80px;
        border-bottom: 1px solid #ccc;
    }

    .playlist-item-title {
        width: calc(100% - 50px);
        height: 100%;
        display: inline-block;
    }

    .playlist-item-duration {
        width: 50px;
        height: 100%;
        display: inline-block;
        position: relative;
        top: -16px;
        text-align: right;
        font-size: 15px;
    }

    .playlist-item-title-name {
        height: 21px;
        width: 150px;
        margin-top: 6px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .playlist-item-title-album {
        height: 20px;
        width: 130px;
        font-size: 12px;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .playlist-null {
        width: 312px;
        color: #000;
        text-align: center;
        position: absolute;
        top: calc(50% + 23px);
        left: 0;
    }

    .lyrics-not-play {
        line-height: calc(100vh - 50px);
        margin-left: 20px;
        text-align: center;
        font-size: .6em;
        color: #a0a0a0;
        font-weight: normal;
    }

    .lyrics-null {
        margin-left: 20px;
        text-align: center;
        font-size: .6em;
        color: #a0a0a0;
        font-weight: normal;
    }

    .lyrics-null p:nth-child(1) {
        margin-top: calc(50vh - 40px);
        margin-bottom: 6px;
        color: #888;
        font-weight: bold;
    }

    .playlist-item-action {
        position: absolute;
        left: -60px;
        top: 5px
    }

    .icon-jian {
        font-size: 15px;
        -webkit-text-stroke: 1px #fff;
        color: red;
        border-radius: 50%;
    }

    .playlist-item-action .icon-gengduo {
        font-size: 14px;
        color: dodgerblue;
        position: absolute;
        top: 14px;
        left: 248px;
        font-weight: bold;
    }
</style>