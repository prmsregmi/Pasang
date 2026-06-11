'use strict';
// ---------------------------------------------------------------------------
// Hazards & mechanisms — wells, springboards, lifts, falling planks,
// flame chains, stone slabs, checkpoints, the goal bell, and the lever.
// ---------------------------------------------------------------------------

// Stone well: 2 tiles wide, solid (solidity comes from grid tiles placed by
// the decoder). This entity is visual + enter/exit logic.
class Well {
  constructor(tx, ty, depth, enterable, linkIndex) {
    this.tx = tx; this.ty = ty;
    this.x = tx * TILE; this.y = ty * TILE;
    this.w = 32; this.h = (depth + 1) * TILE;
    this.depth = depth;
    this.enterable = enterable;
    this.linkIndex = linkIndex; // which subarea / return marker
    this.removed = false;
    this.isWell = true;
  }
  update() {}
  draw(ctx, camX, camY) {
    drawSprite(ctx, 'well_top', this.x - camX, this.y - camY);
    for (let i = 1; i <= this.depth; i++) {
      drawSprite(ctx, 'well_shaft', this.x - camX, this.y + i * TILE - camY);
    }
  }
}

// Springboard (yak-hide drum)
class Spring extends Entity {
  constructor(x, y) {
    super(x, y + 2, 14, 14);
    this.compress = 0; // 0 idle, 1..2 frames
    this.timer = 0;
    this.isSpring = true;
    this.gravity = 0;
  }
  update(dt, level) {
    if (this.timer > 0) {
      this.timer -= dt;
      if (this.timer <= 0) this.compress = 0;
    }
  }
  // called by level when player lands on it
  launch(player) {
    this.compress = 2;
    this.timer = 0.18;
    player.vy = Input.down.jump ? -560 : -420;
    player.jumpHeld = Input.down.jump;
    Audio_.sfx('spring');
  }
  draw(ctx, camX, camY) {
    const name = this.compress === 2 ? 'spring3' : this.compress === 1 ? 'spring2' : 'spring1';
    drawSprite(ctx, name, this.x - 1 - camX, this.y - 2 - camY);
  }
}

// Moving platform (rope lift). axis 'h' or 'v', range in px, speed px/s.
class Lift extends Entity {
  constructor(x, y, axis, range, speed) {
    super(x, y, 48, 7);
    this.axis = axis;
    this.range = range;
    this.speed = speed;
    this.origin = { x, y };
    this.t = 0;
    this.isLift = true;
    this.gravity = 0;
    this.prevX = x; this.prevY = y;
  }
  update(dt, level) {
    this.t += dt;
    this.prevX = this.x; this.prevY = this.y;
    const offset = Math.sin(this.t * this.speed / this.range * 2) * this.range;
    if (this.axis === 'h') this.x = this.origin.x + offset;
    else this.y = this.origin.y + offset;
    this.dx = this.x - this.prevX;
    this.dy = this.y - this.prevY;
  }
  draw(ctx, camX, camY) {
    drawSprite(ctx, 'lift', this.x - camX, this.y - camY);
    // rope up to the sky for vertical, side ropes for horizontal
    const g = ctx;
    g.fillStyle = '#d8c090';
    if (this.axis === 'v') {
      g.fillRect(Math.round(this.x + 6 - camX), 0, 1, Math.round(this.y - camY));
      g.fillRect(Math.round(this.x + 41 - camX), 0, 1, Math.round(this.y - camY));
    } else {
      g.fillRect(Math.round(this.x + 23 - camX), 0, 1, Math.round(this.y - camY));
    }
  }
}

// Falling plank — spawned when the player steps on a crumble tile
class FallingPlank extends Entity {
  constructor(tx, ty) {
    super(tx * TILE, ty * TILE, 16, 8);
    this.timer = 0.35;
    this.falling = false;
    this.gravity = 0;
    this.isParticle = true; // no interactions, just falls
  }
  update(dt, level) {
    if (!this.falling) {
      this.timer -= dt;
      this.x += Math.sin(this.timer * 60) * 0.4; // shake
      if (this.timer <= 0) { this.falling = true; Audio_.sfx('crumble'); }
      return;
    }
    this.vy = Math.min(this.vy + PHYS.GRAVITY * dt, PHYS.MAX_FALL);
    this.y += this.vy * dt;
    if (this.y > level.pixelH + 30) this.removed = true;
  }
  draw(ctx, camX, camY) {
    drawSprite(ctx, 'crumble', this.x - camX, this.y - camY);
  }
}

// Rotating flame chain (butter-lamp flames) anchored to a block
class FlameChain {
  constructor(tx, ty, count = 5, speed = 2.1, dir = 1) {
    this.cx = tx * TILE + 8;
    this.cy = ty * TILE + 8;
    this.count = count;
    this.speed = speed * dir;
    this.angle = 0;
    this.removed = false;
    this.isFlameChain = true;
  }
  update(dt) { this.angle += this.speed * dt; }
  flamePositions() {
    const out = [];
    for (let i = 1; i <= this.count; i++) {
      out.push({
        x: this.cx + Math.cos(this.angle) * i * 9,
        y: this.cy + Math.sin(this.angle) * i * 9,
      });
    }
    return out;
  }
  hitsPlayer(p) {
    for (const f of this.flamePositions()) {
      if (rectsOverlap(f.x - 3, f.y - 3, 6, 6, p.x, p.y, p.w, p.h)) return true;
    }
    return false;
  }
  draw(ctx, camX, camY, animTime) {
    const name = Math.floor(animTime * 10) % 2 ? 'flame2' : 'flame1';
    for (const f of this.flamePositions()) {
      drawSprite(ctx, name, f.x - 3 - camX, f.y - 3 - camY);
    }
  }
}

// Stone slab crusher
class Slab extends Entity {
  constructor(x, y) {
    super(x, y, 24, 24);
    this.originY = y;
    this.state = 'wait';
    this.timer = 0;
    this.gravity = 0;
    this.isSlab = true;
  }
  update(dt, level) {
    const p = level.player;
    switch (this.state) {
      case 'wait':
        if (p && !p.dying && Math.abs(p.cx - this.cx) < 36 && p.y > this.y) {
          this.state = 'slam';
        }
        break;
      case 'slam':
        this.vy = Math.min(this.vy + 2400 * dt, 460);
        this.y += this.vy * dt;
        {
          const ty = Math.floor((this.y + this.h) / TILE);
          const tx0 = Math.floor((this.x + 2) / TILE);
          const tx1 = Math.floor((this.x + this.w - 2) / TILE);
          for (let tx = tx0; tx <= tx1; tx++) {
            if (TileBehavior.isSolid(level.tileAt(tx, ty))) {
              this.y = ty * TILE - this.h;
              this.vy = 0;
              this.state = 'rest';
              this.timer = 0.7;
              level.shake(0.25, 3);
              Audio_.sfx('stomp');
              break;
            }
          }
        }
        break;
      case 'rest':
        this.timer -= dt;
        if (this.timer <= 0) this.state = 'rise';
        break;
      case 'rise':
        this.y -= 38 * dt;
        if (this.y <= this.originY) { this.y = this.originY; this.state = 'wait'; }
        break;
    }
  }
  get crushing() { return this.state === 'slam'; }
  draw(ctx, camX, camY) {
    drawSprite(ctx, 'slab', this.x - camX, this.y - camY);
  }
}

// Prayer wheel checkpoint
class Checkpoint extends Entity {
  constructor(x, y) {
    super(x, y, 14, 26);
    this.activated = false;
    this.spin = 0;
    this.gravity = 0;
    this.isCheckpoint = true;
  }
  update(dt, level) {
    if (this.activated) this.spin += dt;
    const p = level.player;
    if (!this.activated && p && !p.dying && this.overlaps(p)) {
      this.activated = true;
      level.checkpoint = { x: this.x, y: this.y - 4 };
      Audio_.sfx('checkpoint');
      level.spawnSparkles(this.cx, this.y, 6);
    }
  }
  draw(ctx, camX, camY) {
    const name = this.activated && Math.floor(this.spin * 10) % 2 ? 'wheel2' : 'wheel1';
    drawSprite(ctx, name, this.x - 1 - camX, this.y - camY);
  }
}

// Goal bell — vertical post with a bell on top; touch to finish the level.
class GoalBell {
  constructor(tx, groundTy) {
    this.x = tx * TILE + 6;
    this.topY = (groundTy - 9) * TILE;       // post is 9 tiles tall
    this.groundY = groundTy * TILE;
    this.w = 4;
    this.h = this.groundY - this.topY;
    this.y = this.topY;
    this.rung = false;
    this.ringTime = 0;
    this.removed = false;
    this.isGoal = true;
  }
  update(dt, level) {
    if (this.rung) { this.ringTime += dt; return; }
    const p = level.player;
    if (p && !p.dying && rectsOverlap(this.x - 2, this.topY, 8, this.h, p.x, p.y, p.w, p.h)) {
      this.rung = true;
      // bonus by contact height: top = 5000, bottom = 200
      const frac = clamp(1 - (p.bottom - this.topY) / this.h, 0, 1);
      const bonus = [200, 400, 800, 1000, 2000, 5000][Math.min(5, Math.floor(frac * 6))];
      level.finishLevel(bonus);
    }
  }
  draw(ctx, camX, camY) {
    for (let y = this.topY; y < this.groundY; y += TILE) {
      drawSprite(ctx, 'bellpost', this.x - 6 - camX, y - camY);
    }
    drawSprite(ctx, 'bellbeam', this.x - 6 - camX, this.topY - 12 - camY);
    const sway = this.rung ? Math.sin(this.ringTime * 18) * Math.max(0, 4 - this.ringTime * 2) : 0;
    drawSprite(ctx, 'bell', this.x - 6 + sway - camX, this.topY - 10 - camY);
    if (this.rung && this.ringTime < 1) {
      drawSprite(ctx, 'sparkle', this.x - 14 - camX, this.topY - 14 - camY);
      drawSprite(ctx, 'sparkle', this.x + 8 - camX, this.topY - 18 - camY);
    }
  }
}

// Bridge release lever (final yeti fight)
class Lever extends Entity {
  constructor(x, y) {
    super(x, y, 12, 11);
    this.pulled = false;
    this.gravity = 0;
    this.isLever = true;
  }
  update(dt, level) {
    if (this.pulled) return;
    const p = level.player;
    if (p && !p.dying && this.overlaps(p)) {
      this.pulled = true;
      Audio_.sfx('lever');
      level.onLeverPulled();
    }
  }
  draw(ctx, camX, camY) {
    if (this.pulled) {
      ctx.save();
      ctx.translate(Math.round(this.x + 6 - camX), Math.round(this.y + 11 - camY));
      ctx.scale(-1, 1);
      drawSprite(ctx, 'lever', -6, -11);
      ctx.restore();
    } else {
      drawSprite(ctx, 'lever', this.x - camX, this.y - camY);
    }
  }
}

// Village elder NPC (end of fortress levels)
class Elder extends Entity {
  constructor(x, y, isMaya) {
    super(x, y, 14, isMaya ? 20 : 22);
    this.gravity = 0;
    this.isNPC = true;
    this.sprite = isMaya ? 'maya' : 'elder';
  }
  update() {}
  draw(ctx, camX, camY) {
    drawSprite(ctx, this.sprite, this.x - 1 - camX, this.y + this.h - Sprites[this.sprite].h - camY);
  }
}
