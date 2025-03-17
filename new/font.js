const fontSize = 7;
const fontCanvas = document.getElementById('fontCanvas');
fontCanvas.width = fontSize * 2;
fontCanvas.height = fontSize * 2;
const fontCtx = fontCanvas.getContext('2d', { willReadFrequently: true });
let sqpixelsArray = [];

const fontFace = new FontFace('sqpixels', 'url(sqpixels.ttf)');

fontFace.load().then(font => {
  document.fonts.add(font);
  fontCtx.font = `${fontSize}px sqpixels`;
  fontCtx.textBaseline = 'top';

  const startChar = 0x0020; 
  const endChar = 0x07ff;
  const fontMap = {};

  for (let charCode = startChar; charCode <= endChar; charCode++) {
    const char = String.fromCharCode(charCode);
    
    fontCtx.fillStyle = 'white';
    fontCtx.fillRect(0, 0, fontCanvas.width, fontCanvas.height);
    
    fontCtx.fillStyle = 'black';
    fontCtx.fillText(char, 4, 5);
    
    const imageData = fontCtx.getImageData(0, 0, fontCanvas.width, fontCanvas.height);
    const pixels = imageData.data;
    
    const charData = [];
    
    for (let y = 0; y < fontCanvas.height; y++) {
      let row = "";
      for (let x = 0; x < fontCanvas.width; x++) {
        const idx = (y * fontCanvas.width + x) * 4;
        const isDark = pixels[idx] < 128 || pixels[idx + 1] < 128 || pixels[idx + 2] < 128;
        row += isDark ? "." : " ";
      }
      charData.push(row);
    }
    
    fontMap[char] = charData;
  }

  sqpixelsArray = fontMap;
});