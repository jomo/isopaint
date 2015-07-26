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
        console.log([posx, posy, posz]);
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
  ctx.fillText("x: " + x + " y: " + y + " z: " + -z, 10, 20);
  ctx.fillText("painting: " + painting, 10, 35);
  ctx.fillText("flipped: " + (flip === -1), 10, 50);
  ctx.fillText("scale: " + scale, 10, 65);

  ctx.fillText("(Shift) Arrow Keys → navigate", 10, canvas.height - 85);
  ctx.fillText("Scroll → Scale", 10, canvas.height - 70);
  ctx.fillText("Space → toggle painting", 10, canvas.height - 55);
  ctx.fillText("f → flip view", 10, canvas.height - 40);
  ctx.fillText("d → delete block", 10, canvas.height - 25);
  ctx.fillText("r → reset", 10, canvas.height - 10);
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

  for (var i = 0; i < draw.length; i++) {
    var pos = draw[i];
    var posx = pos[0] * scale * flip;
    var posy = pos[1] * scale * flip;
    var posz = pos[2] * scale;

    var last = x * scale === flip * posx && y * scale === flip * posy && z * scale === posz;

    // render top
    // + 0.5 is used to avoid the "problem of adjacent edges" with anti-aliasing
    ctx.setTransform(1, -skew_a, 1, skew_a, shiftx - scale, shifty - scale / 2 + 0.5);
    ctx.fillStyle = last ? "#c22" : "#c44";
    ctx.fillRect(posy - posz, posx + posz, scale, scale);

    // render left side
    ctx.setTransform(1, skew_a, 0, skew_b, shiftx - scale, shifty - scale / 2 - 0.5);
    ctx.fillStyle = last ? "#d22" : (flip === -1 ? "#a44" : "#f44");
    ctx.fillRect(posx + posy, posz - posy, scale, scale);

    // render right side
    ctx.setTransform(1, -skew_a, 0, skew_b, shiftx - scale + scale, shifty - scale / 2 + scale * skew_a);
    ctx.fillStyle = last ? "#822" : (flip === -1 ? "#f44" : "#a44");
    ctx.fillRect(posy + posx, posx + posz, scale, scale);
  }

  printInfo();
}