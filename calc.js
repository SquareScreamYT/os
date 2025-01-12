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

const calcColors = {
  body: hexColor("#495057"),
  title: hexColor("#f8f9fa"),
  minimizeRect: hexColor("#fcc419"),
  minimizeLine: hexColor("#f59f00"),
  closeRect: hexColor("#ff6b6b"),
  closeLine: hexColor("#f03e3e"),
  display: hexColor("#212529"),
  text: hexColor("#f8f9fa"),
  buttonBack: hexColor("#868e96")
};

function calculatorApp() {
  const x = calculatorState.originx;
  const y = calculatorState.originy;
  
  // Main calculator body
  drawRect(x, y, x + calculatorState.width, y + calculatorState.height, calcColors.body, true, 4);

  // Title
  drawText("Calculator", x + 5, y + 4, calcColors.title, "small");
  
  // Minimize button
  drawRect(x + calculatorState.width - 18, y + 3, x + calculatorState.width - 12, y + 9, calcColors.minimizeRect, true, 2);
  drawLine(x + calculatorState.width - 16, y + 6, x + calculatorState.width - 14, y + 6, calcColors.minimizeLine);
  
  // Close button
  drawRect(x + calculatorState.width - 9, y + 3, x + calculatorState.width - 3, y + 9, calcColors.closeRect, true, 2);
  drawLine(x + calculatorState.width - 7, y + 5, x + calculatorState.width - 5, y + 7, calcColors.closeLine);
  drawLine(x + calculatorState.width - 5, y + 5, x + calculatorState.width - 7, y + 7, calcColors.closeLine);
  
  // Display
  drawRect(x + 5, y + 13, x + calculatorState.width - 5, y + 28, calcColors.display, true, 2); 
  drawText(calculatorState.display, x + 10, y + 18, calcColors.text, "small");
  
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
      drawRect(buttonX, buttonY, buttonX + buttonWidth, buttonY + 10, calcColors.buttonBack, true, 2);
      drawText(btn, buttonX + Math.floor(buttonWidth/2), buttonY + 3, calcColors.text, "small");
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
    // Check if mouse is over any calculator button
    let isOverButton = false;
    let buttonY = y + 33;
    const buttonWidth = Math.round((calculatorState.width - 25) / 4);
    
    for (let row = 0; row < 5; row++) {
      let buttonX = x + 5;
      for (let col = 0; col < 4; col++) {
        if (isMouseWithin(buttonX, buttonY, buttonX + buttonWidth, buttonY + 10)) {
          isOverButton = true;
          break;
        }
        buttonX += buttonWidth + 5;
      }
      buttonY += 15;
      if (isOverButton) break;
    }
    
    currentCursor = isOverButton ? "pointer" : "cursor";
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
