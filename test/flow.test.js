'use strict';
// ---------------------------------------------------------------------------
// Flow test — deep end-to-end checks: wells, power-ups, all three bosses,
// the yeti lever finale, the ending, and game over.
// ---------------------------------------------------------------------------

const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const SHOT_DIR = path.join(__dirname, 'screenshots');

function assert(cond, msg) {
  if (!cond) { console.error('ASSERTION FAILED: ' + msg); process.exit(1); }
}

async function main() {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 520 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('file://' + path.join(__dirname, '..', 'index.html'));
  await page.waitForTimeout(600);
  const shot = (n) => page.screenshot({ path: path.join(SHOT_DIR, n + '.png') });

  const startLevel = async (idx) => {
    await page.evaluate((i) => {
      Save.data.unlocked = 11;
      Game.newRun();
      Game.startLevel(i);
      Game.beginLevel(i); // skip intro card
    }, idx);
    await page.waitForTimeout(200);
  };

  // ================= 1: well round trip in 1-1 =================
  await startLevel(0);
  // clear the wildlife so teleport-based checks are deterministic
  await page.evaluate(() => {
    for (const area of Game.level.areas)
      area.entities = area.entities.filter(e => !e.isEnemy);
  });
  await page.evaluate(() => {
    const well = Game.level.area.wells.find(w => w.enterable);
    const p = Game.level.player;
    p.x = well.x + 10; p.y = well.y - p.h - 1; p.vy = 0;
  });
  await page.keyboard.down('ArrowDown');
  await page.waitForTimeout(300);
  await page.keyboard.up('ArrowDown');
  await page.waitForTimeout(1600);
  let areaIdx = await page.evaluate(() => Game.level.areaIdx);
  assert(areaIdx === 1, `expected sub-area after well, got area ${areaIdx}`);
  await shot('10-bonus-cave');
  // exit back
  await page.evaluate(() => {
    const well = Game.level.area.wells.find(w => w.enterable);
    const p = Game.level.player;
    p.x = well.x + 10; p.y = well.y - p.h - 1; p.vy = 0;
  });
  await page.keyboard.down('ArrowDown');
  await page.waitForTimeout(300);
  await page.keyboard.up('ArrowDown');
  await page.waitForTimeout(1600);
  areaIdx = await page.evaluate(() => Game.level.areaIdx);
  assert(areaIdx === 0, `expected main area after exit well, got ${areaIdx}`);

  // ================= 2: chiya rush + khukuri throws =================
  const power = await page.evaluate(() => {
    const lvl = Game.level, p = lvl.player;
    p.setSize(2);
    lvl.spawn(new Chiya(p.x + 4, p.y - 10));
    const chiya = lvl.area.entities.find(e => e.kind === 'chiya');
    chiya.emerging = 0;
    return new Promise((res) => setTimeout(() => res({
      star: p.star > 8,
      music: Audio_.currentMusic,
    }), 300));
  });
  assert(power.star, 'chiya did not grant star time');
  assert(power.music === 'chiya', `chiya music not playing (${power.music})`);
  await page.keyboard.press('KeyX');
  await page.waitForTimeout(120);
  const projCount = await page.evaluate(() => Game.level.countProjectiles());
  assert(projCount === 1, `expected 1 khukuri in flight, got ${projCount}`);
  await shot('11-chiya-khukuri');

  // ================= 3: Bandit Boar fight (1-4) =================
  await startLevel(3);
  await page.evaluate(() => {
    const boss = Game.level.area.entities.find(e => e.isBoss);
    const p = Game.level.player;
    p.x = boss.x - 180; p.y = 150;
  });
  await page.waitForTimeout(900);
  let boss = await page.evaluate(() => {
    const b = Game.level.area.entities.find(e => e.isBoss);
    return { active: b.active, hp: b.hp };
  });
  assert(boss.active, 'boar did not activate');
  // stomp him until defeated (held still per attempt for determinism)
  for (let i = 0; i < 8; i++) {
    const dead = await page.evaluate(() => {
      const b = Game.level.area.entities.find(e => e.isBoss);
      if (b.dead) return true;
      const p = Game.level.player;
      b.hitInvuln = 0;
      b.state = 'stun'; b.timer = 0.6; b.vx = 0;
      p.invuln = 2; // survive the proximity
      p.x = b.x + b.w / 2 - p.w / 2; p.y = b.y - 40; p.vy = 100;
      return false;
    });
    if (dead) break;
    await page.waitForTimeout(450);
  }
  boss = await page.evaluate(() => {
    const b = Game.level.area.entities.find(e => e.isBoss);
    return { dead: b.dead, lock: !!Game.level.bossLock };
  });
  assert(boss.dead, 'boar not defeated by stomps');
  assert(!boss.lock, 'camera lock not released after boss defeat');
  await shot('12-boar-defeated');

  // touch the elder -> dialog -> finish
  await page.evaluate(() => {
    const elder = Game.level.area.entities.find(e => e.isNPC);
    const p = Game.level.player;
    p.x = elder.x - 4; p.y = elder.y; p.vy = 0;
  });
  await page.waitForTimeout(400);
  let mode = await page.evaluate(() => Game.level.mode);
  assert(mode === 'dialog', `expected elder dialog, got ${mode}`);
  await shot('13-elder-dialog');
  await page.waitForTimeout(900);
  await page.keyboard.press('Space');
  await page.waitForTimeout(300);
  mode = await page.evaluate(() => Game.level.mode);
  assert(mode === 'finished', `expected finished after dialog, got ${mode}`);

  // ================= 4: Langur King (2-4) =================
  await startLevel(7);
  await page.evaluate(() => {
    const b = Game.level.area.entities.find(e => e.isBoss);
    Game.level.player.x = b.x - 170; Game.level.player.y = 130;
  });
  await page.waitForTimeout(900);
  const kingActive = await page.evaluate(() =>
    Game.level.area.entities.find(e => e.isBoss).active);
  assert(kingActive, 'langur king did not activate');
  // kill with khukuri projectiles (spawned right on him for determinism)
  for (let i = 0; i < 10; i++) {
    const dead = await page.evaluate(() => {
      const b = Game.level.area.entities.find(e => e.isBoss);
      if (b.dead) return true;
      b.hitInvuln = 0;
      Game.level.player.invuln = 2;
      Game.level.spawn(new KhukuriProj(b.x - 12, b.cy - 4, 1));
      return false;
    });
    if (dead) break;
    await page.waitForTimeout(350);
  }
  const kingDead = await page.evaluate(() =>
    Game.level.area.entities.find(e => e.isBoss).dead);
  assert(kingDead, 'langur king not defeated by khukuris');
  await shot('14-king-defeated');

  // ================= 5: YETI finale (3-4) =================
  await startLevel(11);
  await page.evaluate(() => {
    const b = Game.level.area.entities.find(e => e.isBoss);
    Game.level.player.x = b.x - 170; Game.level.player.y = 110;
  });
  await page.waitForTimeout(900);
  const yetiActive = await page.evaluate(() =>
    Game.level.area.entities.find(e => e.isBoss).active);
  assert(yetiActive, 'yeti did not activate');
  // dash to the lever (invulnerable for test determinism)
  await page.evaluate(() => {
    const lever = Game.level.area.entities.find(e => e.isLever);
    const p = Game.level.player;
    p.invuln = 3;
    p.x = lever.x - 6; p.y = lever.y - 4; p.vy = 0;
  });
  await page.waitForTimeout(500);
  const leverState = await page.evaluate(() => ({
    pulled: Game.level.area.entities.find(e => e.isLever).pulled,
    falling: Game.level.area.entities.find(e => e.isBoss).falling,
  }));
  assert(leverState.pulled, 'lever was not pulled');
  assert(leverState.falling, 'yeti did not fall with the bridge');
  await shot('15-bridge-collapse');
  await page.waitForTimeout(2800);
  // bridge tiles gone?
  const bridgeLeft = await page.evaluate(() => {
    let n = 0;
    const a = Game.level.area;
    for (let i = 0; i < a.grid.length; i++) if (a.grid[i] === T.BRIDGE) n++;
    return n;
  });
  assert(bridgeLeft === 0, `bridge tiles remain after collapse: ${bridgeLeft}`);
  // reach Maya -> ending
  await page.evaluate(() => {
    const maya = Game.level.area.entities.find(e => e.isNPC);
    const p = Game.level.player;
    p.x = maya.x - 4; p.y = maya.y; p.vy = 0;
  });
  await page.waitForTimeout(600);
  const sceneEnd = await page.evaluate(() => Game.sceneName);
  assert(sceneEnd === 'ending', `expected ending scene, got ${sceneEnd}`);
  await page.waitForTimeout(3500);
  await shot('16-ending');

  // ================= 6: game over flow =================
  await startLevel(0);
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => { if (Game.level) Game.level.player.die(Game.level); });
    await page.waitForTimeout(2600);
    // skip intro card between lives
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
  }
  const goScene = await page.evaluate(() => Game.sceneName);
  assert(goScene === 'gameover', `expected gameover scene, got ${goScene}`);
  await shot('17-gameover');
  await page.waitForTimeout(1800);
  await page.keyboard.press('Enter'); // TRY AGAIN
  await page.waitForTimeout(400);
  const retryScene = await page.evaluate(() => Game.sceneName);
  assert(retryScene === 'intro' || retryScene === 'level',
    `expected retry to restart level, got ${retryScene}`);

  if (errors.length) {
    console.error('PAGE ERRORS:\n' + errors.join('\n'));
    process.exit(1);
  }
  await browser.close();
  console.log('FLOW TEST PASSED');
}

main().catch((e) => { console.error(e); process.exit(1); });
