'use strict';
// Pause menu + mute toggle check.
const path = require('path');
const { chromium } = require('playwright');

function assert(cond, msg) {
  if (!cond) { console.error('ASSERTION FAILED: ' + msg); process.exit(1); }
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('file://' + path.join(__dirname, '..', 'index.html'));
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    Game.newRun();
    Game.startLevel(0);
    Game.beginLevel(0);
  });
  await page.waitForTimeout(300);

  // pause
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  assert(await page.evaluate(() => Game.paused), 'game did not pause');
  // timer must freeze while paused
  const t1 = await page.evaluate(() => Game.level.time);
  await page.waitForTimeout(500);
  const t2 = await page.evaluate(() => Game.level.time);
  assert(t1 === t2, `timer ran while paused (${t1} -> ${t2})`);
  // resume via menu (cursor starts on RESUME)
  await page.keyboard.press('KeyZ');
  await page.waitForTimeout(200);
  assert(!(await page.evaluate(() => Game.paused)), 'game did not resume');

  // pause -> QUIT TO MAP
  await page.keyboard.press('Enter');
  await page.waitForTimeout(150);
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(120);
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(150);
  await page.keyboard.press('KeyZ');
  await page.waitForTimeout(300);
  const scene = await page.evaluate(() => Game.sceneName);
  assert(scene === 'map', `quit-to-map failed, scene=${scene}`);

  // mute toggle persists
  await page.keyboard.press('KeyM');
  await page.waitForTimeout(100);
  const muted = await page.evaluate(() => ({ a: Audio_.muted, s: Save.data.muted }));
  assert(muted.a && muted.s, 'mute did not toggle/persist');
  await page.keyboard.press('KeyM');
  await page.waitForTimeout(100);
  assert(!(await page.evaluate(() => Audio_.muted)), 'unmute failed');

  if (errors.length) { console.error(errors); process.exit(1); }
  await browser.close();
  console.log('PAUSE/MUTE TEST PASSED');
})();
