'use strict';
// ---------------------------------------------------------------------------
// LevelState — ASCII decoder, tile runtime, camera, interactions, and the
// level flow (checkpoints, wells/sub-areas, goal bell, boss fights).
// ---------------------------------------------------------------------------

const STOMP_SCORES = [100, 200, 400, 500, 800, 1000, 2000, 4000, 5000, 8000];

function decodeArea(rows, theme, areaIndex, levelSeed) {
  const h = rows.length;
  const w = Math.max(...rows.map(r => r.length));
  const grid = new Array(w * h).fill(T.EMPTY);
  const meta = {};
  const entities = [];
  const wells = [];
  const returnMarkers = [];
  let playerStart = null;
  let goal = null;
  let enterableCount = 0;

  const at = (x, y) => (rows[y] && rows[y][x]) || '.';

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = at(x, y);
      if (ch === '.' || ch === ' ') continue;
      if (CHAR_TILES[ch] !== undefined) {
        grid[y * w + x] = CHAR_TILES[ch];
        if (CHAR_CONTENTS[ch]) meta[y * w + x] = Object.assign({}, CHAR_CONTENTS[ch]);
        continue;
      }
      const px = x * TILE, py = y * TILE;
      switch (ch) {
        case 'P': playerStart = { x: px + 2, y: py + 2 }; break;
        case '!': entities.push(new Checkpoint(px + 1, py - 10)); break;
        case '&': goal = new GoalBell(x, y + 1); break;
        case 'e': case 'w': case 'n': {
          // well occupying 2 columns from (x,y) down to solid ground
          let depth = 0;
          while (y + depth + 1 < h) {
            const below = at(x, y + depth + 1);
            if (CHAR_TILES[below] !== undefined && TileBehavior.isSolid(CHAR_TILES[below])) break;
            depth++;
            if (depth > 12) break;
          }
          grid[y * w + x] = T.WELL_TL;
          grid[y * w + x + 1] = T.WELL_TR;
          for (let d = 1; d <= depth; d++) {
            grid[(y + d) * w + x] = T.WELL_L;
            grid[(y + d) * w + x + 1] = T.WELL_R;
          }
          const well = new Well(x, y, depth, ch === 'e', ch === 'e' ? enterableCount++ : -1);
          wells.push(well);
          entities.push(well);
          if (ch === 'n') entities.push(new Snapper(px, py));
          break;
        }
        case 'X': { // exit well in a sub-area (1 tile high marker on rim)
          let depth = 0;
          while (y + depth + 1 < h) {
            const below = at(x, y + depth + 1);
            if (CHAR_TILES[below] !== undefined && TileBehavior.isSolid(CHAR_TILES[below])) break;
            depth++;
            if (depth > 12) break;
          }
          grid[y * w + x] = T.WELL_TL;
          grid[y * w + x + 1] = T.WELL_TR;
          for (let d = 1; d <= depth; d++) {
            grid[(y + d) * w + x] = T.WELL_L;
            grid[(y + d) * w + x + 1] = T.WELL_R;
          }
          const well = new Well(x, y, depth, true, -2); // -2 = exit to main
          wells.push(well);
          entities.push(well);
          break;
        }
        case 'x': returnMarkers.push({ x: px, y: py }); break;
        case 's': entities.push(new Spring(px + 1, py)); break;
        case 'm': entities.push(new Lift(px, py + 4, 'h', 40, 55)); break;
        case 'V': entities.push(new Lift(px, py + 4, 'v', 52, 45)); break;
        case 'g':
          grid[y * w + x] = T.SOLID; // anchor block
          entities.push(new FlameChain(x, y, 5, 2.0, (x % 2) ? 1 : -1));
          break;
        case 'T': entities.push(new Slab(px - 4, py)); break;
        case 'v': entities.push(new Lever(px + 2, py + 5)); break;
        case 'E': entities.push(new Elder(px + 1, py - 6, false)); break;
        case 'Y': entities.push(new Elder(px + 1, py - 4, true)); break; // Maya
        case 'y': entities.push(new Yak(px - 1, py + 4)); break;
        case 'p': entities.push(new Pika(px + 2, py + 7)); break;
        case 'k': entities.push(new Langur(px + 1, py + 1)); break;
        case 'G': entities.push(new Gorak(px + 1, py + 3)); break;
        case 'Z': entities.push(new Leopard(px - 2, py + 4)); break;
        case 'i': entities.push(new IceSpirit(px + 2, py - 22)); break;
        case '1': entities.push(new BanditBoar(px - 6, py - 2)); break;
        case '2': entities.push(new LangurKing(px - 3, py - 10)); break;
        case '3': entities.push(new Yeti(px - 7, py - 20)); break;
      }
    }
  }
  for (const e of entities) if (e.x !== undefined) e.spawnX = e.x;
  if (goal) entities.push(goal);

  // sort wells left-to-right and reassign sub-area links in x-order
  wells.sort((a, b) => a.x - b.x);
  returnMarkers.sort((a, b) => a.x - b.x);
  let ei = 0;
  for (const wl of wells) if (wl.enterable && wl.linkIndex >= 0) wl.linkIndex = ei++;

  // decorations on terrain tops (deterministic per level)
  const decor = [];
  if (theme === 'hills' || theme === 'night' || theme === 'snow') {
    const rng = makeRng(levelSeed * 31 + areaIndex * 7 + 5);
    for (let x = 1; x < w - 1; x++) {
      for (let y = 1; y < h; y++) {
        const t = grid[y * w + x];
        const above = grid[(y - 1) * w + x];
        if (t === T.TERRAIN && above === T.EMPTY) {
          const r = rng();
          if (r < 0.10 && theme !== 'snow') decor.push({ s: 'tuft', x: x * TILE, y: y * TILE - 6 });
          else if (r < 0.15 && x < w - 2 && theme === 'hills') decor.push({ s: 'bush', x: x * TILE - 8, y: y * TILE - 16 });
          else if (r < 0.18) decor.push({ s: 'mani', x: x * TILE - 4, y: y * TILE - 14 });
          else if (r < 0.20 && theme !== 'snow') decor.push({ s: 'shrine', x: x * TILE - 6, y: y * TILE - 30 });
          else if (r < 0.26) decor.push({ s: 'flags', x: x * TILE - 32, y: y * TILE - 38, anim: true });
          break; // only top surface of each column
        }
        if (t !== T.EMPTY) break;
      }
    }
  }
  if (theme === 'fortress') {
    const rng = makeRng(levelSeed * 17 + 3);
    for (let x = 4; x < w - 4; x += 6 + Math.floor(rng() * 4)) {
      decor.push({ s: 'lamp', x: x * TILE, y: 5 * TILE + Math.floor(rng() * 2) * TILE, anim: true });
    }
  }
  // the nation's flag flies beside every goal bell
  if (goal) {
    decor.push({ s: 'npflag', x: goal.x - 40, y: goal.groundY - 24, anim: true });
  }

  return { grid, w, h, meta, entities, wells, returnMarkers, decor, theme, playerStart };
}

class LevelState {
  constructor(def, game, opts = {}) {
    this.def = def;
    this.game = game;
    this.time = def.time || 300;
    this.levelTime = 0;
    this.mode = 'play'; // play | dying | finished | warp | dialog | ending
    this.checkpoint = null;
    this.bumps = [];          // animated block bumps
    this.multiCoinTimers = {};
    this.shakeTime = 0; this.shakeMag = 0;
    this.camX = 0;
    this.bossLock = null;     // {left, right}
    this.boss = null;
    this.dialog = null;
    this.warp = null;
    this.hurry = false;
    this.bridgeCollapse = null;

    const seed = (def.name || 'level').length * 13 + (def.seed || 1);
    this.areas = [decodeArea(def.rows, def.theme, 0, seed)];
    if (def.subareas) {
      def.subareas.forEach((sa, i) =>
        this.areas.push(decodeArea(sa.rows, sa.theme || 'cave', i + 1, seed)));
    }
    this.areaIdx = 0;

    const start = opts.checkpoint || this.area.playerStart || { x: 40, y: 100 };
    this.player = new Player(start.x, start.y);
    this.player.facing = 1;
    if (game.run.size > 0) this.player.setSize(game.run.size);

    this.camX = clamp(this.player.cx - VIEW_W * 0.42, 0, this.pixelW - VIEW_W);
    Audio_.playMusic(this.musicFor(this.area), { hurry: false });
  }

  get area() { return this.areas[this.areaIdx]; }
  get pixelW() { return this.area.w * TILE; }
  get pixelH() { return this.area.h * TILE; }

  musicFor(area) {
    if (this.boss && this.boss.active && !this.boss.dead) return 'boss';
    if (this.areaIdx > 0) return (this.def.subareas[this.areaIdx - 1].music) || 'cave';
    return this.def.music || 'overworld';
  }

  tileAt(tx, ty) {
    const a = this.area;
    if (tx < 0 || tx >= a.w) return T.SOLID; // level edges are walls
    if (ty < 0) return T.EMPTY;
    if (ty >= a.h) return T.EMPTY;
    return a.grid[ty * a.w + tx];
  }
  setTile(tx, ty, t) {
    const a = this.area;
    if (tx < 0 || tx >= a.w || ty < 0 || ty >= a.h) return;
    a.grid[ty * a.w + tx] = t;
  }

  // ------------------------------------------------------------------ blocks
  bumpTile(tx, ty, player) {
    const t = this.tileAt(tx, ty);
    const key = ty * this.area.w + tx;
    const meta = this.area.meta[key];
    if (t === T.Q || t === T.HIDDEN) {
      this.bumps.push({ tx, ty, t: 0 });
      this.spawnBlockContent(tx, ty, meta);
      this.setTile(tx, ty, T.USED);
      delete this.area.meta[key];
      this.bumpKillsAbove(tx, ty);
    } else if (t === T.BRICK_MULTI) {
      this.bumps.push({ tx, ty, t: 0 });
      if (this.multiCoinTimers[key] === undefined) this.multiCoinTimers[key] = 4.5;
      this.spawnBlockContent(tx, ty, { content: 'coin' });
      this.bumpKillsAbove(tx, ty);
      if (this.multiCoinTimers[key] <= 0) {
        this.setTile(tx, ty, T.USED);
        delete this.multiCoinTimers[key];
      }
    } else if (t === T.BRICK) {
      if (player.size > SIZE_SMALL) {
        // smash!
        this.setTile(tx, ty, T.EMPTY);
        Audio_.sfx('break');
        this.addScore(50, null);
        const shard = this.def.theme === 'snow' ? 'shard_snow' : 'shard';
        const px = tx * TILE + 8, py = ty * TILE + 8;
        this.spawn(new Particle(px - 6, py - 6, -70, -260, shard));
        this.spawn(new Particle(px + 2, py - 6, 70, -260, shard));
        this.spawn(new Particle(px - 6, py, -50, -160, shard));
        this.spawn(new Particle(px + 2, py, 50, -160, shard));
        this.bumpKillsAbove(tx, ty);
      } else {
        this.bumps.push({ tx, ty, t: 0 });
        this.bumpKillsAbove(tx, ty);
      }
    }
  }

  spawnBlockContent(tx, ty, meta) {
    const px = tx * TILE + 1, py = ty * TILE - 1;
    const content = meta ? meta.content : 'coin';
    if (content === 'coin') {
      this.spawn(new BlockCoin(tx * TILE + 3, ty * TILE - 12));
      this.collectCoin(1, tx * TILE + 8, ty * TILE - 8, 200);
      Audio_.sfx('coin');
    } else if (content === 'power') {
      Audio_.sfx('sprout');
      this.spawn(this.player.size === SIZE_SMALL
        ? new Momo(px, py - 11)
        : new KhukuriItem(px, py - 13));
    } else if (content === 'chiya') {
      Audio_.sfx('sprout');
      this.spawn(new Chiya(px, py - 12));
    } else if (content === 'selroti') {
      Audio_.sfx('sprout');
      this.spawn(new SelRoti(px, py - 11));
    }
  }

  bumpKillsAbove(tx, ty) {
    // enemies standing on a bumped block get launched
    for (const e of this.area.entities) {
      if (!e.isEnemy || e.dead || e.isBoss) continue;
      const onTop = Math.abs(e.bottom - ty * TILE) < 4 &&
        e.right > tx * TILE && e.x < (tx + 1) * TILE;
      if (onTop) { e.deadFall(this, e.cx < (tx + 0.5) * TILE ? -1 : 1); this.addScore(e.scoreValue, e); }
    }
  }

  takeCoinTile(tx, ty) {
    this.setTile(tx, ty, T.EMPTY);
    this.collectCoin(1, tx * TILE + 8, ty * TILE + 8, 0);
    Audio_.sfx('coin');
  }

  steppedOn(tx, ty) {
    if (this.tileAt(tx, ty) === T.CRUMBLE) {
      this.setTile(tx, ty, T.EMPTY);
      this.spawn(new FallingPlank(tx, ty));
    }
  }

  // ------------------------------------------------------------------ economy
  addScore(n, e) {
    this.game.run.score += n;
    if (e) this.spawn(new ScorePopup(e.cx - 8, e.y - 10, n));
  }
  collectCoin(n, x, y, bonusScore = 0) {
    this.game.run.coins += n;
    this.game.run.score += 100 + bonusScore;
    if (this.game.run.coins >= 100) {
      this.game.run.coins -= 100;
      this.oneUp(x, y);
    }
  }
  oneUp(x, y) {
    this.game.run.lives++;
    Audio_.sfx('oneup');
    this.spawn(new ScorePopup(x - 10, y - 12, '1UP'));
  }

  // ------------------------------------------------------------------ spawns
  spawn(e) { this.area.entities.push(e); }
  countProjectiles() {
    return this.area.entities.filter(e => e.isProjectile && !e.removed).length;
  }
  spawnPuff(x, y) {
    this.spawn(new Particle(x - 2, y - 2, 0, -20, 'puff', 0.25, 0));
  }
  spawnSparkles(x, y, n) {
    for (let i = 0; i < n; i++) {
      this.spawn(new Particle(x - 10 + Math.random() * 20, y - 8 + Math.random() * 16,
        rand(-30, 30), rand(-80, -20), 'sparkle', 0.5, 200));
    }
  }

  shake(time, mag) { this.shakeTime = Math.max(this.shakeTime, time); this.shakeMag = mag; }

  // ------------------------------------------------------------------ wells
  wellUnder(player) {
    for (const w of this.area.wells) {
      if (!w.enterable) continue;
      if (Math.abs(player.bottom - w.y) < 6 &&
          player.cx > w.x + 4 && player.cx < w.x + w.w - 4) return w;
    }
    return null;
  }

  warpThroughWell(well) {
    this.mode = 'warp';
    this.warp = { phase: 'out', t: 0, well };
  }

  _doWarp(well) {
    if (well.linkIndex >= 0) {
      // into sub-area
      this.returnWellIndex = well.linkIndex;
      this.areaIdx = 1 + Math.min(well.linkIndex, this.areas.length - 2);
      const start = this.area.playerStart || { x: 32, y: 32 };
      this.player.x = start.x; this.player.y = start.y;
      this.player.vx = 0; this.player.vy = 0;
    } else {
      // back to main area
      this.areaIdx = 0;
      const markers = this.area.returnMarkers;
      const m = markers[this.returnWellIndex] || markers[0];
      if (m) {
        this.player.x = m.x + 2; this.player.y = m.y;
      } else {
        const w = this.area.wells.find(w0 => w0.enterable);
        this.player.x = (w ? w.x + 10 : 40); this.player.y = (w ? w.y - 30 : 40);
        this.player.exitingWell = 0.7;
      }
      this.player.vx = 0; this.player.vy = 0;
    }
    this.camX = clamp(this.player.cx - VIEW_W * 0.42, 0, this.pixelW - VIEW_W);
    Audio_.playMusic(this.musicFor(this.area));
  }

  // ------------------------------------------------------------------ flow
  onPlayerDying() {
    this.mode = 'dying';
    Audio_.stopMusic();
    Audio_.sfx('death');
    Audio_.playJingle('death');
  }
  onPlayerDead() {
    this.game.onPlayerDeath();
  }
  onStarEnd() {
    Audio_.playMusic(this.musicFor(this.area), { hurry: this.hurry });
  }

  finishLevel(bonus) {
    if (this.mode === 'finished') return;
    this.mode = 'finished';
    this.finish = { t: 0, phase: 'ring', bonus, timeBonus: Math.floor(this.time) * 50, tallied: 0 };
    this.game.run.score += bonus;
    Audio_.stopMusic();
    Audio_.sfx('bell');
  }

  startBossFight(boss) {
    this.boss = boss;
    const padL = boss.arenaPadLeft || VIEW_W * 0.75;
    const padR = boss.arenaPadRight || 140;
    this.bossLock = {
      left: clamp(boss.spawnX - padL, 0, this.pixelW - VIEW_W),
      right: clamp(boss.spawnX + padR, VIEW_W, this.pixelW),
    };
    Audio_.playMusic('boss');
  }

  onBossDefeated(boss) {
    this.bossLock = null;
    this.addScore(boss.scoreValue, boss);
    Audio_.playMusic(this.musicFor(this.area));
    // collapse bridge if the yeti drops
    if (boss instanceof Yeti && !this.bridgeCollapse) {
      this.collapseBridgeUnder(boss);
    }
  }

  onLeverPulled() {
    const yeti = this.area.entities.find(e => e instanceof Yeti && !e.removed);
    this.collapseBridgeUnder(yeti);
    if (yeti) yeti.dropWithBridge(this);
    this.shake(0.6, 4);
  }

  collapseBridgeUnder(boss) {
    if (this.bridgeCollapse) return;
    // find the contiguous run of BRIDGE tiles around the boss / arena
    const ty = boss ? Math.floor((boss.bottom + 4) / TILE)
                    : Math.floor((this.player.bottom + 4) / TILE);
    let found = null;
    for (let yy = Math.max(0, ty - 2); yy < Math.min(this.area.h, ty + 3) && !found; yy++) {
      for (let tx = 0; tx < this.area.w; tx++) {
        if (this.tileAt(tx, yy) === T.BRIDGE) { found = { ty: yy, tx }; break; }
      }
    }
    if (!found) return;
    // expand to full run
    let x0 = found.tx, x1 = found.tx;
    while (this.tileAt(x0 - 1, found.ty) === T.BRIDGE) x0--;
    while (this.tileAt(x1 + 1, found.ty) === T.BRIDGE) x1++;
    this.bridgeCollapse = { ty: found.ty, x: x1, x0, timer: 0 };
    Audio_.sfx('crumble');
  }

  showDialog(lines, onDone) {
    this.mode = 'dialog';
    this.dialog = { lines, onDone, t: 0 };
  }

  // ------------------------------------------------------------------ update
  update(dt) {
    this.levelTime += dt;
    if (this.shakeTime > 0) this.shakeTime -= dt;

    if (this.mode === 'dying') {
      this.player.update(dt, this);
      return;
    }
    if (this.mode === 'warp') {
      this.warp.t += dt;
      if (this.warp.phase === 'out' && this.warp.t > 0.45) {
        this.warp.phase = 'in';
        this.warp.t = 0;
        this._doWarp(this.warp.well);
      } else if (this.warp.phase === 'in' && this.warp.t > 0.45) {
        this.mode = 'play';
        this.warp = null;
      }
      return;
    }
    if (this.mode === 'dialog') {
      this.dialog.t += dt;
      if (this.dialog.t > 0.8 && (Input.pressed.jump || Input.pressed.start)) {
        const cb = this.dialog.onDone;
        this.dialog = null;
        this.mode = 'play';
        if (cb) cb();
      }
      Input.beginFrame === undefined; // no-op
      return;
    }
    if (this.mode === 'finished') {
      this.updateFinish(dt);
      return;
    }

    // --- timer ---
    if (this.mode === 'play') {
      this.time -= dt;
      if (this.time <= 100 && !this.hurry) {
        this.hurry = true;
        Audio_.sfx('hurry');
        Audio_.playMusic(this.musicFor(this.area), { hurry: true });
      }
      if (this.time <= 0) {
        this.time = 0;
        this.player.die(this);
        return;
      }
    }

    // --- player ---
    this.player.update(dt, this);
    if (this.player.onGround) this.combo = 0;
    if (this.bossLock) {
      this.player.x = clamp(this.player.x, this.bossLock.left + 2,
        this.bossLock.right - this.player.w - 2);
    }

    // --- bridge collapse animation ---
    if (this.bridgeCollapse) {
      const bc = this.bridgeCollapse;
      bc.timer -= dt;
      if (bc.timer <= 0 && bc.x >= bc.x0) {
        bc.timer = 0.045;
        if (this.tileAt(bc.x, bc.ty) === T.BRIDGE) {
          this.setTile(bc.x, bc.ty, T.EMPTY);
          this.spawn(new FallingPlank(bc.x, bc.ty));
          const fp = this.area.entities[this.area.entities.length - 1];
          fp.falling = true;
        }
        bc.x--;
        if (bc.x < bc.x0) this.bridgeCollapse = null;
      }
    }

    // --- entities ---
    const ents = this.area.entities;
    for (const e of ents) {
      if (e.removed) continue;
      if (e.isEnemy && !e.isBoss) {
        if (!e.activated) {
          if (e.x < this.camX + VIEW_W + 48 && e.x > this.camX - 80) e.activated = true;
          else continue;
        }
      }
      e.update(dt, this);
    }

    // --- multi-coin timers ---
    for (const k of Object.keys(this.multiCoinTimers)) {
      this.multiCoinTimers[k] -= dt;
    }

    // --- bump animations ---
    for (const b of this.bumps) b.t += dt;
    this.bumps = this.bumps.filter(b => b.t < 0.22);

    // --- interactions ---
    this.handleInteractions(dt);

    // --- camera ---
    let target = this.player.cx - VIEW_W * 0.42;
    let minX = 0, maxX = this.pixelW - VIEW_W;
    if (this.bossLock) { minX = this.bossLock.left; maxX = this.bossLock.right - VIEW_W; }
    this.camX = clamp(lerp(this.camX, clamp(target, minX, maxX), Math.min(1, dt * 9)), minX, maxX);

    // --- cleanup ---
    this.area.entities = ents.filter(e => !e.removed);
  }

  handleInteractions(dt) {
    const p = this.player;
    if (p.dying || this.mode !== 'play') return;
    const ents = this.area.entities;

    for (const e of ents) {
      if (e.removed) continue;

      // ---- items ----
      if (e.isItem && e.emerging <= 0 && e.overlaps(p)) {
        e.removed = true;
        this.addScore(1000, e);
        if (e.kind === 'momo') {
          if (p.size === SIZE_SMALL) p.grow(SIZE_BIG); else Audio_.sfx('coin');
        } else if (e.kind === 'khukuri') {
          if (p.size < SIZE_KHUKURI) p.grow(SIZE_KHUKURI); else Audio_.sfx('coin');
        } else if (e.kind === 'chiya') {
          p.star = 10;
          Audio_.playMusic('chiya');
        } else if (e.kind === 'selroti') {
          this.oneUp(e.cx, e.y);
        }
        continue;
      }

      // ---- springboards ----
      if (e.isSpring && p.vy >= 0 && p.overlaps(e) && p.bottom - e.y < 12) {
        e.launch(p);
        continue;
      }

      // ---- lifts: stand on top ----
      if (e.isLift) {
        const standing = p.vy >= 0 &&
          p.right > e.x + 2 && p.x < e.x + e.w - 2 &&
          p.bottom >= e.y - 2 && p.bottom <= e.y + 9;
        if (standing) {
          p.y = e.y - p.h;
          p.vy = 0;
          p.onGround = true;
          p.x += e.dx || 0;
          if (e.dy > 0) p.y += e.dy;
        }
        continue;
      }

      // ---- flame chains ----
      if (e.isFlameChain) {
        if (p.star <= 0 && e.hitsPlayer(p)) p.takeDamage(this);
        continue;
      }

      // ---- slabs ----
      if (e.isSlab) {
        if (e.overlaps(p)) {
          if (e.crushing) p.takeDamage(this);
          else if (p.vy >= 0 && p.bottom - e.y < 10) { // ride on top
            p.y = e.y - p.h; p.vy = 0; p.onGround = true;
          } else if (p.star <= 0) p.takeDamage(this);
        }
        continue;
      }

      // ---- enemy projectiles ----
      if (e.isEnemyProj && e.overlaps(p)) {
        if (p.star > 0) { e.removed = true; this.spawnPuff(e.cx, e.cy); }
        else { p.takeDamage(this); e.removed = true; }
        continue;
      }

      // ---- khukuri projectiles vs enemies ----
      if (e.isProjectile) {
        for (const t of ents) {
          if (!t.isEnemy || t.dead || t.removed) continue;
          if (e.overlaps(t)) {
            e.removed = true;
            this.spawnPuff(e.cx, e.cy);
            if (t.isBoss) t.hurt(this, 1);
            else { t.deadFall(this, e.vx > 0 ? 1 : -1); this.addScore(t.scoreValue, t); }
            break;
          }
        }
        continue;
      }

      // ---- NPCs (elder / Maya) ----
      if (e.isNPC && e.overlaps(p)) {
        if (!this.boss || this.boss.dead || this.boss.falling) {
          this.touchedNPC(e);
        }
        continue;
      }

      // ---- enemies ----
      if (e.isEnemy && !e.dead && !e.removed && e.activated !== false && e.overlaps(p)) {
        const sliding = e.ball === BALL_SLIDING;
        if (p.star > 0) {
          if (e.isBoss) e.hurt(this, 1);
          else { e.deadFall(this, p.vx >= 0 ? 1 : -1); this.addScore(e.scoreValue, e); }
          continue;
        }
        const falling = p.vy > 40;
        const above = p.bottom - e.y < Math.max(8, e.h * 0.5);
        if (falling && above && e.stompable && !e.spiky) {
          e.stomped(p, this);
          p.bounce(Input.down.jump);
          Audio_.sfx('stomp');
          this.combo = Math.min((this.combo || 0) + 1, STOMP_SCORES.length);
          const sc = STOMP_SCORES[this.combo - 1];
          if (this.combo >= STOMP_SCORES.length) this.oneUp(e.cx, e.y);
          else this.addScore(sc, e);
        } else if (e.ball === BALL_IDLE) {
          e.kick(p.cx < e.cx ? 1 : -1, this);
          e.kickGrace = 0.3;
        } else if (sliding && (e.kickGrace || 0) <= 0) {
          p.takeDamage(this);
        } else if (e.harmful) {
          p.takeDamage(this);
        }
      }

      if (e.kickGrace > 0) e.kickGrace -= dt;

      // ---- sliding langur balls mow down other enemies ----
      if (e.isEnemy && e.ball === BALL_SLIDING) {
        for (const t of ents) {
          if (t === e || !t.isEnemy || t.dead || t.removed || !t.activated) continue;
          if (e.overlaps(t)) {
            if (t.isBoss) { t.hurt(this, 1); e.facing *= -1; e.vx *= -1; }
            else {
              t.deadFall(this, e.vx > 0 ? 1 : -1);
              this.combo = Math.min((this.combo || 0) + 1, STOMP_SCORES.length);
              const sc = STOMP_SCORES[this.combo - 1];
              if (this.combo >= STOMP_SCORES.length) this.oneUp(t.cx, t.y);
              else this.addScore(sc, t);
            }
          }
        }
      }
    }
  }

  touchedNPC(npc) {
    if (this.npcDone) return;
    this.npcDone = true;
    const world = this.game.run.world;
    if (npc.sprite === 'maya') {
      // final rescue → ending
      this.game.onGameComplete();
      return;
    }
    const lines = world === 1
      ? ['THANK YOU PASANG!', 'BUT THE YETI HAS TAKEN MAYA', 'BEYOND THE MONASTERY HILLS!']
      : ['BLESS YOU PASANG!', 'THE YETI CLIMBED TO HIS LAIR', 'IN THE HIGH PASSES. HURRY!'];
    this.showDialog(lines, () => this.finishLevel(2000));
  }

  updateFinish(dt) {
    const f = this.finish;
    f.t += dt;
    const p = this.player;
    switch (f.phase) {
      case 'ring':
        if (f.t > 1.1) { f.phase = 'walk'; f.t = 0; Audio_.playJingle('clear'); }
        break;
      case 'walk':
        p.facing = 1;
        p.vx = 70;
        p.vy = Math.min(p.vy + PHYS.GRAVITY * dt, PHYS.MAX_FALL);
        p.moveAndCollide(this, dt);
        p.runTime += dt;
        if (p.runTime > 0.1) { p.runTime = 0; p.runFrame = (p.runFrame + 1) % 3; }
        if (f.t > 1.3) { f.phase = 'tally'; f.t = 0; p.vx = 0; }
        break;
      case 'tally': {
        const drain = Math.min(f.timeBonus - f.tallied, Math.ceil(900 * dt) * 10);
        if (drain > 0) {
          f.tallied += drain;
          this.game.run.score += drain;
          this.time = Math.max(0, this.time - drain / 50);
          if (Math.floor(f.t * 12) % 2 === 0) Audio_.sfx('tick');
        } else if (f.t > 0.6) {
          f.phase = 'done'; f.t = 0;
        }
        break;
      }
      case 'done':
        if (f.t > 1.2) this.game.onLevelComplete();
        break;
    }
  }

  // ------------------------------------------------------------------ draw
  draw(ctx) {
    const camX = Math.round(this.camX +
      (this.shakeTime > 0 ? rand(-this.shakeMag, this.shakeMag) : 0));
    const camY = this.shakeTime > 0 ? Math.round(rand(-this.shakeMag * 0.5, this.shakeMag * 0.5)) : 0;
    const theme = this.area.theme;

    drawBackground(ctx, theme, camX, this.levelTime);

    // decor behind tiles
    for (const d of this.area.decor) {
      if (d.x < camX - 90 || d.x > camX + VIEW_W + 16) continue;
      let s = d.s;
      if (d.anim) {
        const f = Math.floor(this.levelTime * 4) % 2 + 1;
        s = d.s + f;
      }
      drawSprite(ctx, s, d.x - camX, d.y - camY);
    }

    // tiles
    const tx0 = Math.floor(camX / TILE) - 1;
    const tx1 = tx0 + TILES_X + 2;
    const animFrame = Math.floor(this.levelTime * 4);
    for (let ty = 0; ty < this.area.h; ty++) {
      for (let tx = Math.max(0, tx0); tx <= Math.min(this.area.w - 1, tx1); tx++) {
        const t = this.tileAt(tx, ty);
        if (t === T.EMPTY || t === T.HIDDEN ||
            t === T.WELL_TL || t === T.WELL_TR || t === T.WELL_L || t === T.WELL_R) continue;
        let bumpY = 0;
        for (const b of this.bumps) {
          if (b.tx === tx && b.ty === ty) bumpY = -Math.sin(b.t / 0.22 * Math.PI) * 6;
        }
        const px = tx * TILE - camX, py = ty * TILE + bumpY - camY;
        if (t === T.TERRAIN) {
          const above = this.tileAt(tx, ty - 1);
          drawSprite(ctx, (above === T.EMPTY || TileBehavior.isOneway(above) ? 'top_' : 'fill_') + theme, px, py);
        } else if (t === T.COIN) {
          const f = ['coin1', 'coin2', 'coin3', 'coin4'][animFrame % 4];
          drawSprite(ctx, f, px + 2, py + 3);
        } else {
          const name = tileSprite(t, theme, animFrame);
          if (name) drawSprite(ctx, name, px, py);
        }
      }
    }

    // entities (wells first, then others, then particles on top)
    const ents = this.area.entities;
    for (const e of ents) if (e.isWell) e.draw(ctx, camX, camY);
    for (const e of ents) {
      if (e.isWell || e.removed) continue;
      if (e.isFlameChain) { e.draw(ctx, camX, camY, this.levelTime); continue; }
      if (e.isParticle) continue;
      if (e.x > camX + VIEW_W + 96 || e.x < camX - 120) continue;
      e.draw(ctx, camX, camY);
    }

    // player
    this.player.draw(ctx, camX, camY);

    // particles on top
    for (const e of ents) if (e.isParticle && !e.removed) e.draw(ctx, camX, camY);

    // ambient: falling snow in snow theme
    if (theme === 'snow') {
      const rng = makeRng(77);
      for (let i = 0; i < 40; i++) {
        const speed = 18 + rng() * 30;
        const sx = (rng() * 1000 + Math.sin(this.levelTime + i) * 14 - camX * 0.6) % VIEW_W;
        const sy = (rng() * 240 + this.levelTime * speed) % VIEW_H;
        drawSprite(ctx, 'snowflake', (sx + VIEW_W) % VIEW_W, sy);
      }
    }
    // cave darkness vignette
    if (theme === 'cave' || theme === 'fortress') {
      const grd = ctx.createRadialGradient(
        this.player.cx - camX, this.player.cy - camY, 60,
        this.player.cx - camX, this.player.cy - camY, 260);
      grd.addColorStop(0, 'rgba(0,0,0,0)');
      grd.addColorStop(1, 'rgba(0,0,0,0.45)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    }

    // boss HP
    if (this.boss) this.boss.drawHpBar(ctx);

    // warp fade
    if (this.mode === 'warp') {
      const a = this.warp.phase === 'out' ? Math.min(1, this.warp.t / 0.4)
                                          : Math.max(0, 1 - this.warp.t / 0.4);
      ctx.fillStyle = `rgba(0,0,0,${a})`;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    }

    // dialog box
    if (this.dialog) {
      const lines = this.dialog.lines;
      const bw = 280, bh = 24 + lines.length * 12;
      const bx = (VIEW_W - bw) / 2, by = 48;
      ctx.fillStyle = 'rgba(8,8,16,0.88)';
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = '#e8b83a';
      ctx.strokeRect(bx + 2.5, by + 2.5, bw - 5, bh - 5);
      lines.forEach((ln, i) =>
        drawTextCentered(ctx, ln, VIEW_W / 2, by + 14 + i * 12, '#fff'));
      if (this.dialog.t > 0.8 && Math.floor(this.dialog.t * 2) % 2) {
        drawTextCentered(ctx, '> JUMP <', VIEW_W / 2, by + bh - 9, '#e8b83a');
      }
    }

    // level-clear banner
    if (this.mode === 'finished' && this.finish.phase !== 'ring') {
      drawTextShadow(ctx, 'BELL RUNG!', VIEW_W / 2 - 40, 70, '#ffe080', 1);
      if (this.finish.phase === 'tally' || this.finish.phase === 'done') {
        drawTextShadow(ctx, 'TIME BONUS ' + pad(this.finish.tallied, 5), VIEW_W / 2 - 62, 86, '#fff', 1);
      }
    }
  }
}
