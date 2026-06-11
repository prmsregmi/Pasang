'use strict';
// In-game captures: title, map, landmark backdrops, goal flag.
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
  await page.waitForTimeout(800);
  const shot = (n) => page.screenshot({ path: path.join(SHOT_DIR, n + '.png') });

  await shot('31-title');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  await shot('32-map');

  const visit = async (idx, tx) => {
    await page.evaluate(({ idx, tx }) => {
      Save.data.unlocked = 11;
      Game.newRun();
      Game.startLevel(idx);
      Game.beginLevel(idx);
      const lvl = Game.level, p = lvl.player;
      p.x = tx * 16; p.y = 90; p.vy = 0; p.invuln = 4;
      lvl.camX = Math.max(0, Math.min(p.x - 160, lvl.pixelW - 384));
    }, { idx, tx });
    await page.waitForTimeout(700);
  };

  await visit(0, 14);  await shot('33-1-1-yak');
  await visit(0, 188); await shot('34-1-1-goal-flag');
  await visit(4, 30);  await shot('35-2-1-hills');
  await visit(8, 95);  await shot('36-3-1-snow-leopard');
  await visit(5, 20);  await shot('37-2-2-night');
  await browser.close();
  console.log('SHOTS2 DONE');
})();
