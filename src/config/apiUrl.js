let apiUrl = 'http://localhost:3000/';

let servicePath = {
  getSearch: apiUrl + 'search', //搜索信息
  getSongUrl: apiUrl + 'song/url', //获取音乐URL
  getSongInfo: apiUrl + 'song/detail', //获取歌曲信息
  getAlbum: apiUrl + 'album', //获取专辑信息
  getLyric: apiUrl + 'lyric', //获取歌词
}

export default servicePath;