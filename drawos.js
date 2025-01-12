let cursorSprite, pointerSprite, logoSprite, backgroundSprite, calculatorSprite, sealSprite;
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/cursor.png").then(hexArray => {
  cursorSprite = blackToTransparent(hexArray)
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/pointer.png").then(hexArray => {
  pointerSprite = blackToTransparent(hexArray)
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/logo.png").then(hexArray => {
  logoSprite = blackToTransparent(hexArray)
});
// image from jayd from discord
// https://github.com/Jayd-Rubies
// <@913241621288595469>
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/jayd/blue.png").then(hexArray => {
  backgroundSprite = resizeHexArray(hexArray, 256, 144);
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/calculator.png").then(hexArray => {
  calculatorSprite =blackToTransparent(hexArray);
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/seal.png").then(hexArray => {
  sealSprite =blackToTransparent(hexArray);
});

let drawnLines = [];
let lastTimeUpdate = 0;
let displayTime = '';
let displayDate = '';
currentApp = "desktop";
currentCursor = "cursor";

function draw() {
  clearCanvas();

  // dark background
  drawRect(0, 0, 255, 144, "#343a40", true);

  // blue background
  // if (backgroundSprite) { drawSprite(0, 0, backgroundSprite); }

  // menu bar
  drawRect(0, 0, 255, 9, "#495057", true);
  // logo
  if (logoSprite) { drawSprite(1, 1, logoSprite); }
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
    displayDate = now.toLocaleDateString('en-UK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).toUpperCase();
    lastTimeUpdate = currentTimestamp;
  }
  drawText(displayTime, 223, 2, "#f8f9fa", "small");
  drawText(displayDate, 175, 2, "#f8f9fa", "small");
  // taskbar
  drawRect(64, 132, 191, 143, "#868e96", true, 2);

  if (isMouseWithin(66, 134, 66+6, 134+8)) {
    currentCursor = "pointer";
  } else {
    currentCursor = "cursor";
  }

  if (currentApp == "calculator") {
    calculatorApp();
  }

  // calculator icon
  if (calculatorSprite) { drawSprite(66, 134, calculatorSprite); }

  // seal icon!! https://discord.com/channels/697450809390268467/697450809847316540/1327822894771863592
  if (sealSprite) { drawSprite(100, 134, sealSprite); }

  //for (let line of drawnLines) {
  //  drawLine(line.x1, line.y1, line.x2, line.y2, line.color);
  //}
  if (cursorSprite && currentCursor == "cursor") { drawSprite(mouseX-2, mouseY, cursorSprite); }
  if (pointerSprite && currentCursor == "pointer") { drawSprite(mouseX-2, mouseY, pointerSprite); }

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
  if (isMouseWithin(66, 134, 66+6, 134+8)) {
    currentApp = "calculator";
  }

  if ( currentApp == "calculator") {
    onCalculatorMouseClick();
  }
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
let tpsCounter = 0;
let lastTpsUpdate = Date.now();
let currentTps = 0;

function gameLoop(timestamp) {
  if (timestamp - lastFrameTime > frameDelay) {
    draw();
    drawPixelmap();
    tick++;
    tpsCounter++;
    
    if (Date.now() - lastTpsUpdate >= 1000) {
      currentTps = tpsCounter;
      console.log(`Current TPS: ${currentTps}`);
      tpsCounter = 0;
      lastTpsUpdate = Date.now();
    }
    
    lastFrameTime = timestamp;
    mouseXoldold = mouseXold;
    mouseYoldold = mouseYold;
  }
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
