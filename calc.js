let calculatorState = {
  equation: "0",
  result: "0",
  display: "0" 
};

function calculatorApp() {
  drawRect(65, 20, 190, 128, "#495057", true, 4);

  drawText("Calculator", 70, 24, "#f8f9fa", "small");
  
  drawRect(172, 23, 178, 29, "#fcc419", true, 2);
  drawLine(174, 26, 176, 26, "#f59f00");
  
  drawRect(181, 23, 187, 29, "#ff6b6b", true, 2);
  drawLine(183, 25, 185, 27, "#f03e3e");
  drawLine(185, 25, 183, 27, "#f03e3e");
  
  drawRect(70, 33, 185, 48, "#212529", true, 2); 
  drawText(calculatorState.display, 75, 38, "#f8f9fa", "small"); 
  
  const buttons = [
    ["C", "^", "(", ")"],
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"]
  ];
  
  let y = 53;
  buttons.forEach((row, rowIndex) => {
    let x = 70;
    row.forEach((btn, colIndex) => {
      drawRect(x, y, x + 25, y + 10, "#868e96", true, 2);
      drawText(btn, x + 12, y + 3, "#f8f9fa", "small");
      x += 30;
    });
    y += 15;
  });

  if (isMouseWithin(172, 23, 178, 29)) {
    currentCursor = "pointer";
  } else if (isMouseWithin(181, 23, 187, 29)) {
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
  if (isMouseWithin(66, 134, 66+6, 134+8)) {
    currentApp = "calculator";
  }
  
  if (currentApp === "calculator") {
    if (isMouseWithin(172, 23, 178, 29)) {
      currentApp = "desktop";
    }
    
    if (isMouseWithin(181, 23, 187, 29)) {
      currentApp = "desktop";
      calculatorState = {
        equation: "0",
        result: "0",
        display: "0"
      };
    }
  }
  
  if (currentApp === "calculator") {
    const buttons = [
      ["C", "^", "(", ")"],
      ["7", "8", "9", "/"],
      ["4", "5", "6", "*"],
      ["1", "2", "3", "-"],
      ["0", ".", "=", "+"]
    ];
    
    let y = 53;
    buttons.forEach((row, rowIndex) => {
      let x = 70;
      row.forEach((btn) => {
        if (isMouseWithin(x, y, x + 25, y + 10)) {
          handleCalculatorInput(btn);
        }
        x += 30;
      });
      y += 15;
    });

    if (isMouseWithin(181, 23, 187, 29)) {
      currentApp = "desktop";
    }
  }
}
