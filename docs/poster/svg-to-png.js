const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const svgPath = path.resolve(__dirname, 'agora_poster_36x24.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  
  // 36x24 inches at 300 DPI = 10800x7200 pixels (print-quality)
  const WIDTH = 10800;
  const HEIGHT = 7200;

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; }
  body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: white; }
  svg { width: ${WIDTH}px; height: ${HEIGHT}px; display: block; }
</style></head>
<body>${svgContent}</body></html>`;

  console.log('Launching browser...');
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
  
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });
  
  // Wait for Inter font to load
  await page.evaluate(() => document.fonts.ready);
  console.log('Fonts loaded. Waiting for render...');
  await new Promise(r => setTimeout(r, 4000));
  
  console.log(`Rendering ${WIDTH}x${HEIGHT} (300 DPI for 36x24")...`);
  
  // High quality PNG screenshot
  await page.screenshot({ 
    path: path.resolve(__dirname, 'agora_poster_36x24_300dpi.png'), 
    type: 'png',
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    omitBackground: false
  });
  
  // Also make the 150 DPI version
  await browser.close();
  
  const hqPath = path.resolve(__dirname, 'agora_poster_36x24_300dpi.png');
  const stats = fs.statSync(hqPath);
  console.log(`\n✅ HIGH QUALITY (300 DPI):`);
  console.log(`   File: ${hqPath}`);
  console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(1)} MB`);
  console.log(`   Resolution: ${WIDTH}x${HEIGHT}px`);
  console.log(`   Print size: 36" x 24" at 300 DPI`);
})();
