let cursorSprite, pointerSprite, logoSprite, backgroundSprite;
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/sq-render/main/images/cursor.png").then(hexArray => {
  cursorSprite = blackToTransparent(hexArray)
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/sq-render/main/images/pointer.png").then(hexArray => {
  pointerSprite = blackToTransparent(hexArray)
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/sq-render/main/images/logo.png").then(hexArray => {
  logoSprite = blackToTransparent(hexArray)
});
// image from jayd from discord
// https://github.com/Jayd-Rubies
// <@913241621288595469>
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/sq-render/main/images/jayd/blue.png").then(hexArray => {
  backgroundSprite = resizeHexArray(hexArray, 256, 144);
});

let drawnLines = [];
let lastTimeUpdate = 0;
let displayTime = '';
let displayDate = '';

function draw() {
  clearCanvas();

  // dark background
  // drawRect(0, 0, 255, 144, "#343a40", true);

  // blue background
  if (backgroundSprite) { drawSprite(0, 0, backgroundSprite); }

  // menu bar
  drawRect(0, 0, 255, 9, "#495057", true);
  // logo
  if (cursorSprite) { drawSprite(1, 1, logoSprite); }
  // time & date
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (currentTimestamp > lastTimeUpdate) {
    const now = new Date();
    displayTime = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    displayDate = now.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
    lastTimeUpdate = currentTimestamp;
  }
  drawText(displayTime, 223, 2, "#f8f9fa", "small");
  drawText(displayDate, 170, 2, "#f8f9fa", "small");



  for (let line of drawnLines) {
    drawLine(line.x1, line.y1, line.x2, line.y2, line.color);
  }

  if (cursorSprite) { drawSprite(mouseX-1, mouseY, cursorSprite); }

  if (mouseDown) {
    onMouseDown();
  }

  if (mouseDownRight) {
    onMouseDownRight();
  }

  onInitialMouseDown();
}


function onMouseDown() {
  drawLine(mouseXoldold, mouseYoldold, mouseX, mouseY, "#ff6b6b");
  
  drawnLines.push({
    x1: mouseXoldold,
    y1: mouseYoldold,
    x2: mouseX,
    y2: mouseY,
    color: "#ff6b6b"
  });
}

function onMouseDownRight() {

}

function onMouseUp() {
  
}

function onMouseUpRight() {
  
}

function onMouseClick() {
  
}

function onMouseClickRight() {
  
}

function onScrollUp() {

}

function onScrollDown() {

}

function onKeyPress(key) {
  console.log(`Key pressed: ${key}`);
  // Add your key press handling logic here
}

function onKeyDown(key) {
  console.log(`Key down: ${key}`);
  // Add your key down handling logic here
}

function onKeyUp(key) {
  console.log(`Key up: ${key}`);
  // Add your key up handling logic here
}

const FPS = 60;
const frameDelay = 1000 / FPS;
let lastFrameTime = 0;

function gameLoop(timestamp) {
  if (timestamp - lastFrameTime > frameDelay) {
    draw();
    drawPixelmap();
    tick++;
    lastFrameTime = timestamp;
    mouseXoldold = mouseXold;
    mouseYoldold = mouseYold;
  }
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
