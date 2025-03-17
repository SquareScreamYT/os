const CANVAS_WIDTH = 256;
const CANVAS_HEIGHT = 144;

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
        let a = data[i + 3];
        const hex = colorRGB(r, g, b, a);
        
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

function drawText(text, x, y, color, font = 'sqpixels') {
  let currentX = x;
  let lineY = y; 
  const lineHeight = font === 'small' ? 6 : 7;
  
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    
    if (char === '\n') {
      currentX = x;
      lineY += lineHeight;
      continue;
    }
    
    const fontArray = font === 'small' ? smallfont : sqpixelsArray;
    if (!fontArray || !fontArray[char]) continue;
    
    const charArray = fontArray[char];
    
    if (font === 'small') {
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 3; col++) {
          if (charArray[row][col] === '.') {
            setPixel(currentX + col, lineY + row, color);
          }
        }
      }
      currentX += 4;
    } else {
      let maxWidth = 0;
      for (let row = 0; row < charArray.length - 2; row++) {
        const pixels = charArray[row];
        for (let col = pixels.length - 1; col >= 4; col--) {
          if (pixels[col] === '.') {
            maxWidth = Math.max(maxWidth, col - 4);
            break;
          }
        }
      }
      
      for (let row = 0; row < charArray.length - 2; row++) {
        const pixels = charArray[row];
        for (let col = 4; col < pixels.length; col++) {
          if (pixels[col] === '.') {
            setPixel(currentX + (col - 4), lineY + (row - 6), color);
          }
        }
      }
      currentX += maxWidth + 2;
    }
  }
}

function blackToTransparent(hexArray) {
  const black = colorRGB(0, 0, 0);
  for (let y = 0; y < hexArray.length; y++) {
    for (let x = 0; x < hexArray[y].length; x++) {
      if (hexArray[y][x] == black) {
        hexArray[y][x] = "none";
      }
    }
  }
  return hexArray;
}

function isMouseWithin(x1, y1, x2, y2) {
  if (mouseX >= x1 && mouseX <= x2 && mouseY >= y1 && mouseY <= y2) {
    return true;
  } else  {
    return false;
  }
}

let mouseXoldold, mouseYoldold;
let mouseX = 0;
let mouseY = 0;
let mouseXold = 0;
let mouseYold = 0;
let mouseDown = false;

function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  mouseX = Math.floor((event.clientX - rect.left) * scaleX);
  mouseY = Math.floor((event.clientY - rect.top) * scaleY);
  return [mouseX, mouseY];
}

canvas.addEventListener('mousemove', (event) => {
  getMousePos(event);
  /* if (mouseDown) {
    drawLine(mouseXold, mouseYold, mouseX, mouseY, "#343a40");
    drawPixelmap();
  } */
  mouseXold = mouseX;
  mouseYold = mouseY;
});

let wasMouseDown = false;
let wasMouseDownRight = false;

function onInitialMouseDown() {
  if (!wasMouseDown && mouseDown) {
    onMouseClick();
    wasMouseDown = true;
  } else if (!mouseDown) {
    wasMouseDown = false;
  }

  if (!wasMouseDownRight && mouseDownRight) {
    onMouseClickRight();
    wasMouseDownRight = true;
  } else if (!mouseDownRight) {
    wasMouseDownRight = false;
  }
}

let mouseDownRight = false;

canvas.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

canvas.addEventListener('mousedown', (event) => {
  if (event.button === 0) {
    mouseDown = true;
  }
  if (event.button === 2) {
    mouseDownRight = true;
  }
});

canvas.addEventListener('mouseup', (event) => {
  if (event.button === 0) {
    mouseDown = false;
    onMouseUp();
  }
  if (event.button === 2) {
    mouseDownRight = false;
    onMouseUpRight();
  }
});

canvas.addEventListener('mouseleave', () => {
  mouseDown = false;
  mouseDownRight = false;
});

canvas.addEventListener('wheel', (event) => {
  if (event.deltaY < 0) {
    onScrollUp();
  } else {
    onScrollDown();
  }
});

const keysPressed = {};

document.addEventListener('keypress', (event) => {
  if (!keysPressed[event.key]) {
    keysPressed[event.key] = true;
    onKeyPress(event.key);
  }
});

document.addEventListener('keyup', (event) => {
  keysPressed[event.key] = false;
  onKeyUp(event.key);
});

document.addEventListener('keydown', (event) => {
  onKeyDown(event.key);
});

tick = 0;
