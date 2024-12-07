opencolor = {
  "white": "#ffffff",
  "black": "#000000",
  "gray": [
    "#f8f9fa", "#f1f3f5", "#e9ecef", "#dee2e6", "#ced4da",
    "#adb5bd", "#868e96", "#495057", "#343a40", "#212529"
  ],
  "red": [
    "#fff5f5", "#ffe3e3", "#ffc9c9", "#ffa8a8", "#ff8787",
    "#ff6b6b", "#fa5252", "#f03e3e", "#e03131", "#c92a2a"
  ],
  "pink": [
    "#fff0f6", "#ffdeeb", "#fcc2d7", "#faa2c1", "#f783ac",
    "#f06595", "#e64980", "#d6336c", "#c2255c", "#a61e4d"
  ],
  "grape": [
    "#f8f0fc", "#f3d9fa", "#eebefa", "#e599f7", "#da77f2",
    "#cc5de8", "#be4bdb", "#ae3ec9", "#9c36b5", "#862e9c"
  ],
  "violet": [
    "#f3f0ff", "#e5dbff", "#d0bfff", "#b197fc", "#9775fa",
    "#845ef7", "#7950f2", "#7048e8", "#6741d9", "#5f3dc4"
  ],
  "indigo": [
    "#edf2ff", "#dbe4ff", "#bac8ff", "#91a7ff", "#748ffc",
    "#5c7cfa", "#4c6ef5", "#4263eb", "#3b5bdb", "#364fc7"
  ],
  "blue": [
    "#e7f5ff", "#d0ebff", "#a5d8ff", "#74c0fc", "#4dabf7",
    "#339af0", "#228be6", "#1c7ed6", "#1971c2", "#1864ab"
  ],
  "cyan": [
    "#e3fafc", "#c5f6fa", "#99e9f2", "#66d9e8", "#3bc9db",
    "#22b8cf", "#15aabf", "#1098ad", "#0c8599", "#0b7285"
  ],
  "teal": [
    "#e6fcf5", "#c3fae8", "#96f2d7", "#63e6be", "#38d9a9",
    "#20c997", "#12b886", "#0ca678", "#099268", "#087f5b"
  ],
  "green": [
    "#ebfbee", "#d3f9d8", "#b2f2bb", "#8ce99a", "#69db7c",
    "#51cf66", "#40c057", "#37b24d", "#2f9e44", "#2b8a3e"
  ],
  "lime": [
    "#f4fce3", "#e9fac8", "#d8f5a2", "#c0eb75", "#a9e34b",
    "#94d82d", "#82c91e", "#74b816", "#66a80f", "#5c940d"
  ],
  "yellow": [
    "#fff9db", "#fff3bf", "#ffec99", "#ffe066", "#ffd43b",
    "#fcc419", "#fab005", "#f59f00", "#f08c00", "#e67700"
  ],
  "orange": [
    "#fff4e6", "#ffe8cc", "#ffd8a8", "#ffc078", "#ffa94d",
    "#ff922b", "#fd7e14", "#f76707", "#e8590c", "#d9480f"
  ],
  "brown": [
    "#fdf0e4", "#f8dcc7", "#f1c7ac", "#e4ad8f", "#cc9477",
    "#b57a5e", "#9a6548", "#7b4e36", "#5e3b2b", "#3e261a"
  ]
}

// endesga 64 by endesga
const colors = {
  red: "#ff0040",
  black: "#131313",
  charcoal: "#1b1b1b",
  gray: "#272727",
  slate: "#3d3d3d",
  stone: "#5d5d5d",
  silver: "#858585",
  lightgray: "#b4b4b4",
  white: "#ffffff",
  lightblue: "#c7cfdd",
  steelblue: "#92a1b9",
  bluegray: "#657392",
  indigo: "#424c6e",
  midnightblue: "#2a2f4e",
  blueblack: "#1a1932",
  purpleblack: "#0e071b",
  plumblack: "#1c121c",
  maroon: "#391f21",
  brown: "#5d2c28",
  sienna: "#8a4836",
  chocolate: "#bf6f4a",
  sand: "#e69c69",
  tan: "#f6ca9f",
  beige: "#f9e6cf",
  darkyellow: "#edab50",
  darkorange: "#e07438",
  red: "#c64524",
  brick: "#8e251d",
  orange: "#ff5000",
  salmon: "#ed7614",
  gold: "#ffa214",
  yellow: "#ffc825",
  lemon: "#ffeb57",
  chartreuse: "#d3fc7e",
  lime: "#99e65f",
  forest: "#5ac54f",
  seafoam: "#33984b",
  teal: "#1e6f50",
  darkteal: "#134c4c",
  darkindigo: "#0c2e44",
  darkblue: "#00396d",
  blue: "#0069aa",
  skyblue: "#0098dc",
  cyan: "#00cdf9",
  electricblue: "#0cf1ff",
  lightcyan: "#94fdff",
  lightpink: "#fdd2ed",
  pink: "#f389f5",
  magenta: "#db3ffd",
  electricpurple: "#7a09fa",
  violet: "#3003d9",
  darkviolet: "#0c0293",
  darkcyan: "#03193f",
  darkmagenta: "#3b1443",
  darkorchid: "#622461",
  orchid: "#93388f",
  lightorchid: "#ca52c9",
  blush: "#c85086",
  rose: "#f68187",
  lightred: "#f5555d",
  mediumred: "#ea323c",
  darkred: "#c42430",
  scarlet: "#891e2b",
  wine: "#571c27"
};

for (const key in colors) {
  window[key] = colors[key];
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

function colorDistance(rgb1, rgb2) {
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

function res64(hexColor) {
  const rgbColor = hexToRgb(hexColor); 

  let nearestColorHex = null;
  let minDistance = Infinity;

  for (const res64ColorName in color) {
    const res64ColorValue = color[res64ColorName];
    const res64Rgb = hexToRgb(res64ColorValue);
    const distance = colorDistance(rgbColor, res64Rgb);

    if (distance < minDistance) {
      minDistance = distance;
      nearestColorHex = res64ColorValue; 
    }
  }

  return nearestColorHex;
}

function hexArrayToRes64(hexArray) {
  const result = [];

  for (let i = 0; i < hexArray.length; i++) {
    const hexColor = hexArray[i];

    if (hexColor = "none") {
      result.push("none");
      continue;
    }

    const nearestColor = res64(hexColor);

    result.push(nearestColor);
  }
  return result;
}