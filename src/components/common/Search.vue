<template>
    <div>
        <el-row :gutter="8" class="search-group">
            <el-col :span="2" class="icon-search close iconfont icon-sousuo"></el-col>
            <el-col :span="18">
                <input @focus="getFocus" @focusout="lostFocus" @keydown.enter="onSearch" class="search" placeholder="搜索"
                       type="text" v-model="search">
            </el-col>
            <el-col :span="3">
                <div @click="onClose" class="icon-close iconfont icon-guanbi" v-if="search"></div>
            </el-col>
            <div class="outline" v-if="isAction"></div>
        </el-row>
    </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import apiUrl from '../../config/apiUrl'
  import parseParams from '../../config/parseParams'

  export default {
    name: "Search",
    data() {
      return {
        search: '',
        isClose: false,
        isAction: false
      }
    },
    methods: {
      //搜索
      onSearch() {
        this.axios
          .get(parseParams(apiUrl.getSearch, {keywords: this.search}))
          .then(res => {
            this.setSearchList(res.data.result.songs)
          })
          .catch(err => (console.log(err)))
      },
      onClose() {
        this.search = ''
      },
      getFocus() {
        this.isAction = true;
      },
      lostFocus() {
        this.isAction = false
      },
      ...mapMutations([
        'setSearchList'
      ])
    }
  }
</script>

<style scoped>
    .search-group {
        height: 26px;
        border: none;
        border-radius: 5px;
        background-color: #cecece;
        color: #a0a0a0;
    }

    .search {
        width: 100%;
        height: 26px;
        line-height: 26px;
        font-size: 1.05em;
        background: none;
        border: none;
        outline: none;
    }

    .search::placeholder {
        color: #a0a0a0;
    }

    .icon-search {
        color: #a0a0a0;
        line-height: 26px;
        margin-left: 3px;
    }

    .icon-close {
        color: #666;
        font-size: 1.3em;
        line-height: 26px;
        float: right;
        position: relative;
        left: 5px;
    }

    .outline {
        width: 98%;
        height: 82%;
        border: 2px solid dodgerblue;
        border-radius: 5px;
    }
</style>