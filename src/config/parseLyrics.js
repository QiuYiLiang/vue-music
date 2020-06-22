let parseLyrics = (lyrics) => {
  let lyricsArr = lyrics.split('\n');
  let newLyricsArr = [];
  for (let i = 0, l = lyricsArr.length - 1; i < l; i++) {
    let lyricArr = lyricsArr[i].split(']');
    if (lyricArr[1].search(':') == -1 || lyricArr[1].search('：') == -1) {
      let lyricTimeArr = lyricArr[0].substr(1).split(':');
      if (lyricArr[1]) {
        newLyricsArr.push({
          lyric: lyricArr[1],
          time: (parseInt(lyricTimeArr[0]) * 60 + parseInt(lyricTimeArr[1]))
        })
      }
    }
  }
  return newLyricsArr
}

export default parseLyrics