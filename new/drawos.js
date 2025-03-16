let cursorSprite, pointerSprite, moveSprite, grabSprite, grabbingSprite, logoSprite, horizontalSprite, verticalSprite, diagonalSprite, diagonal2Sprite, backgroundSprite, calculatorSprite, sealSprite, sealBgSprite, sealBgSprite2;
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/cursor.png").then(hexArray => {
  cursorSprite = blackToTransparent(hexArray)
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/pointer.png").then(hexArray => {
  pointerSprite = blackToTransparent(hexArray)
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/move.png").then(hexArray => {
  moveSprite = blackToTransparent(hexArray)
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/grab.png").then(hexArray => {
  grabSprite = blackToTransparent(hexArray)
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/grabbing.png").then(hexArray => {
  grabbingSprite = blackToTransparent(hexArray)
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/logo.png").then(hexArray => {
  logoSprite = blackToTransparent(hexArray)
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/horizontal.png").then(hexArray => {
  horizontalSprite = blackToTransparent(hexArray)
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/vertical.png").then(hexArray => {
  verticalSprite = blackToTransparent(hexArray)
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/diagonal.png").then(hexArray => {
  diagonalSprite = blackToTransparent(hexArray)
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/diagonal2.png").then(hexArray => {
  diagonal2Sprite = blackToTransparent(hexArray)
});
// image from jayd from discord
// https://github.com/Jayd-Rubies
// <@913241621288595469>
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/jayd/blue.png").then(hexArray => {
  backgroundSprite = resizeHexArray(hexArray, 256, 144);
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/calculator.png").then(hexArray => {
  calculatorSprite = blackToTransparent(hexArray);
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/seal.png").then(hexArray => {
  sealSprite = blackToTransparent(hexArray);
});
getImageHexArray("https://raw.githubusercontent.com/SquareScreamYT/os/main/images/freepik-seal-beach-dune-island-near-helgoland_475641-180.png").then(hexArray => {
  sealBgSprite = resizeHexArray(hexArray, 255, 144);
});
getImageHexArray("images/1gbp3zm4o7_Harbor_Seal_on_Ice_close_0357_6_11_07.jpg").then(hexArray => {
  sealBgSprite2 = resizeHexArray(hexArray, 255, 144);
});

let drawnLines = [];
let lastTimeUpdate = 0;
let displayTime = '';
let displayDate = '';
currentApp = "desktop";
currentCursor = "cursor";
currentSeal = 0;
let isDragging = false;

const colors = {
  background: hexColor("#343a40"),
  menuBar: hexColor("#495057"),
  text: hexColor("#f8f9fa"),
  taskbar: hexColor("#868e96"),
};

function draw() {
  clearCanvas();

  // dark background / seal background
  if (currentSeal % 3 == 0) { drawRect(0, 0, 255, 144, colors.background, true); }
  if (backgroundSprite && sealBgSprite && sealBgSprite2) {
    if (currentSeal % 3 == 1) { drawSprite(0, 0, sealBgSprite); }
    if (currentSeal % 3 == 2) { drawSprite(0, 0, sealBgSprite2); }
    if (currentSeal % 3 == 0) { drawRect(0, 0, 255, 144, colors.background, true); }
  }

  // blue background
  // if (backgroundSprite) { drawSprite(0, 0, backgroundSprite); }

  // menu bar
  drawRect(0, 0, 255, 9, colors.menuBar, true);
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
  drawText(displayTime, 223, 2, colors.text, "small");
  drawText(displayDate, 175, 2, colors.text, "small");
  // taskbar
  drawRect(64, 132, 191, 143, colors.taskbar, true, 2);

  if (isMouseWithin(66, 134, 66+6, 134+8) || isMouseWithin(180, 134, 180+6, 134+8)) {
    currentCursor = "pointer";
  } else {
    currentCursor = "cursor";
  }
  
  // calculator icon
  if (calculatorSprite) { drawSprite(66, 134, calculatorSprite); }

  // seal icon!! https://discord.com/channels/697450809390268467/697450809847316540/1327822894771863592
  if (sealSprite) { drawSprite(180, 134, sealSprite); }

  if (currentApp == "calculator") {
    calculatorApp();
  }

  if (isDragging && currentApp === "calculator") {
    calculatorState.originx = mouseX - calculatorState.dragOffsetX;
    calculatorState.originy = mouseY - calculatorState.dragOffsetY;
  }

  //for (let line of drawnLines) {
  //  drawLine(line.x1, line.y1, line.x2, line.y2, line.color);
  //}
  if (cursorSprite && currentCursor == "cursor") { drawSprite(mouseX-2, mouseY, cursorSprite); }
  if (pointerSprite && currentCursor == "pointer") { drawSprite(mouseX-2, mouseY, pointerSprite); }
  if (moveSprite && currentCursor == "move") { drawSprite(mouseX-2, mouseY, moveSprite); }
  if (horizontalSprite && currentCursor == "horizontal") { drawSprite(mouseX-2, mouseY, horizontalSprite); }
  if (verticalSprite && currentCursor == "vertical") { drawSprite(mouseX-2, mouseY, verticalSprite); }
  if (diagonalSprite && currentCursor == "diagonal") { drawSprite(mouseX-2, mouseY, diagonalSprite); }
  if (diagonal2Sprite && currentCursor == "diagonal2") { drawSprite(mouseX-2, mouseY, diagonal2Sprite); }
  if (grabSprite && currentCursor == "grab") { drawSprite(mouseX-2, mouseY, grabSprite); }
  if (grabbingSprite && currentCursor == "grabbing") { drawSprite(mouseX-2, mouseY, grabbingSprite); }

  if (mouseDown) {
    onMouseDown();
  }

  if (mouseDownRight) {
    onMouseDownRight();
  }

  onInitialMouseDown();
}

function onMouseDown() {
  if (currentApp === "calculator") {
    const x = calculatorState.originx;
    const y = calculatorState.originy;
    
    if (isMouseWithin(x, y, x + calculatorState.width - 32, y + 12)) {
      isDragging = true;
      currentCursor = "grabbing";
      calculatorState.dragOffsetX = mouseX - x;
      calculatorState.dragOffsetY = mouseY - y;
      return;
    }
  }
  
  drawLine(mouseXoldold, mouseYoldold, mouseX, mouseY, colors.mouse);
  drawnLines.push({
    x1: mouseXoldold,
    y1: mouseYoldold,
    x2: mouseX,
    y2: mouseY,
    color: colors.mouse
  });
}

function onMouseDownRight() {

}

function onMouseUp() {
  isDragging = false;
  if (currentApp === "calculator" && calculatorState.isDragging == true) {
    onCalculatorMouseUp()
  }
}

function onMouseUpRight() {
  
}

function onMouseClick() {
  if (isMouseWithin(66, 134, 66+6, 134+8)) {
    currentApp = "calculator";
  }
  
  if (isMouseWithin(180, 134, 180+6, 134+8)) {
    currentSeal +=1
  }  

  if (currentApp == "calculator") {
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

function gameLoop(timestamp) {
  draw();
  drawPixelmap();
  tick++; 
  mouseXoldold = mouseXold;
  mouseYoldold = mouseYold;
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
