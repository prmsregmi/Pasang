'use strict';
// Quick check that the game also boots when served over HTTP
// (assumes a server is already running on the given port).
const { chromium } = require('playwright');

(async () => {
  const port = process.argv[2] || 8901;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`http://localhost:${port}/index.html`);
  await page.waitForTimeout(800);
  const scene = await page.evaluate(() => Game.sceneName);
  await browser.close();
  if (scene !== 'title' || errors.length) {
    console.error('HTTP boot failed:', scene, errors);
    process.exit(1);
  }
  console.log('HTTP BOOT OK');
})();
