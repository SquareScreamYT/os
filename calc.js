let calculatorState = {
  equation: "0",
  result: "0",
  display: "0" 
};

function calculatorApp() {
  drawRect(65, 20, 190, 120, "#495057", true, 4);
  
  drawRect(70, 25, 185, 40, "#212529", true, 2);
  drawText(calculatorState.display, 75, 30, "#f8f9fa", "small");
  
  const buttons = [
    ["C", "^", "(", ")"],
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"]
  ];
  
  let y = 45;
  buttons.forEach((row, rowIndex) => {
    let x = 70;
    row.forEach((btn, colIndex) => {
      drawRect(x, y, x + 25, y + 10, "#868e96", true, 2);
      drawText(btn, x + 12, y + 3, "#f8f9fa", "small");
      x += 30;
    });
    y += 15;
  });
}


function calculateResult(equation) {
  try {
    // Replace ^ with ** for exponentiation
    const processedEquation = equation.replace(/\^/g, '**');
    return eval(processedEquation).toString();
  } catch (error) {
    return "Error";
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
    const buttons = [
      ["C", "^", "(", ")"],
      ["7", "8", "9", "/"],
      ["4", "5", "6", "*"],
      ["1", "2", "3", "-"],
      ["0", ".", "=", "+"]
    ];
    
    let y = 45;
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
  }
}
