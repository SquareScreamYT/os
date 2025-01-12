let calculatorState = {
  equation: "0",
  result: "0",
  display: "0",
  width: 125,
  height: 108,
  originx: 65,
  originy: 20,
  isDragging: false,
  dragOffsetX: 0,
  dragOffsetY: 0
};

function handleCalculatorDrag(mouseX, mouseY) {
  if (calculatorState.isDragging) {
    calculatorState.originx = mouseX - calculatorState.dragOffsetX;
    calculatorState.originy = mouseY - calculatorState.dragOffsetY;
  }
}

function calculatorApp() {
  const x = calculatorState.originx;
  const y = calculatorState.originy;
  
  // Main calculator body
  drawRect(x, y, x + calculatorState.width, y + calculatorState.height, "#495057", true, 4);

  // Title
  drawText("Calculator", x + 5, y + 4, "#f8f9fa", "small");
  
  // Minimize button
  drawRect(x + calculatorState.width - 18, y + 3, x + calculatorState.width - 12, y + 9, "#fcc419", true, 2);
  drawLine(x + calculatorState.width - 16, y + 6, x + calculatorState.width - 14, y + 6, "#f59f00");
  
  // Close button
  drawRect(x + calculatorState.width - 9, y + 3, x + calculatorState.width - 3, y + 9, "#ff6b6b", true, 2);
  drawLine(x + calculatorState.width - 7, y + 5, x + calculatorState.width - 5, y + 7, "#f03e3e");
  drawLine(x + calculatorState.width - 5, y + 5, x + calculatorState.width - 7, y + 7, "#f03e3e");
  
  // Display
  drawRect(x + 5, y + 13, x + calculatorState.width - 5, y + 28, "#212529", true, 2); 
  drawText(calculatorState.display, x + 10, y + 18, "#f8f9fa", "small");
  
  const buttons = [
    ["C", "^", "(", ")"],
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"]
  ];
  
  // Draw buttons
  let buttonY = y + 33;
  const buttonWidth = Math.round((calculatorState.width - 25) / 4); // Divide available space by 4 buttons
  buttons.forEach((row) => {
    let buttonX = x + 5;
    row.forEach((btn) => {
      drawRect(buttonX, buttonY, buttonX + buttonWidth, buttonY + 10, "#868e96", true, 2);
      drawText(btn, buttonX + Math.floor(buttonWidth/2), buttonY + 3, "#f8f9fa", "small");
      buttonX += buttonWidth + 5; // Add small gap between buttons
    });
    buttonY += 15;
  });
  
  // Update cursor
  if (isMouseWithin(x + 107, y + 3, x + 113, y + 9)) {
    currentCursor = "pointer";
  } else if (isMouseWithin(x + 116, y + 3, x + 122, y + 9)) {
    currentCursor = "pointer";
  } else if (isMouseWithin(x, y, x + calculatorState.width - 20, y + 12)) {
    currentCursor = "move";
  } else {
    currentCursor = "cursor";
  }
}

function calculateResult(equation) {
  try {
    const processedEquation = equation.replace(/\^/g, '**');
    return eval(processedEquation).toString();
  } catch (error) {
    return "ERROR";
  }
}

function handleCalculatorInput(button) {
  if (button === "C") {
    calculatorState.equation = "0";
    calculatorState.result = "0";
  } else if (button === "=") {
    calculatorState.result = calculateResult(calculatorState.equation);
    calculatorState.equation = calculatorState.result;
  } else {
    if (calculatorState.equation === "0") {
      calculatorState.equation = button;
    } else {
      calculatorState.equation += button;
    }
  }
  
  calculatorState.display = calculatorState.equation;
}

function onCalculatorMouseClick() {
  const x = calculatorState.originx;
  const y = calculatorState.originy;

  if (currentApp === "calculator") {
    // Check if clicking title bar area (excluding buttons)
    if (isMouseWithin(x, y, x + calculatorState.width - 20, y + 12)) {
      calculatorState.isDragging = true;
      calculatorState.dragOffsetX = mouseX - calculatorState.originx;
      calculatorState.dragOffsetY = mouseY - calculatorState.originy;
      return;
    }

    if (isMouseWithin(x + calculatorState.width - 18, y + 3, x + calculatorState.width - 12, y + 9)) {
      currentApp = "desktop";
    }
    
    if (isMouseWithin(x + calculatorState.width - 9, y + 3, x + calculatorState.width - 3, y + 9)) {
      currentApp = "desktop";
      calculatorState = {
        equation: "0",
        result: "0",
        display: "0",
        width: 125,
        height: 108,
        originx: 65,
        originy: 20
      };
    }
    
    const buttons = [
      ["C", "^", "(", ")"],
      ["7", "8", "9", "/"],
      ["4", "5", "6", "*"],
      ["1", "2", "3", "-"],
      ["0", ".", "=", "+"]
    ];
    
    let buttonY = y + 33;
    const buttonWidth = Math.round((calculatorState.width - 25) / 4);
    buttons.forEach((row) => {
      let buttonX = x + 5;
      row.forEach((btn) => {
        if (isMouseWithin(buttonX, buttonY, buttonX + buttonWidth, buttonY + 10)) {
          handleCalculatorInput(btn);
        }
        buttonX += buttonWidth + 5;
      });
      buttonY += 15;
    });
  }
}

// Add this new function to handle dragging
function handleCalculatorDrag(mouseX, mouseY) {
  if (calculatorState.isDragging) {
    calculatorState.originx = mouseX - calculatorState.dragOffsetX;
    calculatorState.originy = mouseY - calculatorState.dragOffsetY;
  }
}

// Add new function to handle mouse release
function onCalculatorMouseUp() {
  calculatorState.isDragging = false;
}

// Add new function to handle mouse move
function onCalculatorMouseMove(mouseX, mouseY) {
  if (currentApp === "calculator" && calculatorState.isDragging) {
    handleCalculatorDrag(mouseX, mouseY);
  }
}