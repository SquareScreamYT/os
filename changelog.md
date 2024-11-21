# sqRender Changelog

## 1.0.0
- 256 x 144 canvas
- Added:
  - setPixel() 
  - getPixel()
  - drawLine()
  - drawRect()
  - drawEllipse()
  - drawQuad() 
  - drawTriangle() 
  - checkIntersection()
  - drawPolygon() 
  - drawSprite()
  - getImageHexArray()
  - resizeHexArray()
  - draw() 

## 1.0.1
- Added: 
  - mouseX
  - mouseY
  - onMouseDown()
  - onMouseDownRight()
  - onScrollUp()
  - onScrollDown()
  - drawText()
Changed:
  - drawing functions are now in draw.js
  - change example function colors

## 1.0.2
- Added:
  - onMouseUp()
  - onMouseUpRight()
  - onMouseClick()
  - onMouseClickRight()
  - clearCanvas()
  - tick
- Changed:
  - tps is now 20

## 1.0.3
- Changed:
  - tps is now 40
  - faster rendering

## 1.0.4
- Changed:
  - tps is now 60
  - updates only changed pixels
  - isMouseWithin()