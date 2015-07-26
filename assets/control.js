document.onwheel = function(event) {
  var newscale = Math.round(scale - event.deltaY);
  if (newscale < 1) {
    scale = 1;
  } else if (newscale > 150) {
    scale = 150;
  } else {
    scale = newscale;
  }
  render();
};

// Listen to keys
document.onkeydown = function(event) {
  // push current position to steps
  var push = true;

  if (!steps.length && painting) {
    // first step
    steps.push([x, y, z]);
  }

  switch (event.keyCode) {
    case 32:
      painting = !painting;
      break;
    case 38:
      if (event.shiftKey) {
        z--;
      } else {
        y++;
      }
      break;
    case 40:
      if (event.shiftKey) {
        z++;
      } else {
        y--;
      }
    break;
    case 37:
      x--;
      break;
    case 39:
      x++;
      break;
    case 68:
      push = false;
      del();
      break;
    case 70:
      flip *= -1;
      break;
    case 82:
      push = false;
      steps = [];
      painting = true;
      scale = 20;
      x = z = y = 0;
      break;
    default:
      return;
  }

  if (painting && push) {
    steps.push([x, y, z]);
  }

  render();
  location.hash = gethash();
};