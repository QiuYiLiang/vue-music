let parseArtists = (artists) => {
  let str = ''
  for (let i = 0, l = artists.length; i < l; i++) {
    if (i == artists.length - 1) {
      str += artists[i].name
    } else {
      str += artists[i].name + '、'
    }
  }
  return str
}

export default parseArtists