'use strict';
// ---------------------------------------------------------------------------
// Smoke test — boots the game in headless Chromium, walks through the
// scenes, plays the start of 1-1, and screenshots everything.
// Run: npm test   (requires `npm i` for the playwright devDependency)
// ---------------------------------------------------------------------------

const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const SHOT_DIR = path.join(__dirname, 'screenshots');

async function main() {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 520 } });

  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console.error: ' + msg.text());
  });

  const url = 'file://' + path.join(__dirname, '..', 'index.html');
  await page.goto(url);
  await page.waitForTimeout(800);

  const shot = (name) => page.screenshot({ path: path.join(SHOT_DIR, name + '.png') });

  // --- title scene ---
  let scene = await page.evaluate(() => Game.sceneName);
  assert(scene === 'title', `expected title scene, got ${scene}`);
  await shot('01-title');

  // sprites built?
  const spriteCount = await page.evaluate(() => Object.keys(Sprites).length);
  assert(spriteCount > 80, `expected >80 sprites, got ${spriteCount}`);

  // levels defined and decodable?
  const levelCheck = await page.evaluate(() => {
    const out = [];
    for (let i = 0; i < LEVELS.length; i++) {
      const def = LEVELS[i];
      try {
        const area = decodeArea(def.rows, def.theme, 0, 1);
        const hasStart = !!area.playerStart;
        const hasGoal = area.entities.some(e => e.isGoal) ||
          area.entities.some(e => e.isNPC) || (def.subareas || []).length > 0;
        out.push({ i, name: def.name, hasStart, hasGoal, w: area.w });
        (def.subareas || []).forEach((sa, j) => {
          const sub = decodeArea(sa.rows, sa.theme, j + 1, 1);
          if (!sub.playerStart) out.push({ i, name: def.name + ' sub' + j, hasStart: false, hasGoal: true, w: sub.w });
        });
      } catch (e) {
        out.push({ i, name: def.name, error: e.message });
      }
    }
    return out;
  });
  for (const lc of levelCheck) {
    assert(!lc.error, `level ${lc.name} failed to decode: ${lc.error}`);
    assert(lc.hasStart, `level ${lc.name} has no player start`);
    assert(lc.hasGoal, `level ${lc.name} has no goal/NPC/exit`);
  }
  assert(levelCheck.filter(l => !l.name.includes('sub')).length === 12,
    `expected 12 levels, got ${levelCheck.length}`);

  // --- enter the map ---
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  scene = await page.evaluate(() => Game.sceneName);
  assert(scene === 'map', `expected map scene, got ${scene}`);
  await shot('02-map');

  // --- start level 1-1 (intro card) ---
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  scene = await page.evaluate(() => Game.sceneName);
  assert(scene === 'intro', `expected intro scene, got ${scene}`);
  await shot('03-intro');

  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  scene = await page.evaluate(() => Game.sceneName);
  assert(scene === 'level', `expected level scene, got ${scene}`);
  await shot('04-level-1-1-start');

  // --- mechanics: stomp a yak ---
  const stomp = await page.evaluate(() => {
    const lvl = Game.level, p = lvl.player;
    const yak = lvl.area.entities.find(e => e instanceof Yak);
    const before = Game.run.score;
    p.x = yak.x + 2; p.y = yak.y - 40; p.vy = 50; // drop onto it
    return new Promise((res) => setTimeout(() => res({
      squashed: yak.squashed > 0 || yak.removed,
      bounced: p.vy < 0 || p.y < yak.y - 10,
      scored: Game.run.score > before,
    }), 350));
  });
  assert(stomp.squashed, 'yak was not squashed by stomp');
  assert(stomp.scored, 'stomp did not add score');

  // --- mechanics: bump the momo block, grab the momo, grow ---
  const grow = await page.evaluate(() => {
    const lvl = Game.level, p = lvl.player;
    // 1-1 has an 'M' block at tile (16,9)
    lvl.bumpTile(16, 9, p);
    const item = lvl.area.entities.find(e => e.isItem);
    if (!item) return { item: false };
    item.emerging = 0;                 // skip the rise animation
    p.invuln = 0;
    p.x = item.x; p.y = item.y - 20; p.vx = 0; p.vy = 0;
    return new Promise((res) => setTimeout(() => res({
      item: true,
      growing: p.pendingGrow > 0 || p.size === 1,
    }), 400));
  });
  assert(grow.item, 'momo did not spawn from M block');
  assert(grow.growing, 'player did not grow after momo');
  await page.waitForTimeout(900);
  const size = await page.evaluate(() => Game.level.player.size);
  assert(size === 1, `player size should be 1 (big), got ${size}`);

  // --- play: clear enemies, then run right with jumps ---
  await page.evaluate(() => {
    for (const e of Game.level.area.entities) if (e.isEnemy) e.removed = true;
  });
  await page.keyboard.down('ArrowRight');
  await page.keyboard.down('ShiftLeft');
  for (let i = 0; i < 5; i++) {
    await page.keyboard.down('Space');
    await page.waitForTimeout(250);
    await page.keyboard.up('Space');
    await page.waitForTimeout(350);
  }
  await page.keyboard.up('ShiftLeft');
  await page.keyboard.up('ArrowRight');
  await shot('05-level-1-1-running');

  const state = await page.evaluate(() => ({
    px: Game.level.player.x,
    dying: Game.level.player.dying,
    mode: Game.level.mode,
    cam: Game.level.camX,
    time: Game.level.time,
  }));
  assert(!state.dying, 'player died unexpectedly while running');
  assert(state.px > 400, `player did not run right (x=${state.px})`);
  assert(state.cam > 100, `camera did not follow (cam=${state.cam})`);
  assert(state.time < 300 && state.time > 200, `timer looks wrong: ${state.time}`);

  // --- teleport near the bell to verify the finish flow ---
  await page.evaluate(() => {
    const goal = Game.level.area.entities.find(e => e.isGoal);
    Game.level.player.x = goal.x - 60;
    Game.level.player.y = 120;
    Game.level.player.vy = 0;
  });
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(2500);
  await page.keyboard.up('ArrowRight');
  const finMode = await page.evaluate(() => Game.level && Game.level.mode);
  assert(finMode === 'finished', `expected finished mode at bell, got ${finMode}`);
  await shot('06-level-finish');

  // wait through the tally back to the map
  await page.waitForTimeout(6000);
  scene = await page.evaluate(() => Game.sceneName);
  assert(scene === 'map', `expected map after clear, got ${scene}`);
  const unlocked = await page.evaluate(() => Save.data.unlocked);
  assert(unlocked >= 1, `level 2 not unlocked (unlocked=${unlocked})`);
  await shot('07-map-after-clear');

  // --- visit each remaining level briefly to ensure they boot & render ---
  for (let idx = 1; idx < 12; idx++) {
    await page.evaluate((i) => { Save.data.unlocked = i; Game.startLevel(i); }, idx);
    await page.waitForTimeout(150);
    await page.keyboard.press('Enter'); // skip intro
    await page.waitForTimeout(500);
    const ok = await page.evaluate(() =>
      Game.sceneName === 'level' && Game.level && !Game.level.player.dying);
    assert(ok, `level index ${idx} failed to start cleanly`);
    if (idx === 3 || idx === 7 || idx === 11) {
      await shot('08-level-' + (idx + 1) + '-boot');
    }
  }

  // --- boss sanity: teleport to the yeti, verify fight activates ---
  await page.evaluate(() => {
    const yeti = Game.level.area.entities.find(e => e.isBoss);
    Game.level.player.x = yeti.x - 150;
    Game.level.player.y = 100;
  });
  await page.waitForTimeout(1200);
  const bossState = await page.evaluate(() => {
    const yeti = Game.level.area.entities.find(e => e.isBoss);
    return { active: yeti.active, lock: !!Game.level.bossLock };
  });
  assert(bossState.active, 'yeti did not activate');
  assert(bossState.lock, 'boss camera lock missing');
  await shot('09-yeti-fight');

  if (errors.length) {
    console.error('PAGE ERRORS:\n' + errors.join('\n'));
    process.exit(1);
  }
  await browser.close();
  console.log('SMOKE TEST PASSED — screenshots in test/screenshots/');
}

function assert(cond, msg) {
  if (!cond) {
    console.error('ASSERTION FAILED: ' + msg);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
