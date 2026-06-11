'use strict';
// ---------------------------------------------------------------------------
// Items — power-ups, block coins, projectiles, particles, score popups.
// ---------------------------------------------------------------------------

// Coin that pops out of a bumped block
class BlockCoin extends Entity {
  constructor(x, y) {
    super(x, y, 10, 10);
    this.vy = -260;
    this.life = 0;
    this.noCollide = true;
  }
  update(dt, level) {
    this.life += dt;
    this.vy += PHYS.GRAVITY * dt;
    this.y += this.vy * dt;
    if (this.life > 0.55) this.removed = true;
  }
  draw(ctx, camX, camY) {
    const f = ['coin1', 'coin2', 'coin3', 'coin4'][Math.floor(this.life * 16) % 4];
    drawSprite(ctx, f, this.x - camX, this.y - camY);
  }
}

// Base for power-up items that emerge from blocks
class PowerItem extends Entity {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.emerging = 0.55;
    this.startY = y;
    this.isItem = true;
  }
  update(dt, level) {
    if (this.emerging > 0) {
      this.emerging -= dt;
      this.y -= (TILE / 0.55) * dt * 0.999;
      return;
    }
    this.move(dt, level);
  }
  move(dt, level) {}
  draw(ctx, camX, camY) {
    if (this.emerging > 0) {
      // clip so the item appears to rise out of the block
      ctx.save();
      ctx.beginPath();
      ctx.rect(this.x - 4 - camX, this.startY - TILE - 6 - camY, this.w + 8, TILE + 6);
      ctx.clip();
      drawSprite(ctx, this.sprite, this.x - camX, this.y - camY);
      ctx.restore();
      return;
    }
    drawSprite(ctx, this.sprite, this.x - camX, this.y - camY);
  }
}

class Momo extends PowerItem {
  constructor(x, y) { super(x, y, 14, 12); this.sprite = 'it_momo'; this.dir = 1; this.kind = 'momo'; }
  move(dt, level) {
    this.vx = this.dir * 55;
    this.applyGravity(dt);
    this.moveAndCollide(level, dt);
    if (this.hitWall) this.dir *= -1;
    if (this.y > level.pixelH + 40) this.removed = true;
  }
}

class SelRoti extends PowerItem {
  constructor(x, y) { super(x, y, 14, 12); this.sprite = 'it_selroti'; this.dir = 1; this.kind = 'selroti'; }
  move(dt, level) {
    this.vx = this.dir * 80;
    this.applyGravity(dt);
    this.moveAndCollide(level, dt);
    if (this.hitWall) this.dir *= -1;
    if (this.y > level.pixelH + 40) this.removed = true;
  }
}

class KhukuriItem extends PowerItem {
  constructor(x, y) { super(x, y, 14, 14); this.sprite = 'it_khukuri'; this.kind = 'khukuri'; }
  move(dt, level) {
    this.applyGravity(dt);
    this.moveAndCollide(level, dt);
  }
}

class Chiya extends PowerItem {
  constructor(x, y) { super(x, y, 14, 13); this.sprite = 'it_chiya'; this.dir = 1; this.kind = 'chiya'; }
  move(dt, level) {
    this.vx = this.dir * 70;
    this.vy = Math.min(this.vy + PHYS.GRAVITY * 0.55 * dt, PHYS.MAX_FALL);
    this.moveAndCollide(level, dt);
    if (this.hitWall) this.dir *= -1;
    if (this.onGround) this.vy = -240; // bouncy tea
    if (this.y > level.pixelH + 40) this.removed = true;
  }
}

// Thrown khukuri projectile
class KhukuriProj extends Entity {
  constructor(x, y, dir) {
    super(x, y, 8, 8);
    this.vx = dir * 230;
    this.dir = dir;
    this.life = 0;
    this.isProjectile = true;
  }
  update(dt, level) {
    this.life += dt;
    this.vy = Math.min(this.vy + PHYS.GRAVITY * 0.9 * dt, 320);
    this.moveAndCollide(level, dt, { oneway: false });
    if (this.onGround) { this.vy = -190; Audio_.sfx('fireball'); }
    if (this.hitWall || this.life > 2.2) {
      this.removed = true;
      level.spawnPuff(this.cx, this.cy);
    }
    if (this.y > level.pixelH + 20) this.removed = true;
  }
  draw(ctx, camX, camY) {
    const f = Math.floor(this.life * 16) % 2 ? 'kproj1' : 'kproj2';
    drawSprite(ctx, f, this.x - camX, this.y - camY, this.dir < 0);
  }
}

// Enemy projectiles (yeti ice chunks, langur king fruit)
class EnemyProj extends Entity {
  constructor(x, y, vx, vy, sprite) {
    super(x, y, sprite === 'icechunk' ? 9 : 7, sprite === 'icechunk' ? 6 : 7);
    this.vx = vx; this.vy = vy;
    this.sprite = sprite;
    this.life = 0;
    this.isEnemyProj = true;
  }
  update(dt, level) {
    this.life += dt;
    this.vy = Math.min(this.vy + PHYS.GRAVITY * 0.6 * dt, 300);
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.life > 4 || this.y > level.pixelH + 20) this.removed = true;
  }
  draw(ctx, camX, camY) {
    drawSprite(ctx, this.sprite, this.x - camX, this.y - camY, this.vx < 0);
  }
}

// Simple sprite particle
class Particle {
  constructor(x, y, vx, vy, sprite, life = 0.8, gravity = PHYS.GRAVITY * 0.7) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.sprite = sprite; this.life = life; this.gravity = gravity;
    this.removed = false;
    this.isParticle = true;
  }
  update(dt) {
    this.life -= dt;
    this.vy += this.gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.life <= 0) this.removed = true;
  }
  draw(ctx, camX, camY) {
    drawSprite(ctx, this.sprite, this.x - camX, this.y - camY);
  }
}

// Floating score text
class ScorePopup {
  constructor(x, y, text) {
    this.x = x; this.y = y; this.text = String(text);
    this.life = 0.8;
    this.removed = false;
    this.isParticle = true;
  }
  update(dt) {
    this.life -= dt;
    this.y -= 40 * dt;
    if (this.life <= 0) this.removed = true;
  }
  draw(ctx, camX, camY) {
    drawText(ctx, this.text, this.x - camX, this.y - camY, '#fff', 1);
  }
}
