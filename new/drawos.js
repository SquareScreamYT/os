isTextMode = true
altKeyPressed = false
shiftKeyPressed = false

const colors = {
  background: hexColor("#212529"),
  text: hexColor("#f8f9fa")
};

function draw() {
  clearCanvas();

  if (mouseDown) {
    onMouseDown();
  }

  if (mouseDownRight) {
    onMouseDownRight();
  }

  onInitialMouseDown();
}

function onMouseDown() {

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
  
}

function onKeyDown(key) {
  console.log(`Key down: ${key}`);
  
  if (key === 'Alt') {
    altKeyPressed = true;
  } else if (key === 'Shift') {
    shiftKeyPressed = true;
  }
  
  if (key === 'T' && altKeyPressed && shiftKeyPressed) {
    isTextMode = !isTextMode;
    console.log(`Text mode ${isTextMode ? 'enabled' : 'disabled'}`);
  }
}

function onKeyUp(key) {
  console.log(`Key up: ${key}`);
  
  if (key === 'Alt') {
    altKeyPressed = false;
  } else if (key === 'Shift') {
    shiftKeyPressed = false;
  }
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
