let cursorSprite, pointerSprite, logoSprite;
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/sq-render/main/images/cursor.png").then(hexArray => {
  cursorSprite = blackToTransparent(hexArray)
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/sq-render/main/images/pointer.png").then(hexArray => {
  pointerSprite = blackToTransparent(hexArray)
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/sq-render/main/images/logo.png").then(hexArray => {
  logoSprite = blackToTransparent(hexArray)
});

let drawnLines = [];

function draw() {
  clearCanvas();

  // menu bar
  drawRect(0, 0, 254, 8, "#ced4da", true);
  // logo
  if (cursorSprite) { drawSprite(0, 0, logoSprite); }

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
