const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const svgPath = path.resolve(__dirname, 'agora_poster_36x24.svg');
  const pdfPath = path.resolve(__dirname, 'agora_poster_36x24.pdf');
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  // 36x24 inches in CSS pixels (96 DPI for screen)
  const W_PX = 36 * 96;  // 3456
  const H_PX = 24 * 96;  // 2304

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  @page { size: 36in 24in; margin: 0; }
  * { margin: 0; padding: 0; }
  html, body { width: 36in; height: 24in; overflow: hidden; }
  svg { width: 36in; height: 24in; display: block; }
</style></head>
<body>${svgContent}</body></html>`;

  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: W_PX, height: H_PX, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });

  // Wait for Inter font
  await page.evaluate(() => document.fonts.ready);
  console.log('Fonts loaded. Waiting for full render...');
  await new Promise(r => setTimeout(r, 4000));

  console.log('Generating vector PDF (36" x 24")...');
  await page.pdf({
    path: pdfPath,
    width: '36in',
    height: '24in',
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    printBackground: true,
    preferCSSPageSize: true
  });

  await browser.close();

  const stats = fs.statSync(pdfPath);
  console.log(`\n✅ VECTOR PDF CREATED:`);
  console.log(`   File: ${pdfPath}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(0)} KB`);
  console.log(`   Dimensions: 36" x 24" (landscape)`);
  console.log(`   Type: Vector — scales to any resolution`);
  console.log(`   Ready for professional printing!`);
})();
