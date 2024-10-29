const pixelmap = [];
for (let y = 0; y < 144; y++) {
  pixelmap[y] = [];
  for (let x = 0; x < 256; x++) {
    pixelmap[y][x] = "#f8f9fa";
  }
}

const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");

function drawPixelmap() {
  for (let y = 0; y < pixelmap.length; y++) {
    for (let x = 0; x < pixelmap[y].length; x++) {
      ctx.fillStyle = pixelmap[y][x];
      ctx.fillRect(x, y, 1, 1); 
    }
  }
}

function setPixel(x, y, color) {
  pixelmap[y][x] = color;
}

function getPixel(x, y) {
  return pixelmap[y][x];
}

function drawLine(x1, y1, x2, y2, color) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    setPixel(x1, y1, color);

    if (x1 === x2 && y1 === y2) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
  }
}

function drawRect(x1, y1, x2, y2, color, fill) {
  drawLine(x1, y1, x2, y1, color);
  drawLine(x2, y1, x2, y2, color);
  drawLine(x2, y2, x1, y2, color);
  drawLine(x1, y2, x1, y1, color);

  if (fill) {
    for (let y = y1 + 1; y < y2; y++) {
      drawLine(x1, y, x2, y, color);
    }
  }
}

function drawEllipse(x1, y1, x2, y2, color, fill) {
  const centerX = Math.floor((x1 + x2) / 2);
  const centerY = Math.floor((y1 + y2) / 2);
  const radiusX = Math.abs(x2 - x1) / 2;
  const radiusY = Math.abs(y2 - y1) / 2;

  let x = 0;
  let y = radiusY;
  let d1 = radiusY * radiusY - radiusX * radiusX * radiusY + 0.25 * radiusX * radiusX;
  let d2 = radiusY * radiusY * (x + 0.5) * (x + 0.5) + radiusX * radiusX * (y - 1) * (y - 1) - radiusX * radiusX * radiusY * radiusY;

  const drawSymmetricPoints = (cx, cy) => {
    setPixel(centerX + cx, centerY + cy, color);
    setPixel(centerX - cx, centerY + cy, color);
    setPixel(centerX + cx, centerY - cy, color);
    setPixel(centerX - cx, centerY - cy, color);
  };

  while (radiusX * radiusX * y > radiusY * radiusY * x) {
    drawSymmetricPoints(x, y);
    
    if (d1 < 0) {
      d1 += radiusY * radiusY * (2 * x + 3);
    } else {
      d1 += radiusY * radiusY * (2 * x + 3) - radiusX * radiusX * (2 * y - 2);
      y--;
    }
    x++;
  }

  x = radiusX;
  y = 0;
  d2 = radiusX * radiusX - radiusY * radiusY * radiusX + 0.25 * radiusY * radiusY;

  while (radiusY * radiusY * x > radiusX * radiusX * y) {
    drawSymmetricPoints(x, y);

    if (d2 < 0) {
      d2 += radiusX * radiusX * (2 * y + 3);
    } else {
      d2 += radiusX * radiusX * (2 * y + 3) - radiusY * radiusY * (2 * x - 2);
      x--;
    }
    y++;
  }

  if (fill) {
    for (let i = 0; i <= radiusX; i++) {
      const h = Math.floor(Math.sqrt(radiusY * radiusY - (radiusY * radiusY / radiusX / radiusX) * i * i));
      for (let j = -h; j <= h; j++) {
        setPixel(centerX + i, centerY + j, color);
        setPixel(centerX - i, centerY + j, color);
      }
    }
  }
}

function drawQuad(x1, y1, x2, y2, x3, y3, x4, y4, color, fill) {
  drawLine(x1, y1, x2, y2, color);
  drawLine(x2, y2, x3, y3, color);
  drawLine(x3, y3, x4, y4, color);
  drawLine(x4, y4, x1, y1, color);

  if (fill) {
    const minX = Math.min(x1, x2, x3, x4);
    const maxX = Math.max(x1, x2, x3, x4);
    const minY = Math.min(y1, y2, y3, y4);
    const maxY = Math.max(y1, y2, y3, y4);

    for (let y = minY; y <= maxY; y++) {
      let intersections = [];
      
      checkIntersection(x1, y1, x2, y2, y, intersections);
      checkIntersection(x2, y2, x3, y3, y, intersections);
      checkIntersection(x3, y3, x4, y4, y, intersections);
      checkIntersection(x4, y4, x1, y1, y, intersections);

      intersections.sort((a, b) => a - b);
      
      for (let i = 0; i < intersections.length; i += 2) {
        if (i + 1 < intersections.length) {
          drawLine(intersections[i], y, intersections[i + 1], y, color);
        }
      }
    }
  }
}

function checkIntersection(x1, y1, x2, y2, y, intersections) {
  if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
    const x = Math.round(x1 + (y - y1) * (x2 - x1) / (y2 - y1));
    intersections.push(x);
  }
}

function drawTriangle(x1, y1, x2, y2, x3, y3, color, fill) {
  drawLine(x1, y1, x2, y2, color);
  drawLine(x2, y2, x3, y3, color);
  drawLine(x3, y3, x1, y1, color);

  if (fill) {
    const minY = Math.min(y1, y2, y3);
    const maxY = Math.max(y1, y2, y3);

    for (let y = minY; y <= maxY; y++) {
      let intersections = [];
      
      checkIntersection(x1, y1, x2, y2, y, intersections);
      checkIntersection(x2, y2, x3, y3, y, intersections);
      checkIntersection(x3, y3, x1, y1, y, intersections);

      intersections.sort((a, b) => a - b);
      
      for (let i = 0; i < intersections.length; i += 2) {
        if (i + 1 < intersections.length) {
          drawLine(intersections[i], y, intersections[i + 1], y, color);
        }
      }
    }
  }
}

function drawPolygon(points, color, fill) {
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    drawLine(p1[0], p1[1], p2[0], p2[1], color);
  }

  if (fill) {
    const minY = Math.min(...points.map(p => p[1]));
    const maxY = Math.max(...points.map(p => p[1]));

    for (let y = minY; y <= maxY; y++) {
      let intersections = [];
      
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        checkIntersection(p1[0], p1[1], p2[0], p2[1], y, intersections);
      }

      intersections.sort((a, b) => a - b);
      
      for (let i = 0; i < intersections.length; i += 2) {
        if (i + 1 < intersections.length) {
          drawLine(intersections[i], y, intersections[i + 1], y, color);
        }
      }
    }
  }
}

function drawSprite(x, y, sprite) {
  for (let sy = 0; sy < sprite.length; sy++) {
    for (let sx = 0; sx < sprite[sy].length; sx++) {
      if (sprite[sy][sx] === "none") continue;

      setPixel(x + sx, y + sy, sprite[sy][sx]);
    }
  }
}

testSprite = [
  ["#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b"],
  ["#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b"],
  ["#ff6b6b", "#ff6b6b", "#339af0", "#339af0", "#ff6b6b", "#ff6b6b"],
  ["#ff6b6b", "#ff6b6b", "#339af0", "#339af0", "#ff6b6b", "#ff6b6b"],
  ["#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b"],
  ["#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b"]
];

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
  const angle = Math.PI / spikes;
  let path = [];

  for (let i = 0; i < spikes * 2; i++) {
    const r = (i % 2 === 0) ? outerRadius : innerRadius;
    const theta = i * angle;
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    path.push([x, y]);
  }

  // Draw star shape using the path
  drawPolygon(path, "#ffffff", true);
}

async function getImageHexArray(link) {
  const response = await fetch(link);
  const blob = await response.blob();

  const img = new Image();
  img.src = URL.createObjectURL(blob);

  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      const hexArray = [];
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        
        if (i % (img.width * 4) === 0) {
          hexArray.push([]);
        }
        hexArray[hexArray.length - 1].push(hex);
      }

      resolve(hexArray);
    };
  });
}

function resizeHexArray(hexArray, newWidth, newHeight) {
  const resized = [];
  const scaleX = hexArray[0].length / newWidth;
  const scaleY = hexArray.length / newHeight;

  for (let y = 0; y < newHeight; y++) {
    resized[y] = [];
    for (let x = 0; x < newWidth; x++) {
      const sourceX = Math.floor(x * scaleX);
      const sourceY = Math.floor(y * scaleY);
      resized[y][x] = hexArray[sourceY][sourceX];
    }
  }
  return resized;
}

getImageHexArray("https://raw.githubusercontent.com/R74nCom/R74n-Main/main/pixelflags/png/country/united_states.png").then(hexArray => {
  drawSprite(10, 100, hexArray);
});
getImageHexArray("https://raw.githubusercontent.com/R74nCom/R74n-Main/main/pixelflags/png/country/united_kingdom.png").then(hexArray => {
  drawSprite(50, 100, hexArray);
});
getImageHexArray("https://i.imgur.com/UniMfif.png").then(hexArray => {
  rickroll = resizeHexArray(hexArray, 50, 50);

  drawSprite(200, 80, rickroll);
});

function draw() {
  drawRect(3, 3, 10, 10, "#343a40", true);
  drawEllipse(10, 10, 80, 80, "#343a40", true);
  drawLine(80, 80, 90, 120, "#343a40");
  drawQuad(100, 10, 150, 20, 140, 50, 115, 40, "#343a40", true);
  drawTriangle(120, 75, 200, 50, 150, 100, "#343a40", true);
  drawPolygon([[200, 20], [210,3], [220,6], [230, 50], [215, 70]], "#343a40", true);
  drawSprite(20, 25, testSprite);
}

draw();
drawPixelmap();

setInterval(() => {
  draw();
  drawPixelmap();
}, 300);
