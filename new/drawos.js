// Initialize variables at the top of the file
let isTextMode = true;
let altKeyPressed = false;
let shiftKeyPressed = false;
let ctrlKeyPressed = false;

// Text editor variables
const lineHeight = 8; // Height of each line in pixels
const cursorBlinkRate = 30; // Cursor blink rate in frames
let cursorBlinkTimer = 0;
let cursorVisible = true;
let cursorX = 0; // Cursor X position (in characters)
let cursorY = 0; // Cursor Y position (in lines)
let textContent = ["hello"]; // Initial text content
let maxLineWidth = 240; // Maximum line width in pixels

// Selection variables
let selectionActive = false;
let selectionStartX = 0;
let selectionStartY = 0;
let selectionEndX = 0;
let selectionEndY = 0;

// Scroll variables
let scrollOffset = 0; // Current scroll position (in lines)
let visibleLines = Math.floor(140 / lineHeight); // Number of visible lines
const scrollBarWidth = 8; // Width of the scroll bar in pixels
const scrollBarColor = hexColor("#adb5bd"); // Color of the scroll bar
const scrollBarBgColor = hexColor("#495057"); // Background color of the scroll bar track
const scrollThumbMinHeight = 15; // Minimum height of scroll thumb in pixels

// Colors
const colors = {
  background: hexColor("#212529"),
  text: hexColor("#f8f9fa"),
  cursor: hexColor("#f8f9fa"),
  selection: hexColor("#495057"),
  selectedText: hexColor("#f8f9fa")
};

// Helper function to measure text width
function measureTextWidth(text) {
  // Simple approximation: each character is about 6 pixels wide
  return text.length * 6;
}

// Helper function to get normalized selection coordinates
function getNormalizedSelection() {
  // Ensure start is before end
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

// Helper function to check if a line is within selection
function isLineSelected(lineIndex) {
  if (!selectionActive) return false;
  
  // Normalize selection coordinates
  const { startY, endY } = getNormalizedSelection();
  
  return lineIndex >= startY && lineIndex <= endY;
}

// Function to ensure cursor is visible by scrolling if needed
function ensureCursorVisible() {
  if (cursorY < scrollOffset) {
    // Cursor is above visible area, scroll up
    scrollOffset = cursorY;
  } else if (cursorY >= scrollOffset + visibleLines) {
    // Cursor is below visible area, scroll down
    scrollOffset = cursorY - visibleLines + 1;
  }
  
  // Clamp scroll offset
  scrollOffset = Math.max(0, Math.min(scrollOffset, textContent.length - visibleLines));
}

function isLineSelected(lineIndex) {
  if (!selectionActive) return false;
  
  // Normalize selection coordinates
  const { startY, endY } = getNormalizedSelection();
  
  return lineIndex >= startY && lineIndex <= endY;
}

function draw() {
  clearCanvas();

  if (isTextMode) {
    // Draw background
    drawRect(0, 0, 255, 143, colors.background, true);
    
    // Calculate visible range based on scroll offset
    const startLine = scrollOffset;
    const endLine = Math.min(startLine + visibleLines, textContent.length);
    
    // Draw text content with selection
    for (let i = startLine; i < endLine; i++) {
      const line = textContent[i];
      const displayY = 4 + (i - startLine) * lineHeight; // Adjust y position based on scroll
      
      if (selectionActive && isLineSelected(i)) {
        // This line has selection
        const { startY, startX, endY, endX } = getNormalizedSelection();
        const lineStartX = i === startY ? startX : 0;
        const lineEndX = i === endY ? endX : line.length;
        
        // Draw text before selection
        if (lineStartX > 0) {
          drawText(line.substring(0, lineStartX), 4, displayY, colors.text);
        }
        
        // Draw selection background
        const preSelectionWidth = measureTextWidth(line.substring(0, lineStartX));
        const selectionWidth = measureTextWidth(line.substring(lineStartX, lineEndX));
        drawRect(4 + preSelectionWidth, displayY, 
                 4 + preSelectionWidth + selectionWidth, displayY + lineHeight - 1, 
                 colors.selection, true);
        
        // Draw selected text
        drawText(line.substring(lineStartX, lineEndX), 4 + preSelectionWidth, displayY, colors.selectedText);
        
        // Draw text after selection
        if (lineEndX < line.length) {
          const postSelectionWidth = preSelectionWidth + selectionWidth;
          drawText(line.substring(lineEndX), 4 + postSelectionWidth, displayY, colors.text);
        }
      } else {
        // No selection on this line
        drawText(line, 4, displayY, colors.text);
      }
    }
    
    // Draw scroll bar if needed
    if (textContent.length > visibleLines) {
      // Draw scroll bar background
      drawRect(WIDTH - scrollBarWidth, 0, WIDTH, HEIGHT, scrollBarBgColor, true);
      
      // Calculate scroll thumb position and size
      const contentHeight = textContent.length;
      const viewportRatio = Math.min(1, visibleLines / contentHeight);
      const thumbHeight = Math.max(scrollThumbMinHeight, HEIGHT * viewportRatio);
      const scrollRatio = scrollOffset / Math.max(1, contentHeight - visibleLines);
      const thumbY = scrollRatio * (HEIGHT - thumbHeight);
      
      // Draw scroll thumb
      drawRect(WIDTH - scrollBarWidth, thumbY, WIDTH, thumbY + thumbHeight, scrollBarColor, true);
    }
    
    // Draw blinking cursor (only if no selection or at selection end)
    if (!selectionActive && cursorVisible && (tick % (cursorBlinkRate * 2)) < cursorBlinkRate) {
      // Only draw cursor if it's in the visible area
      if (cursorY >= scrollOffset && cursorY < scrollOffset + visibleLines) {
        // Calculate cursor position based on text
        const lineText = textContent[cursorY] || "";
        let cursorPosX = 4;
        
        // Measure text width up to cursor position
        if (cursorX > 0) {
          const textBeforeCursor = lineText.substring(0, cursorX);
          cursorPosX += measureTextWidth(textBeforeCursor);
        }
        
        // Draw cursor, adjusted for scroll position
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

// Helper function to check if a line is within selection
function isLineSelected(lineIndex) {
  if (!selectionActive) return false;
  
  // Normalize selection coordinates
  const [startY, endY] = selectionStartY <= selectionEndY 
    ? [selectionStartY, selectionEndY] 
    : [selectionEndY, selectionStartY];
  
  return lineIndex >= startY && lineIndex <= endY;
}

// Helper function to get normalized selection coordinates
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

// Helper function to measure text width
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
  // Handle text selection or cursor positioning
  if (isTextMode) {
    // Check if click is on the scroll bar
    if (textContent.length > visibleLines && mouseX >= WIDTH - scrollBarWidth) {
      // Handle scroll bar click
      const contentHeight = textContent.length;
      const viewportRatio = Math.min(1, visibleLines / contentHeight);
      const thumbHeight = Math.max(scrollThumbMinHeight, HEIGHT * viewportRatio);
      
      // Calculate new scroll position
      const availableScrollSpace = HEIGHT - thumbHeight;
      const clickPosition = mouseY / availableScrollSpace;
      scrollOffset = Math.floor(clickPosition * (contentHeight - visibleLines));
      
      // Clamp scroll offset
      scrollOffset = Math.max(0, Math.min(scrollOffset, contentHeight - visibleLines));
      return;
    }
    
    // Handle text selection
    const lineIndex = Math.floor((mouseY - 4) / lineHeight) + scrollOffset;
    if (lineIndex >= 0 && lineIndex < textContent.length) {
      // Find closest character position to click
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
      
      // Start selection if shift is pressed, otherwise set cursor
      if (shiftKeyPressed) {
        if (!selectionActive) {
          // Start a new selection from current cursor
          selectionActive = true;
          selectionStartX = cursorX;
          selectionStartY = cursorY;
        }
        // Update selection end point
        selectionEndX = bestPos;
        selectionEndY = lineIndex;
      } else {
        // Clear selection and set cursor
        selectionActive = false;
        cursorY = lineIndex;
        cursorX = bestPos;
        
        // Start a new potential selection
        selectionStartX = bestPos;
        selectionStartY = lineIndex;
      }
      
      // Ensure cursor is visible by scrolling if needed
      ensureCursorVisible();
    }
  }
}

function ensureCursorVisible() {
  if (cursorY < scrollOffset) {
    // Cursor is above visible area, scroll up
    scrollOffset = cursorY;
  } else if (cursorY >= scrollOffset + visibleLines) {
    // Cursor is below visible area, scroll down
    scrollOffset = cursorY - visibleLines + 1;
  }
  
  // Clamp scroll offset
  scrollOffset = Math.max(0, Math.min(scrollOffset, textContent.length - visibleLines));
}

function onMouseDownRight() {
  // Could implement context menu here
}

function onMouseUp() {
  // If we were selecting text and there's no actual selection, clear selection state
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
    // Scroll up by one line
    scrollOffset = Math.max(0, scrollOffset - 1);
  }
}

function onScrollDown() {
  if (isTextMode && textContent.length > visibleLines) {
    // Scroll down by one line
    scrollOffset = Math.min(textContent.length - visibleLines, scrollOffset + 1);
  }
}

// Modified to handle accented characters properly
function onKeyPress(key) {
  if (isTextMode && key.length === 1) {
    // If there's a selection, delete it first
    if (selectionActive) {
      deleteSelection();
      selectionActive = false; // Ensure selection is canceled
    }
    
    // Handle all printable characters, including accented ones
    insertTextAtCursor(key);
  }
}

// Update the onKeyDown function
function onKeyDown(key) {
  // Update modifier key states
  if (key === 'Alt') {
    altKeyPressed = true;
  } else if (key === 'Shift') {
    shiftKeyPressed = true;
  } else if (key === 'Control') {
    ctrlKeyPressed = true;
  }
  
  // Handle keyboard shortcuts with explicit check for ctrlKeyPressed
  if (isTextMode && ctrlKeyPressed) {
    if (key === 'a') {
      // Select all text
      selectionActive = true;
      selectionStartX = 0;
      selectionStartY = 0;
      selectionEndX = textContent[textContent.length - 1].length;
      selectionEndY = textContent.length - 1;
      return; // Skip normal key handling
    } 
    else if (key === 'c') {
      if (selectionActive) {
        // Copy selected text to clipboard
        const selectedText = getSelectedText();
        if (selectedText) {
          navigator.clipboard.writeText(selectedText).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        }
      }
      return; // Skip normal key handling
    }
    else if (key === 'v') {
      // Paste from clipboard
      navigator.clipboard.readText().then(text => {
        if (selectionActive) {
          deleteSelection();
        }
        insertTextAtCursor(text);
      }).catch(err => {
        console.error('Failed to paste text: ', err);
      });
      return; // Skip normal key handling
    }
    else if (key === 'x') {
      if (selectionActive) {
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
      return; // Skip normal key handling
    }
  }
  
  // Handle Alt+Shift+T separately
  if (key === 'T' && altKeyPressed && shiftKeyPressed) {
    isTextMode = !isTextMode;
    console.log(`Text mode ${isTextMode ? 'enabled' : 'disabled'}`);
    return;
  }
  
  // Handle other keys
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
      // Cancel selection and place cursor at the end of selection
      if (selectionActive) {
        const { endX, endY } = getNormalizedSelection();
        cursorX = endX;
        cursorY = endY;
        selectionActive = false;
      }
      break;
      
    case 'ArrowLeft':
      if (shiftKeyPressed) {
        // Extend or start selection
        if (!selectionActive) {
          selectionActive = true;
          selectionStartX = cursorX;
          selectionStartY = cursorY;
        }
        
        // Move cursor left
        if (cursorX > 0) {
          cursorX--;
        } else if (cursorY > 0) {
          cursorY--;
          cursorX = textContent[cursorY].length;
        }
        
        // Update selection end
        selectionEndX = cursorX;
        selectionEndY = cursorY;
      } else {
        // If selection is active, just move cursor to start of selection
        if (selectionActive) {
          const { startX, startY } = getNormalizedSelection();
          cursorX = startX;
          cursorY = startY;
          selectionActive = false;
        } else {
          // Normal cursor movement
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
        // Extend or start selection
        if (!selectionActive) {
          selectionActive = true;
          selectionStartX = cursorX;
          selectionStartY = cursorY;
        }
        
        // Move cursor right
        if (cursorX < textContent[cursorY].length) {
          cursorX++;
        } else if (cursorY < textContent.length - 1) {
          cursorY++;
          cursorX = 0;
        }
        
        // Update selection end
        selectionEndX = cursorX;
        selectionEndY = cursorY;
      } else {
        // If selection is active, just move cursor to end of selection
        if (selectionActive) {
          const { endX, endY } = getNormalizedSelection();
          cursorX = endX;
          cursorY = endY;
          selectionActive = false;
        } else {
          // Normal cursor movement
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
        // Extend or start selection
        if (!selectionActive) {
          selectionActive = true;
          selectionStartX = cursorX;
          selectionStartY = cursorY;
        }
        
        // Move cursor up
        if (cursorY > 0) {
          cursorY--;
          cursorX = Math.min(cursorX, textContent[cursorY].length);
        }
        
        // Update selection end
        selectionEndX = cursorX;
        selectionEndY = cursorY;
      } else {
        // Clear selection
        selectionActive = false;
        
        // Normal cursor movement
        if (cursorY > 0) {
          cursorY--;
          cursorX = Math.min(cursorX, textContent[cursorY].length);
        }
      }
      break;
      
    case 'ArrowDown':
      if (shiftKeyPressed) {
        // Extend or start selection
        if (!selectionActive) {
          selectionActive = true;
          selectionStartX = cursorX;
          selectionStartY = cursorY;
        }
        
        // Move cursor down
        if (cursorY < textContent.length - 1) {
          cursorY++;
          cursorX = Math.min(cursorX, textContent[cursorY].length);
        }
        
        // Update selection end
        selectionEndX = cursorX;
        selectionEndY = cursorY;
      } else {
        // Clear selection
        selectionActive = false;
        
        // Normal cursor movement
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
        // Extend or start selection
        if (!selectionActive) {
          selectionActive = true;
          selectionStartX = cursorX;
          selectionStartY = cursorY;
        }
        
        // Move cursor to start of line
        cursorX = 0;
        
        // Update selection end
        selectionEndX = cursorX;
        selectionEndY = cursorY;
      } else {
        // Clear selection
        selectionActive = false;
        cursorX = 0;
      }
      break;
      
    case 'End':
      if (shiftKeyPressed) {
        // Extend or start selection
        if (!selectionActive) {
          selectionActive = true;
          selectionStartX = cursorX;
          selectionStartY = cursorY;
        }
        
        // Move cursor to end of line
        cursorX = textContent[cursorY].length;
        
        // Update selection end
        selectionEndX = cursorX;
        selectionEndY = cursorY;
      } else {
        // Clear selection
        selectionActive = false;
        cursorX = textContent[cursorY].length;
      }
      break;
      
    // For keyboard shortcuts, we need to check if Ctrl is pressed
    case 'a':
      // Only handle if it's not a Ctrl+A shortcut
      // Ctrl+A is handled separately in onKeyDown
      break;
      
    case 'c':
      // Only handle if it's not a Ctrl+C shortcut
      // Ctrl+C is handled separately in onKeyDown
      break;
      
    case 'v':
      // Only handle if it's not a Ctrl+V shortcut
      // Ctrl+V is handled separately in onKeyDown
      break;
      
    case 'x':
      // Only handle if it's not a Ctrl+X shortcut
      // Ctrl+X is handled separately in onKeyDown
      break;
  }// After handling the key, ensure the cursor is visible

  ensureCursorVisible();
  
  // Reset cursor blink on any key press
  cursorVisible = true;
  cursorBlinkTimer = 0;
}

  // Helper function to get selected text
  function gettext() {
    if (!selectionActive) return '';
    
    const { startY, startX, endY, endX } = getNormalizedSelection();
    
    if (startY === endY) {
      // Selection is on a single line
      return textContent[startY].substring(startX, endX);
    } else {
      // Selection spans multiple lines
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
      // Selection is on a single line
      const line = textContent[startY];
      textContent[startY] = line.substring(0, startX) + line.substring(endX);
    } else {
      // Selection spans multiple lines
      const startLine = textContent[startY];
      const endLine = textContent[endY];
      
      // Combine the start of the first line with the end of the last line
      textContent[startY] = startLine.substring(0, startX) + endLine.substring(endX);
      
      // Remove all lines in between
      textContent.splice(startY + 1, endY - startY);
    }
    
    // Move cursor to selection start
    cursorX = startX;
    cursorY = startY;
    
    // Clear selection
    selectionActive = false;

    ensureCursorVisible();
  }
  
  function insertTextAtCursor(text) {
    // Handle multi-line paste
    if (text.includes('\n')) {
      const lines = text.split('\n');
      
      // Insert first line at cursor position
      const currentLine = textContent[cursorY];
      textContent[cursorY] = currentLine.substring(0, cursorX) + lines[0];
      
      // Insert middle lines
      for (let i = 1; i < lines.length - 1; i++) {
        textContent.splice(cursorY + i, 0, lines[i]);
      }
      
      // Insert last line and connect with remainder of current line
      if (lines.length > 1) {
        const lastLineIndex = cursorY + lines.length - 1;
        textContent.splice(lastLineIndex, 0, lines[lines.length - 1] + currentLine.substring(cursorX));
        
        // Update cursor position
        cursorY = lastLineIndex;
        cursorX = lines[lines.length - 1].length;
      } else {
        // Single line with newline at the end
        cursorX = textContent[cursorY].length;
      }
      
      // Check if any lines need wrapping
      for (let i = cursorY; i >= cursorY - lines.length + 1; i--) {
        if (i >= 0 && measureTextWidth(textContent[i]) > maxLineWidth) {
          wrapLineByWidth(i);
        }
      }
    } else {
      // Simple single-line insertion
      const currentLine = textContent[cursorY];
      const newLine = currentLine.substring(0, cursorX) + text + currentLine.substring(cursorX);
      textContent[cursorY] = newLine;
      cursorX += text.length;
      
      // Check if we need to wrap text based on pixel width
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
      // Delete character before cursor
      textContent[cursorY] = currentLine.substring(0, cursorX - 1) + currentLine.substring(cursorX);
      cursorX--;
    } else if (cursorY > 0) {
      // Merge with previous line
      const previousLine = textContent[cursorY - 1];
      cursorX = previousLine.length;
      textContent[cursorY - 1] = previousLine + currentLine;
      textContent.splice(cursorY, 1);
      cursorY--;
      
      // Check if the merged line needs wrapping
      if (measureTextWidth(textContent[cursorY]) > maxLineWidth) {
        wrapLineByWidth(cursorY);
      }
    }

    ensureCursorVisible();
  }
  
  function deleteCharAfterCursor() {
    const currentLine = textContent[cursorY];
    
    if (cursorX < currentLine.length) {
      // Delete character at cursor
      textContent[cursorY] = currentLine.substring(0, cursorX) + currentLine.substring(cursorX + 1);
    } else if (cursorY < textContent.length - 1) {
      // Merge with next line
      const nextLine = textContent[cursorY + 1];
      textContent[cursorY] = currentLine + nextLine;
      textContent.splice(cursorY + 1, 1);
      
      // Check if the merged line needs wrapping
      if (measureTextWidth(textContent[cursorY]) > maxLineWidth) {
        wrapLineByWidth(cursorY);
      }
    }

    ensureCursorVisible();
  }
  
  function wrapLineByWidth(lineIndex) {
    const line = textContent[lineIndex];
    
    // Find the best break point based on width
    let breakPoint = line.length;
    for (let i = 1; i <= line.length; i++) {
      if (measureTextWidth(line.substring(0, i)) > maxLineWidth) {
        breakPoint = i - 1;
        break;
      }
    }
    
    // If we can't even fit one character, just break at 1
    if (breakPoint === 0) breakPoint = 1;
    
    // Try to find a better break point (at a space)
    for (let i = breakPoint; i > 0; i--) {
      if (line[i] === ' ') {
        breakPoint = i;
        break;
      }
    }
    
    const firstPart = line.substring(0, breakPoint);
    const secondPart = line.substring(breakPoint).trimStart(); // Remove leading spaces
    
    textContent[lineIndex] = firstPart;
    textContent.splice(lineIndex + 1, 0, secondPart);
    
    // Adjust cursor position if it was in the wrapped text
    if (cursorY === lineIndex && cursorX >= breakPoint) {
      cursorY++;
      cursorX = cursorX - breakPoint;
      // Account for any trimmed spaces
      if (line[breakPoint] === ' ') {
        cursorX = Math.max(0, cursorX - (line.length - secondPart.length - breakPoint));
      }
    }
    
    // Adjust selection if it spans the wrapped text
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
    
    // Check if the second part also needs wrapping
    if (measureTextWidth(secondPart) > maxLineWidth) {
      wrapLineByWidth(lineIndex + 1);
    }
  }
  
  function gameLoop(timestamp) {
    draw();
    drawPixelmap();
    tick++; 
    
    // Update cursor blink timer
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
  