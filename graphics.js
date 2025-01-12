function colorRGB(r, g, b, a = 255) {
  return (255 << 24) | (b << 16) | (g << 8) | r;
}

const colorCache = new Map();
function hexColor(hex) {
  if (colorCache.has(hex)) {
    return colorCache.get(hex);
  }
  
  const rgb = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  const color = colorRGB(
    parseInt(rgb[1], 16),
    parseInt(rgb[2], 16), 
    parseInt(rgb[3], 16)
  );
  
  colorCache.set(hex, color);
  return color;
}

const pixelmap = [];
for (let y = 0; y < 144; y++) {
  pixelmap[y] = [];
  for (let x = 0; x < 256; x++) {
    pixelmap[y][x] = hexColor("#f8f9fa");
  }
}

const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d", {alpha: false, willReadFrequently: true});
ctx.imageSmoothingEnabled = false;

updatedPixels = [];

function drawPixelmap() {
  const imageData = ctx.getImageData(0, 0, 256, 144);
  const data = imageData.data;
  const buffer = new Uint32Array(data.buffer);
  
  for (const pixel of updatedPixels) {
    buffer[pixel.y * 256 + pixel.x] = pixelmap[pixel.y][pixel.x];
  }
  
  ctx.putImageData(imageData, 0, 0);
  updatedPixels = []; // Clear the array after drawing
}

function setPixel(x, y, color) {
  if (x < 0 || x >= 256 || y < 0 || y >= 144) return;
  pixelmap[y][x] = color;
  updatedPixels.push({ x, y });
}

function getPixel(x, y) {
  if (x < 0 || x >= 256 || y < 0 || y >= 144) {
    return;
  }
  return pixelmap[y][x];
}

function clearCanvas() {
  for (let y = 0; y < pixelmap.length; y++) {
    for (let x = 0; x < pixelmap[y].length; x++) {
      pixelmap[y][x] = hexColor("#f8f9fa");
      updatedPixels.push({ x, y });
    }
  }
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

function drawRect(x1, y1, x2, y2, color, fill, radius = 0) {
  if (radius === 0) {
    drawPolygon([
      [x1, y1],
      [x2, y1],
      [x2, y2],
      [x1, y2]
    ], color, fill);
  } else {
    const points = [];

    points.push([x1 + radius, y1]);
    points.push([x2 - radius, y1]);
    points.push([x2, y1 + radius]);
    points.push([x2, y2 - radius]);
    points.push([x2 - radius, y2]);
    points.push([x1 + radius, y2]);
    points.push([x1, y2 - radius]);
    points.push([x1, y1 + radius]);

    points.push([x1 + radius, y1]);

    drawPolygon(points, color, fill);
  }
}

function drawEllipse(x1, y1, x2, y2, color, fill) {
  if ( (x2 - x1) % 2 !== 0 ) {
    x2--;
  }
  if ( (y2 - y1) % 2 !== 0 ) {
    y2--;
  }
  
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
  const maxY = Math.min(sprite.length, CANVAS_HEIGHT - y);
  const maxX = Math.min(sprite[0].length, CANVAS_WIDTH - x);
  
  for (let sy = 0; sy < maxY; sy++) {
    const row = sprite[sy];
    const targetY = y + sy;
    if (targetY < 0) continue;
    
    for (let sx = 0; sx < maxX; sx++) {
      const targetX = x + sx;
      if (targetX < 0) continue;
      
      const color = row[sx];
      if (color !== "none") {
        pixelmap[targetY][targetX] = color;
      }
    }
  }
}

