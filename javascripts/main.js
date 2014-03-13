var pressed = [];
var keys = [38,38,40,40,37,39,37,39,66,65];

function foobar() {
  console.log('test');
}

$(document).keydown(function(e) {
  keys.push( e.keyCode );
  if ( pressed == keys ) {
    foobar();
    pressed = [];
  }
});
