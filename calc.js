let calculatorState = {
  equation: "0",
  result: "0",
  display: "0",
  width: 125,
  height: 108,
  originx: 65,
  originy: 20
};

function calculatorApp() {
  const x = calculatorState.originx;
  const y = calculatorState.originy;
  
  // Main calculator body
  drawRect(x, y, x + calculatorState.width, y + calculatorState.height, "#495057", true, 4);

  // Title
  drawText("Calculator", x + 5, y + 4, "#f8f9fa", "small");
  
  // Minimize button
  drawRect(x + 107, y + 3, x + 113, y + 9, "#fcc419", true, 2);
  drawLine(x + 109, y + 6, x + 111, y + 6, "#f59f00");
  
  // Close button
  drawRect(x + 116, y + 3, x + 122, y + 9, "#ff6b6b", true, 2);
  drawLine(x + 118, y + 5, x + 120, y + 7, "#f03e3e");
  drawLine(x + 120, y + 5, x + 118, y + 7, "#f03e3e");
  
  // Display
  drawRect(x + 5, y + 13, x + 120, y + 28, "#212529", true, 2); 
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
  buttons.forEach((row) => {
    let buttonX = x + 5;
    row.forEach((btn) => {
      drawRect(buttonX, buttonY, buttonX + 25, buttonY + 10, "#868e96", true, 2);
      drawText(btn, buttonX + 12, buttonY + 3, "#f8f9fa", "small");
      buttonX += 30;
    });
    buttonY += 15;
  });

  // Update cursor
  if (isMouseWithin(x + 107, y + 3, x + 113, y + 9)) {
    currentCursor = "pointer";
  } else if (isMouseWithin(x + 116, y + 3, x + 122, y + 9)) {
    currentCursor = "pointer";
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
    if (isMouseWithin(x + 107, y + 3, x + 113, y + 9)) {
      currentApp = "desktop";
    }
    
    if (isMouseWithin(x + 116, y + 3, x + 122, y + 9)) {
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
    buttons.forEach((row) => {
      let buttonX = x + 5;
      row.forEach((btn) => {
        if (isMouseWithin(buttonX, buttonY, buttonX + 25, buttonY + 10)) {
          handleCalculatorInput(btn);
        }
        buttonX += 30;
      });
      buttonY += 15;
    });
  }
}
