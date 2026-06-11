'use strict';
// ---------------------------------------------------------------------------
// Backgrounds — layered parallax scenery per theme, pre-rendered to
// horizontally tileable offscreen canvases.
// ---------------------------------------------------------------------------

const Backgrounds = {};

function _bgLayer(w, h, painter) {
  const c = makeCanvas(w, h);
  painter(c.getContext('2d'), w, h);
  return c;
}

// Jagged snow-capped Himalayan ridge
function paintPeaks(g, w, h, baseColor, snowColor, seed, peakH, jag) {
  const rng = makeRng(seed);
  const pts = [];
  const n = 9;
  for (let i = 0; i <= n; i++) {
    pts.push({ x: (w / n) * i, y: h - peakH * (0.45 + rng() * 0.55) });
  }
  pts[n].y = pts[0].y; // tileable
  g.fillStyle = baseColor;
  g.beginPath();
  g.moveTo(0, h);
  for (let i = 0; i <= n; i++) {
    g.lineTo(pts[i].x, pts[i].y);
    if (i < n) {
      const mx = (pts[i].x + pts[i + 1].x) / 2;
      g.lineTo(mx, Math.min(pts[i].y, pts[i + 1].y) + jag + rng() * jag);
    }
  }
  g.lineTo(w, h);
  g.fill();
  // snow caps
  g.fillStyle = snowColor;
  for (let i = 0; i <= n; i++) {
    const px = pts[i].x, py = pts[i].y;
    g.beginPath();
    g.moveTo(px - 11, py + 9);
    g.lineTo(px, py - 1);
    g.lineTo(px + 11, py + 9);
    g.lineTo(px + 6, py + 7); g.lineTo(px + 3, py + 10);
    g.lineTo(px - 3, py + 8); g.lineTo(px - 6, py + 11);
    g.fill();
  }
}

// Soft rounded hills
function paintHills(g, w, h, color, seed, hillH) {
  const rng = makeRng(seed);
  g.fillStyle = color;
  const n = 5;
  g.beginPath();
  g.moveTo(0, h);
  let firstY = h - hillH * (0.5 + rng() * 0.5);
  let prevY = firstY;
  g.lineTo(0, prevY);
  for (let i = 1; i <= n; i++) {
    const x = (w / n) * i;
    const y = i === n ? firstY : h - hillH * (0.4 + rng() * 0.6);
    g.quadraticCurveTo(x - w / n / 2, Math.min(prevY, y) - hillH * 0.35, x, y);
    prevY = y;
  }
  g.lineTo(w, h);
  g.fill();
}

// Terraced farm bands carved into a hill layer
function paintTerraces(g, w, h, seed) {
  const rng = makeRng(seed);
  for (let i = 0; i < 4; i++) {
    const y = h - 14 - i * 13;
    g.fillStyle = i % 2 ? '#5aa04c' : '#6ab058';
    g.beginPath();
    g.moveTo(0, h);
    g.lineTo(0, y + Math.sin(i) * 3);
    for (let x = 0; x <= w; x += 32) {
      g.lineTo(x, y + Math.sin((x / 53) + i * 2) * 4);
    }
    g.lineTo(w, h);
    g.fill();
    g.strokeStyle = '#46804038';
    g.beginPath();
    for (let x = 0; x <= w; x += 32) {
      const yy = y + Math.sin((x / 53) + i * 2) * 4 + 6;
      g.lineTo(x, yy);
    }
    g.stroke();
  }
  // tiny tea-house
  const hx = 60 + rng() * 100;
  g.fillStyle = '#7a4a26'; g.fillRect(hx, h - 46, 22, 12);
  g.fillStyle = '#a83030';
  g.beginPath(); g.moveTo(hx - 4, h - 46); g.lineTo(hx + 11, h - 56); g.lineTo(hx + 26, h - 46); g.fill();
  g.fillStyle = '#f8d878'; g.fillRect(hx + 4, h - 43, 4, 4); g.fillRect(hx + 14, h - 43, 4, 4);
}

// Dharahara — slender white nine-ring tower with a dome and gilt spire
function paintDharahara(g, x, baseY, scale, opts = {}) {
  const body = opts.body || '#f0eee8';
  const shade = opts.shade || '#c4c0b4';
  const ring = opts.ring || '#a8a498';
  const h = 64 * scale;
  const wBase = 14 * scale, wTop = 8 * scale;
  // tapering shaft
  g.fillStyle = body;
  g.beginPath();
  g.moveTo(x - wBase / 2, baseY);
  g.lineTo(x - wTop / 2, baseY - h);
  g.lineTo(x + wTop / 2, baseY - h);
  g.lineTo(x + wBase / 2, baseY);
  g.fill();
  g.fillStyle = shade;
  g.beginPath();
  g.moveTo(x + wBase / 6, baseY);
  g.lineTo(x + wTop / 6, baseY - h);
  g.lineTo(x + wTop / 2, baseY - h);
  g.lineTo(x + wBase / 2, baseY);
  g.fill();
  // nine story rings
  g.fillStyle = ring;
  for (let i = 1; i <= 9; i++) {
    const ry = baseY - (h * i) / 10;
    const rw = wBase + (wTop - wBase) * (i / 10);
    g.fillRect(x - rw / 2 - scale, ry, rw + 2 * scale, Math.max(1, scale));
  }
  // balcony near the top
  g.fillStyle = shade;
  g.fillRect(x - wTop / 2 - 2 * scale, baseY - h + 6 * scale, wTop + 4 * scale, 2 * scale);
  // dome + gilt spire
  g.fillStyle = body;
  g.beginPath(); g.arc(x, baseY - h, wTop / 2, Math.PI, 0); g.fill();
  g.fillStyle = '#d8a830';
  g.fillRect(x - scale, baseY - h - 7 * scale, 2 * scale, 7 * scale);
}

// Newari pagoda temple — stacked sloped roofs on a brick base
function paintPagoda(g, x, baseY, scale, opts = {}) {
  const roof = opts.roof || '#4a3424';
  const brick = opts.brick || '#8a4a32';
  const trim = opts.trim || '#3a2818';
  const tiers = opts.tiers || 3;
  let w = 40 * scale;
  let y = baseY;
  // plinth steps
  g.fillStyle = trim;
  g.fillRect(x - w / 2 - 4 * scale, y - 3 * scale, w + 8 * scale, 3 * scale);
  for (let t = 0; t < tiers; t++) {
    const bodyH = (t === 0 ? 14 : 9) * scale;
    const roofH = 8 * scale;
    // brick body
    g.fillStyle = brick;
    g.fillRect(x - w / 2 + 5 * scale, y - 3 * scale - bodyH, w - 10 * scale, bodyH);
    if (t === 0 && opts.lit !== false) { // doorway / window glow
      g.fillStyle = opts.lit ? '#f8c850' : trim;
      g.fillRect(x - 3 * scale, y - 3 * scale - 8 * scale, 6 * scale, 8 * scale);
    }
    y = y - 3 * scale - bodyH;
    // sloped roof with upturned ends
    g.fillStyle = roof;
    g.beginPath();
    g.moveTo(x - w / 2 - 3 * scale, y);
    g.lineTo(x, y - roofH);
    g.lineTo(x + w / 2 + 3 * scale, y);
    g.fill();
    g.fillRect(x - w / 2 - 4 * scale, y - scale, 3 * scale, 2 * scale);
    g.fillRect(x + w / 2 + scale, y - scale, 3 * scale, 2 * scale);
    y -= roofH;
    w *= 0.62;
  }
  // golden gajur
  g.fillStyle = '#d8a830';
  g.fillRect(x - scale, y - 6 * scale, 2 * scale, 6 * scale);
}

// Boudhanath — white dome, gilded harmika with painted eyes, stepped spire
function paintBoudhanath(g, x, baseY, scale, opts = {}) {
  const dome = opts.dome || '#ece9e0';
  const domeShade = opts.shade || '#c8c4b6';
  const gold = opts.gold || '#d8a830';
  const eye = opts.eyes || '#26303e';
  const r = 16 * scale;
  // plinth
  g.fillStyle = domeShade;
  g.fillRect(x - r - 4 * scale, baseY - 3 * scale, 2 * r + 8 * scale, 3 * scale);
  // dome
  g.fillStyle = dome;
  g.beginPath(); g.arc(x, baseY - 3 * scale, r, Math.PI, 0); g.fill();
  g.fillStyle = domeShade;
  g.beginPath(); g.arc(x + r * 0.35, baseY - 3 * scale, r * 0.62, Math.PI * 1.5, 0); g.fill();
  const topY = baseY - 3 * scale - r;
  // harmika (the eye block)
  const hw = 9 * scale, hh = 8 * scale;
  g.fillStyle = '#f4f0e4';
  g.fillRect(x - hw / 2, topY - hh, hw, hh);
  g.fillStyle = gold;
  g.fillRect(x - hw / 2, topY - hh, hw, scale);
  // the eyes of the Buddha
  g.fillStyle = eye;
  g.fillRect(x - hw / 2 + scale, topY - hh + 2 * scale, 2.6 * scale, 1.6 * scale);
  g.fillRect(x + hw / 2 - scale - 2.6 * scale, topY - hh + 2 * scale, 2.6 * scale, 1.6 * scale);
  g.fillRect(x - 0.6 * scale, topY - hh + 4 * scale, 1.2 * scale, 2.4 * scale); // nose curl
  // thirteen-step gilded spire
  g.fillStyle = gold;
  const spireH = 12 * scale;
  g.beginPath();
  g.moveTo(x - hw / 2, topY - hh);
  g.lineTo(x, topY - hh - spireH);
  g.lineTo(x + hw / 2, topY - hh);
  g.fill();
  g.fillStyle = opts.spireLine || '#b8882a';
  for (let i = 1; i < 5; i++) {
    const sy = topY - hh - (spireH * i) / 5;
    const sw = hw * (1 - i / 5);
    g.fillRect(x - sw / 2, sy, sw, Math.max(1, scale * 0.8));
  }
  // parasol
  g.fillStyle = gold;
  g.fillRect(x - 2.4 * scale, topY - hh - spireH - 2 * scale, 4.8 * scale, scale);
  // prayer-flag strings from the spire
  if (opts.flags !== false) {
    const cols = ['#3a6ee8', '#f8f8f8', '#e83a3a', '#3aa83a', '#f8d030'];
    for (const dir of [-1, 1]) {
      const fx = x + dir * (r + 8 * scale);
      g.strokeStyle = 'rgba(220,210,180,0.7)';
      g.beginPath();
      g.moveTo(x + dir * scale, topY - hh - spireH);
      g.quadraticCurveTo(x + dir * (r * 0.7), topY - r * 0.4, fx, baseY - 6 * scale);
      g.stroke();
      for (let i = 0; i < 3; i++) {
        const t = 0.3 + i * 0.25;
        const px = x + dir * scale + (fx - x - dir * scale) * t;
        const py = (topY - hh - spireH) * (1 - t) * (1 - t) +
          (topY - r * 0.4) * 2 * t * (1 - t) + (baseY - 6 * scale) * t * t;
        g.fillStyle = cols[(i * 2 + (dir > 0 ? 1 : 0)) % 5];
        g.fillRect(px - scale, py, 2.4 * scale, 2.4 * scale);
      }
    }
  }
}

// Monastery silhouette for night layers
function paintMonastery(g, x, baseY, scale, lit) {
  const w = 56 * scale, hWall = 26 * scale;
  g.fillStyle = '#241f33';
  g.fillRect(x, baseY - hWall, w, hWall);
  // sloped golden roof
  g.fillStyle = lit ? '#6a5a30' : '#39314a';
  g.beginPath();
  g.moveTo(x - 6 * scale, baseY - hWall);
  g.lineTo(x + w / 2, baseY - hWall - 16 * scale);
  g.lineTo(x + w + 6 * scale, baseY - hWall);
  g.fill();
  // windows
  g.fillStyle = lit ? '#f8c850' : '#473d5e';
  for (let i = 0; i < 3; i++)
    g.fillRect(x + (8 + i * 16) * scale, baseY - hWall + 8 * scale, 6 * scale, 8 * scale);
}

function paintStupa(g, x, baseY, scale) {
  g.fillStyle = '#d8d4c8';
  g.fillRect(x, baseY - 8 * scale, 24 * scale, 8 * scale);
  g.beginPath(); g.arc(x + 12 * scale, baseY - 9 * scale, 9 * scale, Math.PI, 0); g.fill();
  g.fillStyle = '#e8b83a';
  g.fillRect(x + 9 * scale, baseY - 26 * scale, 6 * scale, 9 * scale);
  g.beginPath();
  g.moveTo(x + 8 * scale, baseY - 26 * scale);
  g.lineTo(x + 12 * scale, baseY - 33 * scale);
  g.lineTo(x + 16 * scale, baseY - 26 * scale);
  g.fill();
  // painted eyes
  g.fillStyle = '#2a2a3a';
  g.fillRect(x + 9.5 * scale, baseY - 24 * scale, 2 * scale, 1.5 * scale);
  g.fillRect(x + 12.5 * scale, baseY - 24 * scale, 2 * scale, 1.5 * scale);
}

function buildBackgrounds() {
  // ---- HILLS (day) ----
  Backgrounds.hills = {
    sky: (g) => {
      const grd = g.createLinearGradient(0, 0, 0, VIEW_H);
      grd.addColorStop(0, '#6ec6f0');
      grd.addColorStop(0.7, '#a8e0f8');
      grd.addColorStop(1, '#d0f0ff');
      g.fillStyle = grd; g.fillRect(0, 0, VIEW_W, VIEW_H);
    },
    layers: [
      { c: _bgLayer(512, 150, (g, w, h) => paintPeaks(g, w, h, '#b8cce8', '#f0f6ff', 11, 105, 14)), factor: 0.12, y: 28 },
      { c: _bgLayer(512, 110, (g, w, h) => {
          paintHills(g, w, h, '#7ec06a', 23, 70);
          paintPagoda(g, 120, h - 12, 0.9, { lit: false });
          paintDharahara(g, 395, h - 6, 0.9);
        }), factor: 0.3, y: 112 },
      { c: _bgLayer(512, 64, (g, w, h) => paintTerraces(g, w, h, 31)), factor: 0.55, y: 160 },
    ],
    clouds: true,
  };

  // ---- NIGHT (monastery hills) ----
  Backgrounds.night = {
    sky: (g) => {
      const grd = g.createLinearGradient(0, 0, 0, VIEW_H);
      grd.addColorStop(0, '#0c1030');
      grd.addColorStop(0.6, '#1e2248');
      grd.addColorStop(1, '#343060');
      g.fillStyle = grd; g.fillRect(0, 0, VIEW_W, VIEW_H);
      // stars + moon
      const rng = makeRng(99);
      g.fillStyle = '#e8ecff';
      for (let i = 0; i < 40; i++) {
        g.fillRect(Math.floor(rng() * VIEW_W), Math.floor(rng() * 130), 1, 1);
      }
      g.fillStyle = '#f4f0d8';
      g.beginPath(); g.arc(320, 38, 13, 0, 7); g.fill();
      g.fillStyle = '#d8d4bc';
      g.fillRect(315, 33, 3, 3); g.fillRect(322, 41, 4, 3); g.fillRect(318, 38, 2, 2);
    },
    layers: [
      { c: _bgLayer(512, 150, (g, w, h) => paintPeaks(g, w, h, '#2a2a4e', '#7a7aa8', 17, 105, 14)), factor: 0.12, y: 30 },
      { c: _bgLayer(512, 110, (g, w, h) => {
          paintHills(g, w, h, '#1c1c3a', 29, 70);
          paintMonastery(g, 90, h, 1, true);
          paintPagoda(g, 350, h - 16, 0.8, {
            roof: '#262040', brick: '#322a4a', trim: '#1e1834', lit: true,
          });
          paintBoudhanath(g, 230, h, 1.15, {
            dome: '#3a3458', shade: '#2c2746', gold: '#8a7434',
            eyes: '#f8c850', spireLine: '#6a5828', flags: false,
          });
        }), factor: 0.3, y: 116 },
    ],
    clouds: false,
  };

  // ---- CAVE ----
  Backgrounds.cave = {
    sky: (g) => {
      g.fillStyle = '#16121e'; g.fillRect(0, 0, VIEW_W, VIEW_H);
    },
    layers: [
      { c: _bgLayer(512, 200, (g, w, h) => {
          const rng = makeRng(41);
          g.fillStyle = '#241e30';
          for (let i = 0; i < 9; i++) {
            const x = rng() * w, ww = 30 + rng() * 60, hh = 40 + rng() * 120;
            g.fillRect(x, h - hh, ww, hh);
          }
          // stalactites
          g.fillStyle = '#2e2640';
          for (let i = 0; i < 14; i++) {
            const x = rng() * w;
            g.beginPath();
            g.moveTo(x, 0); g.lineTo(x + 9, 0); g.lineTo(x + 4, 24 + rng() * 30);
            g.fill();
          }
          // glints
          g.fillStyle = '#5a78b0';
          for (let i = 0; i < 12; i++) g.fillRect(rng() * w, 60 + rng() * 120, 2, 2);
        }), factor: 0.25, y: 30 },
    ],
    clouds: false,
  };

  // ---- SNOW (high passes) ----
  Backgrounds.snow = {
    sky: (g) => {
      const grd = g.createLinearGradient(0, 0, 0, VIEW_H);
      grd.addColorStop(0, '#8aa6c8');
      grd.addColorStop(0.6, '#c2d4e8');
      grd.addColorStop(1, '#e8f2fc');
      g.fillStyle = grd; g.fillRect(0, 0, VIEW_W, VIEW_H);
    },
    layers: [
      { c: _bgLayer(512, 170, (g, w, h) => paintPeaks(g, w, h, '#9eb4d2', '#ffffff', 53, 125, 16)), factor: 0.1, y: 16 },
      { c: _bgLayer(512, 120, (g, w, h) => paintPeaks(g, w, h, '#c8d8ec', '#ffffff', 61, 85, 12)), factor: 0.28, y: 90 },
      { c: _bgLayer(512, 60, (g, w, h) => {
          paintHills(g, w, h, '#e2ecf8', 67, 38);
          paintBoudhanath(g, 160, h, 0.6, {
            dome: '#f4f6fa', shade: '#c8d4e4', flags: true,
          });
        }), factor: 0.5, y: 168 },
    ],
    clouds: true,
  };

  // ---- FORTRESS (interior) ----
  Backgrounds.fortress = {
    sky: (g) => {
      g.fillStyle = '#1c1722'; g.fillRect(0, 0, VIEW_W, VIEW_H);
    },
    layers: [
      { c: _bgLayer(384, 220, (g, w, h) => {
          // stone wall pattern
          g.fillStyle = '#272030';
          g.fillRect(0, 0, w, h);
          g.fillStyle = '#2e2738';
          for (let y = 0; y < h; y += 24) {
            for (let x = (y / 24) % 2 ? 0 : 24; x < w; x += 48) {
              g.fillRect(x + 1, y + 1, 46, 22);
            }
          }
          // columns
          g.fillStyle = '#382e44';
          for (let x = 40; x < w; x += 120) {
            g.fillRect(x, 20, 18, h);
            g.fillStyle = '#443852'; g.fillRect(x, 20, 4, h); g.fillStyle = '#382e44';
            g.fillRect(x - 5, 12, 28, 10);
          }
          // hanging banners
          for (let x = 95; x < w; x += 120) {
            g.fillStyle = '#7a2828';
            g.fillRect(x, 8, 16, 48);
            g.fillStyle = '#e8b83a';
            g.fillRect(x + 6, 40, 4, 8);
          }
        }), factor: 0.4, y: 10 },
    ],
    clouds: false,
  };
}

// Cloud puffs drawn over sky for outdoor themes
const _cloudCanvas = (() => {
  const c = makeCanvas(56, 20);
  const g = c.getContext('2d');
  g.fillStyle = 'rgba(255,255,255,0.92)';
  g.beginPath(); g.arc(14, 13, 8, 0, 7); g.fill();
  g.beginPath(); g.arc(28, 9, 11, 0, 7); g.fill();
  g.beginPath(); g.arc(43, 13, 8, 0, 7); g.fill();
  g.fillRect(12, 13, 33, 7);
  return c;
})();

function drawBackground(ctx, theme, camX, time) {
  const bg = Backgrounds[theme] || Backgrounds.hills;
  bg.sky(ctx);
  if (bg.clouds) {
    for (let i = 0; i < 4; i++) {
      const cx = ((i * 173 + time * (5 + i * 2.5) - camX * 0.06) % (VIEW_W + 80)) - 60;
      const cy = 18 + i * 26;
      ctx.drawImage(_cloudCanvas, Math.round(cx < -60 ? cx + VIEW_W + 80 : cx), cy);
    }
  }
  for (const layer of bg.layers) {
    const w = layer.c.width;
    let off = -((camX * layer.factor) % w);
    if (off > 0) off -= w;
    for (let x = off; x < VIEW_W; x += w) {
      ctx.drawImage(layer.c, Math.round(x), layer.y);
    }
  }
}
