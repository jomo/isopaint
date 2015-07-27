// get list of steps to be placed in location.hash
function gethash() {
  var hash = [];
  for (var i = 0; i < steps.length; i++) {
    hash.push(steps[i].join(","));
  }
  // remove 0s
  return hash.join(",").replace(/(^0)?,0/g, ",");
}

// parse location.hash into a list of steps
function parsehash() {
  var hash = location.hash.split(",");
  if (hash.length % 3 !== 0) {
    console.warn("Invalid hash");
  } else {
    var list = [];

    for (var i = 0; i < hash.length; i += 3) {
      var posx = flip * Number(hash[i + 0]) || 0;
      var posy = flip * Number(hash[i + 1]) || 0;
      var posz = Number(hash[i + 2]) || 0;
      list.push([posx, posy, posz]);

      if (i === hash.length - 3) {
        x = posx;
        y = posy;
        z = posz;
      }
    }

    return list;
  }
}

function processSteps() {
  // unique
  var unique = {};
  steps = steps.filter(function(item) {
    return unique.hasOwnProperty(item) ? false : unique[item] = true;
  });

  // clone steps
  draw = steps.slice(0);
  // we draw all steps + current position
  draw.push([x, y, z]);
  // render by order: y, x, z
  // avoids falsely overlapping
  draw = draw.sort(function(a, b) {
    if (flip === 1) {
      return b[1] - a[1] || a[0] - b[0] || b[2] - a[2];
    } else {
      return a[1] - b[1] || b[0] - a[0] || b[2] - a[2];
    }
  });
}

function printInfo() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.fillStyle = "#fff";
  ctx.fillText("x: " + x + " y: " + y + " z: " + -z, dp * 10, dp * 20);
  ctx.fillText("painting: " + painting,              dp * 10, dp * 35);
  ctx.fillText("flipped: " + (flip === -1),          dp * 10, dp * 50);
  ctx.fillText("scale: " + scale,                    dp * 10, dp * 65);

  ctx.fillText("(Shift) Arrow Keys → navigate",      dp * 10, canvas.height - dp * 85);
  ctx.fillText("Scroll → Scale",                     dp * 10, canvas.height - dp * 70);
  ctx.fillText("Space → toggle painting",            dp * 10, canvas.height - dp * 55);
  ctx.fillText("f → flip view",                      dp * 10, canvas.height - dp * 40);
  ctx.fillText("d → delete block",                   dp * 10, canvas.height - dp * 25);
  ctx.fillText("r → reset",                          dp * 10, canvas.height - dp * 10);
}

// deletes the block at current position
function del() {
  steps = steps.filter(function(value) {
    return value.toString() !== [x, y, z].toString();
  });
}

function render() {
  processSteps();

  // reset canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var renderScale = dp * scale;

  for (var i = 0; i < draw.length; i++) {
    var pos = draw[i];
    var posx = pos[0] * renderScale * flip;
    var posy = pos[1] * renderScale * flip;
    var posz = pos[2] * renderScale;

    var flipped = flip === -1;

    var last = x * renderScale === flip * posx && y * renderScale === flip * posy && z * renderScale === posz;

    var colorTop = "#c44";
    if (last) {
      colorTop = painting ? "rgba(204, 34, 34, 0.5)" : "rgba(30, 30, 30, 0.5)";
    }
    var colorLeft = "#f44";
    if (last) {
      colorLeft = painting ? "rgba(221, 34, 34, 0.5)" : "rgba(50, 50, 50, 0.5)";
    }
    var colorRight = "#a44";
    if (last) {
      colorRight = painting ? "rgba(136, 34, 34, 0.5)" : "rgba(00, 00, 00, 0.5)";
    }

    // render top
    // + 0.5 is used to avoid the "problem of adjacent edges" with anti-aliasing
    ctx.setTransform(1, -skew_a, 1, skew_a, shiftx - renderScale, shifty - renderScale / 2 + 0.5);
    ctx.fillStyle = colorTop;
    ctx.fillRect(posy - posz, posx + posz, renderScale, renderScale);

    // render left side
    ctx.setTransform(1, skew_a, 0, skew_b, shiftx - renderScale, shifty - renderScale / 2 - 0.5);
    ctx.fillStyle = flipped ? colorRight : colorLeft;
    ctx.fillRect(posx + posy, posz - posy, renderScale, renderScale);

    // render right side
    ctx.setTransform(1, -skew_a, 0, skew_b, shiftx - renderScale + renderScale, shifty - renderScale / 2 + renderScale * skew_a);
    ctx.fillStyle = flipped ? colorLeft : colorRight;
    ctx.fillRect(posy + posx, posx + posz, renderScale, renderScale);
  }

  printInfo();
}