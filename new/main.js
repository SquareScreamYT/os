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
  const [newMouseX, newMouseY] = getMousePos(event);
  
  // Handle scroll bar dragging
  if (mouseDown && isTextMode && textContent.length > visibleLines) {
    if (mouseXold >= WIDTH - scrollBarWidth) {
      // We're dragging the scroll bar
      const contentHeight = textContent.length;
      const availableScrollSpace = HEIGHT;
      const dragRatio = newMouseY / availableScrollSpace;
      scrollOffset = Math.floor(dragRatio * (contentHeight - visibleLines));
      
      // Clamp scroll offset
      scrollOffset = Math.max(0, Math.min(scrollOffset, contentHeight - visibleLines));
      
      mouseX = newMouseX;
      mouseY = newMouseY;
      mouseXold = mouseX;
      mouseYold = mouseY;
      return;
    }
  }
  
  // Handle text selection while dragging
  if (mouseDown && isTextMode) {
    const lineIndex = Math.floor((newMouseY - 4) / lineHeight) + scrollOffset;
    if (lineIndex >= 0 && lineIndex < textContent.length) {
      // Find closest character position
      const line = textContent[lineIndex];
      let bestPos = 0;
      let bestDistance = Infinity;
      
      for (let i = 0; i <= line.length; i++) {
        const textWidth = measureTextWidth(line.substring(0, i));
        const charX = 4 + textWidth;
        const distance = Math.abs(newMouseX - charX);
        
        if (distance < bestDistance) {
          bestDistance = distance;
          bestPos = i;
        }
      }
      
      // Only activate selection if we've moved from the initial position
      if (Math.abs(selectionStartX - bestPos) > 0 || selectionStartY !== lineIndex) {
        if (!selectionActive) {
          selectionActive = true;
        }
        selectionEndX = bestPos;
        selectionEndY = lineIndex;
      }
      
      // Also update cursor position
      cursorX = bestPos;
      cursorY = lineIndex;
      
      // Auto-scroll when selecting text near the edges
      if (newMouseY < 20) {
        // Auto-scroll up
        scrollOffset = Math.max(0, scrollOffset - 1);
      } else if (newMouseY > HEIGHT - 20) {
        // Auto-scroll down
        scrollOffset = Math.min(textContent.length - visibleLines, scrollOffset + 1);
      }
    }
  }
  
  mouseXold = mouseX;
  mouseYold = mouseY;
  mouseX = newMouseX;
  mouseY = newMouseY;
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

// Track key states
const keysDown = new Set();

document.addEventListener('keydown', (event) => {
  // Update modifier key states directly from the event
  altKeyPressed = event.altKey;
  shiftKeyPressed = event.shiftKey;
  ctrlKeyPressed = event.ctrlKey;
  
  // Prevent default browser actions for keyboard shortcuts we're handling
  if ((event.key === 'a' || event.key === 'c' || event.key === 'v' || event.key === 'x') && event.ctrlKey) {
    event.preventDefault();
    
    // Handle shortcuts directly here
    if (isTextMode) {
      if (event.key === 'a') {
        // Select all text
        selectionActive = true;
        selectionStartX = 0;
        selectionStartY = 0;
        selectionEndX = textContent[textContent.length - 1].length;
        selectionEndY = textContent.length - 1;
      } 
      else if (event.key === 'c' && selectionActive) {
        // Copy selected text to clipboard
        const selectedText = getSelectedText();
        if (selectedText) {
          navigator.clipboard.writeText(selectedText).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        }
      }
      else if (event.key === 'v') {
        // Paste from clipboard
        navigator.clipboard.readText().then(text => {
          if (selectionActive) {
            deleteSelection();
          }
          insertTextAtCursor(text);
        }).catch(err => {
          console.error('Failed to paste text: ', err);
        });
      }
      else if (event.key === 'x' && selectionActive) {
        // Cut selected text to clipboard
        const selectedText = getSelectedText();
        if (selectedText) {
          navigator.clipboard.writeText(selectedText).then(() => {
            deleteSelection();
          }).catch(err => {
            console.error('Failed to cut text: ', err);
          });
        }
      }
    }
    return;
  }
  
  // For non-shortcut keys, call our handler
  onKeyDown(event.key);
});

document.addEventListener('keyup', (event) => {
  // Remove key from the set of pressed keys
  keysDown.delete(event.key);
  
  // Call our handler
  onKeyUp(event.key);
});

document.addEventListener('keypress', (event) => {
  // Only handle printable characters and not if control is pressed
  if (event.key.length === 1 && !event.ctrlKey && !keysDown.has('Control')) {
    onKeyPress(event.key);
  }
});

// Add a window blur event to reset key states when focus is lost
window.addEventListener('blur', () => {
  keysDown.clear();
  altKeyPressed = false;
  shiftKeyPressed = false;
  ctrlKeyPressed = false;
});


tick = 0;
