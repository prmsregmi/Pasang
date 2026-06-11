'use strict';
// Capture mid-level screenshots of the remaining visual themes.
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const SHOT_DIR = path.join(__dirname, 'screenshots');
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 520 } });
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await page.goto('file://' + path.join(__dirname, '..', 'index.html'));
  await page.waitForTimeout(600);

  // [levelIdx, teleport x in tiles, label]
  const visits = [
    [1, 40, '20-cave-1-2'],
    [2, 100, '21-bridges-1-3'],
    [4, 60, '22-hills-2-1'],
    [5, 30, '23-night-2-2'],
    [8, 56, '24-snow-3-1'],
    [10, 85, '25-ridge-3-3'],
  ];
  for (const [idx, tx, label] of visits) {
    await page.evaluate(({ idx, tx }) => {
      Save.data.unlocked = 11;
      Game.newRun();
      Game.startLevel(idx);
      Game.beginLevel(idx);
      const lvl = Game.level, p = lvl.player;
      p.x = tx * 16; p.y = 80; p.vy = 0;
      p.invuln = 4;
      lvl.camX = Math.max(0, p.x - 160);
    }, { idx, tx });
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(SHOT_DIR, label + '.png') });
  }
  await browser.close();
  console.log('SHOTS DONE');
})();
