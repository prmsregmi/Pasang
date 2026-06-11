'use strict';
// Renders the creature/item sprite set on a neutral grid for visual review.
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const SHOT_DIR = path.join(__dirname, 'screenshots');
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await page.goto('file://' + path.join(__dirname, '..', 'index.html'));
  await page.waitForTimeout(600);

  await page.evaluate(() => {
    const names = [
      'yak1', 'yak2', 'pika1', 'langur1', 'langur_ball1', 'gorak1', 'gorak2',
      'gorak_walk', 'snapper1', 'snapper2', 'leopard1', 'leopard_pounce',
      'icespirit1', 'it_momo', 'it_chiya', 'it_khukuri', 'it_selroti',
      'npflag1', 'npflag2', 'shrine', 'p_sm_idle', 'p_big_idle',
    ];
    const c = document.createElement('canvas');
    c.id = 'gallery';
    c.width = 320; c.height = 200;
    c.style.cssText = 'position:fixed;left:0;top:0;width:960px;height:600px;z-index:99;image-rendering:pixelated;background:#567;';
    document.body.appendChild(c);
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    let x = 8, y = 8, rowH = 0;
    for (const n of names) {
      const s = Sprites[n];
      if (!s) continue;
      if (x + s.w > 312) { x = 8; y += rowH + 10; rowH = 0; }
      g.fillStyle = 'rgba(255,255,255,0.08)';
      g.fillRect(x - 2, y - 2, s.w + 4, s.h + 4);
      g.drawImage(s.c, x, y);
      x += s.w + 12;
      rowH = Math.max(rowH, s.h);
    }
  });
  await page.locator('#gallery').screenshot({ path: path.join(SHOT_DIR, '30-gallery.png') });
  await browser.close();
  console.log('GALLERY DONE');
})();
