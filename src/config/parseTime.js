let parseTime = (time) => {
  time = parseInt(time)
  let str = '';
  let hours = parseInt(time / 3600);
  let minutes = parseInt(time % 3600 / 60);
  let seconds = time % 3600 % 60;

  if (hours) {
    str += hours + ':'
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  str += minutes + ':' + seconds
  return str
}

export default parseTime;