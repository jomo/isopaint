var pressed = new Array(10);
var keys    = [38,38,40,40,37,39,37,39,66,65];
var song    = new Audio('https://archive.org/download/JeopardyTheme/Jeopardy.mp3');
song.loop   = true;
song.load();

$(document).keydown(function(e) {
  pressed.push(e.keyCode);
  pressed.shift();
  if ( pressed.toString() == keys.toString() ) {
    $('#shibe').toggleClass('active');
    $('body').toggleClass('rainbow');
    if (song.paused) {
        song.play();
    } else {
        song.pause();
    }
  }
});
