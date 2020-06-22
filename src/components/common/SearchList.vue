<template>
    <div v-if="searchList.length">
        <el-table
                :data="searchList"

                ref="searchTable"
        >
            <el-table-column
                    width="80"
            >
                <template slot-scope="scope">
                    <el-button @click="playSong(scope.row.id, scope.row.album.id)" class="el-icon-video-play set-font-size
" size="small" type="text"/>
                    <el-button @click="onDownload(scope.row.id, artists(scope.row.artists) + ' - ' + scope.row.name)"
                               class="el-icon-download set-font-size
" size="small" type="text"/>
                </template>
            </el-table-column>
            <el-table-column
                    label="歌曲"
                    prop="name"
            />
            <el-table-column
                    label="艺术家"
                    width="200"
            >
                <template slot-scope="scope">
                    {{ parseArtists(scope.row.artists) }}
                </template>
            </el-table-column>
            <el-table-column
                    label="专辑"
                    prop="album.name"
            />
            <el-table-column
                    label="时长"
                    prop="album.name"
                    width="100"
            >
                <template slot-scope="scope">
                    {{ parseDuration(scope.row.duration) }}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  import {mapMutations, mapState} from 'vuex';
  import parseArtists from '../../config/parseArtists'
  import parseTime from "../../config/parseTime";
  // import parseParams from "../../config/parseParams";
  // import apiUrl from "../../config/apiUrl";

  export default {
    name: "SearchList",
    methods: {
      playSong(id) {
        this.setNowSongId(id);
        this.setPlayOrStop(true);
        let onId = false;
        this.setNowPlaylistId(this.searchList.map((item) => {
          if (item.id == id) {
            onId = true;
          }
          if (onId) {
            return item.id
          }
        }).filter((item) => item));
      },
      parseArtists(artists) {
        parseArtists(artists)
      },
      // this.setNowPlaylist(searchList);
      // onDownload(songId,songName) {
      //   this.axios
      //     .get(parseParams(apiUrl.getSongUrl,{id: songId}))
      //     .then(res => {
      //       this.axios({
      //         method: 'get',
      //         url: res.data.data[0].url,
      //         responseType: 'blob',
      //       }).then((res) => {
      //         let blobUrl = window.URL.createObjectURL(res.data);
      //         let link = document.createElement('a');
      //         document.body.appendChild(link);
      //         link.style.display = 'none';
      //         link.href = blobUrl;
      //         link.download = songName + '.mp3';
      //         link.click();
      //         document.body.removeChild(link);
      //         window.URL.revokeObjectURL(blobUrl);
      //       })
      //     })
      //     .catch(err => (console.log(err)))
      ...mapMutations([
        'setNowSongId',
        'setPlayOrStop',
        'setNowPlaylistId',
      ]),
      parseDuration(songDuration) {
        return parseTime(songDuration / 1000)
      }
    },
    computed: {
      ...mapState([
        'searchList',
      ])
    },
  }
</script>

<style scoped>
    .set-font-size {
        font-size: 1.5em;
        color: #a0a0a0;
    }
</style>