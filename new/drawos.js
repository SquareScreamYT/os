let isTextMode = true;
let altKeyPressed = false;
let shiftKeyPressed = false;
let ctrlKeyPressed = false;

const lineHeight = 8; 
const cursorBlinkRate = 30; 
let cursorBlinkTimer = 0;
let cursorVisible = true;
let cursorX = 0; 
let cursorY = 0; 
let textContent = ["hello"]; 
let maxLineWidth = 240; 

let selectionActive = false;
let selectionStartX = 0;
let selectionStartY = 0;
let selectionEndX = 0;
let selectionEndY = 0;

let scrollOffset = 0; 
let visibleLines = Math.floor(140 / lineHeight); 
const scrollBarWidth = 8; 
const scrollBarColor = hexColor("#adb5bd"); 
const scrollBarBgColor = hexColor("#495057"); 
const scrollThumbMinHeight = 15; 

const colors = {
  background: hexColor("#212529"),
  text: hexColor("#f8f9fa"),
  cursor: hexColor("#f8f9fa"),
  selection: hexColor("#495057"),
  selectedText: hexColor("#f8f9fa")
};

function measureTextWidth(text) {

  return text.length * 6;
}

function getNormalizedSelection() {

  if (selectionStartY > selectionEndY || 
      (selectionStartY === selectionEndY && selectionStartX > selectionEndX)) {
    return {
      startX: selectionEndX,
      startY: selectionEndY,
      endX: selectionStartX,
      endY: selectionStartY
    };
  } else {
    return {
      startX: selectionStartX,
      startY: selectionStartY,
      endX: selectionEndX,
      endY: selectionEndY
    };
  }
}

function isLineSelected(lineIndex) {
  if (!selectionActive) return false;

  const { startY, endY } = getNormalizedSelection();

  return lineIndex >= startY && lineIndex <= endY;
}

function ensureCursorVisible() {
  if (cursorY < scrollOffset) {

    scrollOffset = cursorY;
  } else if (cursorY >= scrollOffset + visibleLines) {

    scrollOffset = cursorY - visibleLines + 1;
  }

  scrollOffset = Math.max(0, Math.min(scrollOffset, textContent.length - visibleLines));
}

function isLineSelected(lineIndex) {
  if (!selectionActive) return false;

  const { startY, endY } = getNormalizedSelection();

  return lineIndex >= startY && lineIndex <= endY;
}

function draw() {
  clearCanvas();

  if (isTextMode) {

    drawRect(0, 0, 255, 143, colors.background, true);

    const startLine = scrollOffset;
    const endLine = Math.min(startLine + visibleLines, textContent.length);

    for (let i = startLine; i < endLine; i++) {
      const line = textContent[i];
      const displayY = 4 + (i - startLine) * lineHeight; 

      if (selectionActive && isLineSelected(i)) {

        const { startY, startX, endY, endX } = getNormalizedSelection();
        const lineStartX = i === startY ? startX : 0;
        const lineEndX = i === endY ? endX : line.length;

        if (lineStartX > 0) {
          drawText(line.substring(0, lineStartX), 4, displayY, colors.text);
        }

        const preSelectionWidth = measureTextWidth(line.substring(0, lineStartX));
        const selectionWidth = measureTextWidth(line.substring(lineStartX, lineEndX));
        drawRect(4 + preSelectionWidth, displayY, 
                 4 + preSelectionWidth + selectionWidth, displayY + lineHeight - 1, 
                 colors.selection, true);

        drawText(line.substring(lineStartX, lineEndX), 4 + preSelectionWidth, displayY, colors.selectedText);

        if (lineEndX < line.length) {
          const postSelectionWidth = preSelectionWidth + selectionWidth;
          drawText(line.substring(lineEndX), 4 + postSelectionWidth, displayY, colors.text);
        }
      } else {

        drawText(line, 4, displayY, colors.text);
      }
    }

    if (textContent.length > visibleLines) {

      drawRect(WIDTH - scrollBarWidth, 0, WIDTH, HEIGHT, scrollBarBgColor, true);

      const contentHeight = textContent.length;
      const viewportRatio = Math.min(1, visibleLines / contentHeight);
      const thumbHeight = Math.max(scrollThumbMinHeight, HEIGHT * viewportRatio);
      const scrollRatio = scrollOffset / Math.max(1, contentHeight - visibleLines);
      const thumbY = scrollRatio * (HEIGHT - thumbHeight);

      drawRect(WIDTH - scrollBarWidth, thumbY, WIDTH, thumbY + thumbHeight, scrollBarColor, true);
    }

    if (!selectionActive && cursorVisible && (tick % (cursorBlinkRate * 2)) < cursorBlinkRate) {

      if (cursorY >= scrollOffset && cursorY < scrollOffset + visibleLines) {

        const lineText = textContent[cursorY] || "";
        let cursorPosX = 4;

        if (cursorX > 0) {
          const textBeforeCursor = lineText.substring(0, cursorX);
          cursorPosX += measureTextWidth(textBeforeCursor);
        }

        const displayY = 4 + (cursorY - scrollOffset) * lineHeight;
        drawLine(cursorPosX, displayY, 
                 cursorPosX, displayY + 7, 
                 colors.cursor);
      }
    }
  }

  if (mouseDown) {
    onMouseDown();
  }

  if (mouseDownRight) {
    onMouseDownRight();
  }

  onInitialMouseDown();
}

function isLineSelected(lineIndex) {
  if (!selectionActive) return false;

  const [startY, endY] = selectionStartY <= selectionEndY 
    ? [selectionStartY, selectionEndY] 
    : [selectionEndY, selectionStartY];

  return lineIndex >= startY && lineIndex <= endY;
}

function getNormalizedSelection() {
  if (selectionStartY < selectionEndY || 
      (selectionStartY === selectionEndY && selectionStartX <= selectionEndX)) {
    return {
      startY: selectionStartY,
      startX: selectionStartX,
      endY: selectionEndY,
      endX: selectionEndX
    };
  } else {
    return {
      startY: selectionEndY,
      startX: selectionEndX,
      endY: selectionStartY,
      endX: selectionStartX
    };
  }
}

function measureTextWidth(text) {
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const fontArray = sqpixelsArray[char];
    if (!fontArray) continue;

    let charWidth = 0;
    for (let row = 0; row < fontArray.length - 2; row++) {
      const pixels = fontArray[row];
      for (let col = pixels.length - 1; col >= 4; col--) {
        if (pixels[col] === '.') {
          charWidth = Math.max(charWidth, col - 4);
        }
      }
    }
    width += charWidth + 2;
  }
  return width;
}

function onMouseDown() {

  if (isTextMode) {

    if (textContent.length > visibleLines && mouseX >= WIDTH - scrollBarWidth) {

      const contentHeight = textContent.length;
      const viewportRatio = Math.min(1, visibleLines / contentHeight);
      const thumbHeight = Math.max(scrollThumbMinHeight, HEIGHT * viewportRatio);

      const availableScrollSpace = HEIGHT - thumbHeight;
      const clickPosition = mouseY / availableScrollSpace;
      scrollOffset = Math.floor(clickPosition * (contentHeight - visibleLines));

      scrollOffset = Math.max(0, Math.min(scrollOffset, contentHeight - visibleLines));
      return;
    }

    const lineIndex = Math.floor((mouseY - 4) / lineHeight) + scrollOffset;
    if (lineIndex >= 0 && lineIndex < textContent.length) {

      const line = textContent[lineIndex];
      let bestPos = 0;
      let bestDistance = Infinity;

      for (let i = 0; i <= line.length; i++) {
        const textWidth = measureTextWidth(line.substring(0, i));
        const charX = 4 + textWidth;
        const distance = Math.abs(mouseX - charX);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestPos = i;
        }
      }

      if (shiftKeyPressed) {
        if (!selectionActive) {

          selectionActive = true;
          selectionStartX = cursorX;
          selectionStartY = cursorY;
        }

        selectionEndX = bestPos;
        selectionEndY = lineIndex;
      } else {

        selectionActive = false;
        cursorY = lineIndex;
        cursorX = bestPos;

        selectionStartX = bestPos;
        selectionStartY = lineIndex;
      }

      ensureCursorVisible();
    }
  }
}

function ensureCursorVisible() {
  if (cursorY < scrollOffset) {

    scrollOffset = cursorY;
  } else if (cursorY >= scrollOffset + visibleLines) {

    scrollOffset = cursorY - visibleLines + 1;
  }

  scrollOffset = Math.max(0, Math.min(scrollOffset, textContent.length - visibleLines));
}

function onMouseDownRight() {

}

function onMouseUp() {

  if (selectionActive) {
    const { startX, startY, endX, endY } = getNormalizedSelection();
    if (startX === endX && startY === endY) {
      selectionActive = false;
    }
  }
}

function onMouseUpRight() {

}

function onMouseClick() {

}

function onMouseClickRight() {

}

function onScrollUp() {
  if (isTextMode && textContent.length > visibleLines) {

    scrollOffset = Math.max(0, scrollOffset - 1);
  }
}

function onScrollDown() {
  if (isTextMode && textContent.length > visibleLines) {

    scrollOffset = Math.min(textContent.length - visibleLines, scrollOffset + 1);
  }
}

function onKeyPress(key) {
  if (isTextMode && key.length === 1) {

    if (selectionActive) {
      deleteSelection();
      selectionActive = false; 
    }

    insertTextAtCursor(key);
  }
}

function onKeyDown(key) {

  if (key === 'Alt') {
    altKeyPressed = true;
  } else if (key === 'Shift') {
    shiftKeyPressed = true;
  } else if (key === 'Control') {
    ctrlKeyPressed = true;
  }

  if (isTextMode && ctrlKeyPressed) {
    if (key === 'a') {

      selectionActive = true;
      selectionStartX = 0;
      selectionStartY = 0;
      selectionEndX = textContent[textContent.length - 1].length;
      selectionEndY = textContent.length - 1;
      return; 
    } 
    else if (key === 'c') {
      if (selectionActive) {

        const selectedText = getSelectedText();
        if (selectedText) {
          navigator.clipboard.writeText(selectedText).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        }
      }
      return; 
    }
    else if (key === 'v') {

      navigator.clipboard.readText().then(text => {
        if (selectionActive) {
          deleteSelection();
        }
        insertTextAtCursor(text);
      }).catch(err => {
        console.error('Failed to paste text: ', err);
      });
      return; 
    }
    else if (key === 'x') {
      if (selectionActive) {

        const selectedText = getSelectedText();
        if (selectedText) {
          navigator.clipboard.writeText(selectedText).then(() => {
            deleteSelection();
          }).catch(err => {
            console.error('Failed to cut text: ', err);
          });
        }
      }
      return; 
    }
  }

  if (key === 'T' && altKeyPressed && shiftKeyPressed) {
    isTextMode = !isTextMode;
    console.log(`Text mode ${isTextMode ? 'enabled' : 'disabled'}`);
    return;
  }

  if (isTextMode) {
    handleTextEditorKeys(key);
  }
}

function onKeyUp(key) {
  if (key === 'Alt') {
    altKeyPressed = false;
  } else if (key === 'Shift') {
    shiftKeyPressed = false;
  } else if (key === 'Control') {
    ctrlKeyPressed = false;
  }
}

function handleTextEditorKeys(key) {
  switch (key) {
    case 'Escape':

      if (selectionActive) {
        const { endX, endY } = getNormalizedSelection();
        cursorX = endX;
        cursorY = endY;
        selectionActive = false;
      }
      break;

    case 'ArrowLeft':
      if (shiftKeyPressed) {

        if (!selectionActive) {
          selectionActive = true;
          selectionStartX = cursorX;
          selectionStartY = cursorY;
        }

        if (cursorX > 0) {
          cursorX--;
        } else if (cursorY > 0) {
          cursorY--;
          cursorX = textContent[cursorY].length;
        }

        selectionEndX = cursorX;
        selectionEndY = cursorY;
      } else {

        if (selectionActive) {
          const { startX, startY } = getNormalizedSelection();
          cursorX = startX;
          cursorY = startY;
          selectionActive = false;
        } else {

          if (cursorX > 0) {
            cursorX--;
          } else if (cursorY > 0) {
            cursorY--;
            cursorX = textContent[cursorY].length;
          }
        }
      }
      break;

    case 'ArrowRight':
      if (shiftKeyPressed) {

        if (!selectionActive) {
          selectionActive = true;
          selectionStartX = cursorX;
          selectionStartY = cursorY;
        }

        if (cursorX < textContent[cursorY].length) {
          cursorX++;
        } else if (cursorY < textContent.length - 1) {
          cursorY++;
          cursorX = 0;
        }

        selectionEndX = cursorX;
        selectionEndY = cursorY;
      } else {

        if (selectionActive) {
          const { endX, endY } = getNormalizedSelection();
          cursorX = endX;
          cursorY = endY;
          selectionActive = false;
        } else {

          if (cursorX < textContent[cursorY].length) {
            cursorX++;
          } else if (cursorY < textContent.length - 1) {
            cursorY++;
            cursorX = 0;
          }
        }
      }
      break;

    case 'ArrowUp':
      if (shiftKeyPressed) {

        if (!selectionActive) {
          selectionActive = true;
          selectionStartX = cursorX;
          selectionStartY = cursorY;
        }

        if (cursorY > 0) {
          cursorY--;
          cursorX = Math.min(cursorX, textContent[cursorY].length);
        }

        selectionEndX = cursorX;
        selectionEndY = cursorY;
      } else {

        selectionActive = false;

        if (cursorY > 0) {
          cursorY--;
          cursorX = Math.min(cursorX, textContent[cursorY].length);
        }
      }
      break;

    case 'ArrowDown':
      if (shiftKeyPressed) {

        if (!selectionActive) {
          selectionActive = true;
          selectionStartX = cursorX;
          selectionStartY = cursorY;
        }

        if (cursorY < textContent.length - 1) {
          cursorY++;
          cursorX = Math.min(cursorX, textContent[cursorY].length);
        }

        selectionEndX = cursorX;
        selectionEndY = cursorY;
      } else {

        selectionActive = false;

        if (cursorY < textContent.length - 1) {
          cursorY++;
          cursorX = Math.min(cursorX, textContent[cursorY].length);
        }
      }
      break;

    case 'Enter':
      if (selectionActive) {
        deleteSelection();
      }
      insertNewLine();
      break;

    case 'Backspace':
      if (selectionActive) {
        deleteSelection();
      } else {
        deleteCharAtCursor();
      }
      break;

    case 'Delete':
      if (selectionActive) {
        deleteSelection();
      } else {
        deleteCharAfterCursor();
      }
      break;

    case 'Home':
      if (shiftKeyPressed) {

        if (!selectionActive) {
          selectionActive = true;
          selectionStartX = cursorX;
          selectionStartY = cursorY;
        }

        cursorX = 0;

        selectionEndX = cursorX;
        selectionEndY = cursorY;
      } else {

        selectionActive = false;
        cursorX = 0;
      }
      break;

    case 'End':
      if (shiftKeyPressed) {

        if (!selectionActive) {
          selectionActive = true;
          selectionStartX = cursorX;
          selectionStartY = cursorY;
        }

        cursorX = textContent[cursorY].length;

        selectionEndX = cursorX;
        selectionEndY = cursorY;
      } else {

        selectionActive = false;
        cursorX = textContent[cursorY].length;
      }
      break;

    case 'a':

      break;

    case 'c':

      break;

    case 'v':

      break;

    case 'x':

      break;
  }

  ensureCursorVisible();

  cursorVisible = true;
  cursorBlinkTimer = 0;
}

  function gettext() {
    if (!selectionActive) return '';

    const { startY, startX, endY, endX } = getNormalizedSelection();

    if (startY === endY) {

      return textContent[startY].substring(startX, endX);
    } else {

      let text = textContent[startY].substring(startX);

      for (let i = startY + 1; i < endY; i++) {
        text += '\n' + textContent[i];
      }

      text += '\n' + textContent[endY].substring(0, endX);
      return text;
    }
  }

  function deleteSelection() {
    if (!selectionActive) return;

    const { startY, startX, endY, endX } = getNormalizedSelection();

    if (startY === endY) {

      const line = textContent[startY];
      textContent[startY] = line.substring(0, startX) + line.substring(endX);
    } else {

      const startLine = textContent[startY];
      const endLine = textContent[endY];

      textContent[startY] = startLine.substring(0, startX) + endLine.substring(endX);

      textContent.splice(startY + 1, endY - startY);
    }

    cursorX = startX;
    cursorY = startY;

    selectionActive = false;

    ensureCursorVisible();
  }

  function insertTextAtCursor(text) {

    if (text.includes('\n')) {
      const lines = text.split('\n');

      const currentLine = textContent[cursorY];
      textContent[cursorY] = currentLine.substring(0, cursorX) + lines[0];

      for (let i = 1; i < lines.length - 1; i++) {
        textContent.splice(cursorY + i, 0, lines[i]);
      }

      if (lines.length > 1) {
        const lastLineIndex = cursorY + lines.length - 1;
        textContent.splice(lastLineIndex, 0, lines[lines.length - 1] + currentLine.substring(cursorX));

        cursorY = lastLineIndex;
        cursorX = lines[lines.length - 1].length;
      } else {

        cursorX = textContent[cursorY].length;
      }

      for (let i = cursorY; i >= cursorY - lines.length + 1; i--) {
        if (i >= 0 && measureTextWidth(textContent[i]) > maxLineWidth) {
          wrapLineByWidth(i);
        }
      }
    } else {

      const currentLine = textContent[cursorY];
      const newLine = currentLine.substring(0, cursorX) + text + currentLine.substring(cursorX);
      textContent[cursorY] = newLine;
      cursorX += text.length;

      if (measureTextWidth(newLine) > maxLineWidth) {
        wrapLineByWidth(cursorY);
      }
    }

    ensureCursorVisible();
  }

  function insertNewLine() {
    const currentLine = textContent[cursorY];
    const textBeforeCursor = currentLine.substring(0, cursorX);
    const textAfterCursor = currentLine.substring(cursorX);

    textContent[cursorY] = textBeforeCursor;
    textContent.splice(cursorY + 1, 0, textAfterCursor);

    cursorY++;
    cursorX = 0;

    ensureCursorVisible();
  }

  function deleteCharAtCursor() {
    const currentLine = textContent[cursorY];

    if (cursorX > 0) {

      textContent[cursorY] = currentLine.substring(0, cursorX - 1) + currentLine.substring(cursorX);
      cursorX--;
    } else if (cursorY > 0) {

      const previousLine = textContent[cursorY - 1];
      cursorX = previousLine.length;
      textContent[cursorY - 1] = previousLine + currentLine;
      textContent.splice(cursorY, 1);
      cursorY--;

      if (measureTextWidth(textContent[cursorY]) > maxLineWidth) {
        wrapLineByWidth(cursorY);
      }
    }

    ensureCursorVisible();
  }

  function deleteCharAfterCursor() {
    const currentLine = textContent[cursorY];

    if (cursorX < currentLine.length) {

      textContent[cursorY] = currentLine.substring(0, cursorX) + currentLine.substring(cursorX + 1);
    } else if (cursorY < textContent.length - 1) {

      const nextLine = textContent[cursorY + 1];
      textContent[cursorY] = currentLine + nextLine;
      textContent.splice(cursorY + 1, 1);

      if (measureTextWidth(textContent[cursorY]) > maxLineWidth) {
        wrapLineByWidth(cursorY);
      }
    }

    ensureCursorVisible();
  }

  function wrapLineByWidth(lineIndex) {
    const line = textContent[lineIndex];

    let breakPoint = line.length;
    for (let i = 1; i <= line.length; i++) {
      if (measureTextWidth(line.substring(0, i)) > maxLineWidth) {
        breakPoint = i - 1;
        break;
      }
    }

    if (breakPoint === 0) breakPoint = 1;

    for (let i = breakPoint; i > 0; i--) {
      if (line[i] === ' ') {
        breakPoint = i;
        break;
      }
    }

    const firstPart = line.substring(0, breakPoint);
    const secondPart = line.substring(breakPoint).trimStart(); 

    textContent[lineIndex] = firstPart;
    textContent.splice(lineIndex + 1, 0, secondPart);

    if (cursorY === lineIndex && cursorX >= breakPoint) {
      cursorY++;
      cursorX = cursorX - breakPoint;

      if (line[breakPoint] === ' ') {
        cursorX = Math.max(0, cursorX - (line.length - secondPart.length - breakPoint));
      }
    }

    if (selectionActive) {
      if (selectionStartY === lineIndex && selectionStartX > breakPoint) {
        selectionStartY++;
        selectionStartX = selectionStartX - breakPoint;
        if (line[breakPoint] === ' ') {
          selectionStartX = Math.max(0, selectionStartX - (line.length - secondPart.length - breakPoint));
        }
      }

      if (selectionEndY === lineIndex && selectionEndX > breakPoint) {
        selectionEndY++;
        selectionEndX = selectionEndX - breakPoint;
        if (line[breakPoint] === ' ') {
          selectionEndX = Math.max(0, selectionEndX - (line.length - secondPart.length - breakPoint));
        }
      }
    }

    if (measureTextWidth(secondPart) > maxLineWidth) {
      wrapLineByWidth(lineIndex + 1);
    }
  }

  function gameLoop(timestamp) {
    draw();
    drawPixelmap();
    tick++; 

    cursorBlinkTimer++;
    if (cursorBlinkTimer >= cursorBlinkRate) {
      cursorVisible = !cursorVisible;
      cursorBlinkTimer = 0;
    }

    mouseXoldold = mouseXold;
    mouseYoldold = mouseYold;
    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);