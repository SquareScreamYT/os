testSprite = [
  ["#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b"],
  ["#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b"],
  ["#ff6b6b", "#ff6b6b", "#339af0", "#339af0", "#ff6b6b", "#ff6b6b"],
  ["#ff6b6b", "#ff6b6b", "#339af0", "#339af0", "#ff6b6b", "#ff6b6b"],
  ["#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b"],
  ["#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b", "#ff6b6b"]
];

let USASprite, UKSprite, rickroll;
getImageHexArray("https://raw.githubusercontent.com/R74nCom/R74n-Main/main/pixelflags/png/country/united_states.png").then(hexArray => {
  USASprite = hexArray
});
getImageHexArray("https://raw.githubusercontent.com/R74nCom/R74n-Main/main/pixelflags/png/country/united_kingdom.png").then(hexArray => {
  UKSprite = hexArray
});
getImageHexArray("https://i.imgur.com/UniMfif.png").then(hexArray => {
  rickroll = resizeHexArray(hexArray, 50, 50);
});

function draw() {
  clearCanvas();
  drawRect(3, 3, 10, 10, "#343a40", true);
  drawEllipse(10, 10, 80, 80, "#22b8cf", true);
  drawLine(80, 80, 90, 120, "#51cf66");
  drawQuad(100, 10, 150, 20, 140, 50, 115, 40, "#51cf66", true);
  drawTriangle(120, 75, 200, 50, 150, 100, "#fcc419", true);
  drawPolygon([[200, 20], [210,3], [220,6], [230, 50], [215, 70]], "#ff922b", true);
  drawSprite(20, 25, testSprite);
  drawText("Hello, world! ǙķǄƺȹⱲ", 10, 133, "#343a40");
  drawText("Tick: " + tick + " X: " + mouseX + " Y: " + mouseY, 10, 120, "#343a40");
  if (rickroll) drawSprite(200, 80, rickroll);
  if (USASprite) drawSprite(10, 100, USASprite);
  if (UKSprite) drawSprite(50, 100, UKSprite);

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

const FPS = 60;
const frameDelay = 1000 / FPS;
let lastFrameTime = 0;

function gameLoop(timestamp) {
  if (timestamp - lastFrameTime > frameDelay) {
    draw();
    drawPixelmap();
    tick++;
    lastFrameTime = timestamp;
  }
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
