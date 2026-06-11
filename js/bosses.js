'use strict';
// ---------------------------------------------------------------------------
// Bosses — Bandit Boar (W1), Langur King (W2), Yeti (W3 finale).
// ---------------------------------------------------------------------------

class Boss extends Enemy {
  constructor(x, y, w, h, hp) {
    super(x, y, w, h);
    this.isBoss = true;
    this.hp = hp;
    this.maxHp = hp;
    this.hitInvuln = 0;
    this.active = false;
    this.scoreValue = 5000;
  }
  hurt(level, amount = 1, fromStomp = false) {
    if (this.hitInvuln > 0 || this.dead) return false;
    this.hp -= amount;
    this.hitInvuln = fromStomp ? 1.1 : 0.45;
    Audio_.sfx('bosshit');
    level.spawnSparkles(this.cx, this.y, 4);
    if (this.hp <= 0) {
      this.defeat(level);
    }
    return true;
  }
  defeat(level) {
    this.dead = true;
    this.harmful = false;
    this.vy = -260;
    this.vx = 0;
    Audio_.sfx('bossdie');
    level.onBossDefeated(this);
  }
  stomped(player, level) {
    this.hurt(level, 1, true);
  }
  drawHpBar(ctx) {
    if (!this.active || this.dead) return;
    const w = 60, x = VIEW_W - w - 10, y = 24;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(x - 2, y - 2, w + 4, 8);
    ctx.fillStyle = '#c83030';
    ctx.fillRect(x, y, Math.max(0, w * this.hp / this.maxHp), 4);
  }
}

// ----- Bandit Boar — charges wall to wall; jump over and stomp -----
class BanditBoar extends Boss {
  constructor(x, y) {
    super(x, y, 28, 18, 3);
    this.facing = -1;
    this.state = 'idle';
    this.timer = 0;
  }
  update(dt, level) {
    this.hitInvuln = Math.max(0, this.hitInvuln - dt);
    if (this.dead) return this.updateDead(dt, level);
    this.animTime += dt;
    const p = level.player;
    if (!this.active) {
      this.applyGravity(dt);
      this.moveAndCollide(level, dt);
      if (p && Math.abs(p.cx - this.cx) < VIEW_W * 0.55) {
        this.active = true;
        level.startBossFight(this);
        this.state = 'charge';
        this.facing = p.cx < this.cx ? -1 : 1;
        Audio_.sfx('roar');
      }
      return;
    }
    const speed = 70 + (this.maxHp - this.hp) * 38;
    switch (this.state) {
      case 'charge':
        this.vx = this.facing * speed;
        this.applyGravity(dt);
        this.moveAndCollide(level, dt);
        if (this.hitWall) {
          this.state = 'stun';
          this.timer = 0.55;
          this.vx = 0;
          level.shake(0.2, 2);
          Audio_.sfx('bump');
        }
        break;
      case 'stun':
        this.timer -= dt;
        this.applyGravity(dt);
        this.moveAndCollide(level, dt);
        if (this.timer <= 0) {
          this.facing = p && p.cx < this.cx ? -1 : 1;
          this.state = 'charge';
        }
        break;
    }
  }
  draw(ctx, camX, camY) {
    if (this.hitInvuln > 0 && Math.floor(this.animTime * 16) % 2) return;
    const name = Math.floor(this.animTime * 8) % 2 ? 'boar2' : 'boar1';
    if (this.dead) return this.drawFlipped(ctx, name, camX, camY);
    this.drawSpriteAnchored(ctx, name, camX, camY);
  }
}

// ----- Langur King — leaps in arcs and lobs fruit -----
class LangurKing extends Boss {
  constructor(x, y) {
    super(x, y, 22, 26, 3);
    this.facing = -1;
    this.timer = 1;
    this.hopCount = 0;
  }
  update(dt, level) {
    this.hitInvuln = Math.max(0, this.hitInvuln - dt);
    if (this.dead) return this.updateDead(dt, level);
    this.animTime += dt;
    const p = level.player;
    if (!this.active) {
      this.applyGravity(dt);
      this.moveAndCollide(level, dt);
      if (p && Math.abs(p.cx - this.cx) < VIEW_W * 0.55) {
        this.active = true;
        level.startBossFight(this);
        Audio_.sfx('roar');
      }
      return;
    }
    this.applyGravity(dt);
    this.moveAndCollide(level, dt);
    if (this.onGround) {
      this.vx = 0;
      this.timer -= dt;
      if (this.timer <= 0) {
        this.hopCount++;
        this.facing = p && p.cx < this.cx ? -1 : 1;
        if (this.hopCount % 3 === 0 && p) {
          // throw two fruits in arcs
          const dx = p.cx - this.cx;
          for (const lead of [0.7, 1.1]) {
            level.spawn(new EnemyProj(this.cx, this.y + 4,
              clamp(dx * lead, -160, 160), -230, 'fruit'));
          }
          Audio_.sfx('throw');
          this.timer = 0.8;
        } else {
          this.vy = -290;
          this.vx = this.facing * (90 + Math.random() * 50);
          this.timer = 0.55 + Math.random() * 0.4;
        }
      }
    }
  }
  draw(ctx, camX, camY) {
    if (this.hitInvuln > 0 && Math.floor(this.animTime * 16) % 2) return;
    const name = this.onGround ? 'lking1' : 'lking2';
    if (this.dead) return this.drawFlipped(ctx, name, camX, camY);
    this.drawSpriteAnchored(ctx, name, camX, camY);
  }
}

// ----- YETI — final battle on a suspension bridge with a release lever -----
class Yeti extends Boss {
  constructor(x, y) {
    super(x, y, 30, 36, 10);     // 10 khukuri hits, or drop the bridge
    this.facing = -1;
    this.homeX = x;
    this.state = 'walk';
    this.timer = 1.2;
    this.throwTimer = 2.2;
    this.stompable = false;       // too big to stomp!
    this.spiky = false;
    this.falling = false;
    this.arenaPadLeft = 220;      // wide arena: the lever sits behind him
    this.arenaPadRight = 460;
  }
  update(dt, level) {
    this.hitInvuln = Math.max(0, this.hitInvuln - dt);
    if (this.falling) { // bridge dropped
      this.vy = Math.min(this.vy + PHYS.GRAVITY * dt, 420);
      this.y += this.vy * dt;
      if (this.y > level.pixelH + 80) this.removed = true;
      return;
    }
    if (this.dead) return this.updateDead(dt, level);
    this.animTime += dt;
    const p = level.player;
    if (!this.active) {
      this.applyGravity(dt);
      this.moveAndCollide(level, dt);
      if (p && Math.abs(p.cx - this.cx) < VIEW_W * 0.6) {
        this.active = true;
        level.startBossFight(this);
        Audio_.sfx('roar');
        level.shake(0.5, 3);
      }
      return;
    }
    if (p && !p.dying) this.facing = p.cx < this.cx ? -1 : 1;

    // periodic ice chunk throws
    this.throwTimer -= dt;
    if (this.throwTimer <= 0 && p && this.state !== 'jump') {
      this.throwTimer = 1.6 + Math.random() * 1.2;
      this.state = 'throw';
      this.timer = 0.4;
      const dx = p.cx - this.cx;
      level.spawn(new EnemyProj(this.cx + this.facing * 12, this.y + 8,
        clamp(dx * 0.9, -150, 150), -200 - Math.random() * 60, 'icechunk'));
      Audio_.sfx('throw');
    }

    switch (this.state) {
      case 'walk':
        this.timer -= dt;
        this.vx = this.facing * 26;
        // stay near home position
        if (Math.abs(this.x + this.vx * dt - this.homeX) > 30) this.vx = 0;
        this.applyGravity(dt);
        this.moveAndCollide(level, dt);
        if (this.timer <= 0) {
          // big jump — the player's chance to run underneath
          this.state = 'jump';
          this.vy = -340;
          this.timer = 2;
          Audio_.sfx('roar');
        }
        break;
      case 'jump':
        this.vx = 0;
        this.applyGravity(dt);
        this.moveAndCollide(level, dt);
        if (this.onGround && this.vy === 0 && this.timer < 1.8) {
          this.state = 'walk';
          this.timer = 1.4 + Math.random() * 1.2;
          level.shake(0.3, 4);
          Audio_.sfx('stomp');
        }
        this.timer -= dt;
        break;
      case 'throw':
        this.vx = 0;
        this.timer -= dt;
        this.applyGravity(dt);
        this.moveAndCollide(level, dt);
        if (this.timer <= 0) { this.state = 'walk'; this.timer = 1 + Math.random(); }
        break;
    }
  }
  // bridge released under him
  dropWithBridge(level) {
    if (this.falling || this.dead) return;
    this.falling = true;
    this.harmful = false;
    this.vy = -120;
    Audio_.sfx('roar');
    level.onBossDefeated(this);
  }
  draw(ctx, camX, camY) {
    if (this.hitInvuln > 0 && Math.floor(this.animTime * 16) % 2) return;
    let name;
    if (this.falling || this.dead) name = 'yeti_up';
    else if (this.state === 'throw') name = 'yeti_throw';
    else if (this.state === 'jump' && !this.onGround) name = 'yeti_up';
    else name = Math.floor(this.animTime * 5) % 2 ? 'yeti2' : 'yeti1';
    this.drawSpriteAnchored(ctx, name, camX, camY);
  }
}
