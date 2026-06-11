'use strict';
// ---------------------------------------------------------------------------
// Enemies — yak, pika, langur (+ ball), gorak, snapper, leopard, ice spirit.
// All enemies share a small interaction contract used by level.js:
//   stompable, spiky, deadFall(), stomped(player, level), kicked?, harmful
// ---------------------------------------------------------------------------

class Enemy extends Entity {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.isEnemy = true;
    this.stompable = true;
    this.spiky = false;
    this.harmful = true;
    this.dead = false;       // in death animation
    this.animTime = Math.random();
    this.activated = false;  // becomes active when near camera
    this.scoreValue = 100;
  }

  // killed by projectile / chiya rush / sliding ball — flips and falls
  deadFall(level, dir = 1) {
    if (this.dead) return;
    this.dead = true;
    this.harmful = false;
    this.vy = -220;
    this.vx = 60 * dir;
    Audio_.sfx('kick');
  }

  updateDead(dt, level) {
    this.vy += PHYS.GRAVITY * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.y > level.pixelH + 60) this.removed = true;
  }

  drawFlipped(ctx, name, camX, camY) {
    const s = Sprites[name];
    if (!s) return;
    ctx.save();
    ctx.translate(Math.round(this.x - (s.w - this.w) / 2 - camX) + s.w / 2,
                  Math.round(this.y + this.h - s.h - camY) + s.h / 2);
    ctx.scale(1, -1);
    ctx.drawImage(s.c, -s.w / 2, -s.h / 2);
    ctx.restore();
  }

  drawSpriteAnchored(ctx, name, camX, camY) {
    const s = Sprites[name];
    if (!s) return;
    drawSprite(ctx, name,
      this.x - (s.w - this.w) / 2 - camX,
      this.y + this.h - s.h - camY,
      this.facing > 0); // enemy art faces left by default
  }
}

// ----- Yak — steady walker, turns at walls -----
class Yak extends Enemy {
  constructor(x, y) {
    super(x, y, 18, 12);
    this.facing = -1;
    this.squashed = 0;
    this.scoreValue = 100;
  }
  update(dt, level) {
    if (this.dead) return this.updateDead(dt, level);
    if (this.squashed > 0) {
      this.squashed -= dt;
      if (this.squashed <= 0) this.removed = true;
      return;
    }
    this.animTime += dt;
    this.vx = this.facing * 28;
    this.applyGravity(dt);
    this.moveAndCollide(level, dt);
    if (this.hitWall) this.facing *= -1;
    if (this.y > level.pixelH + 40) this.removed = true;
  }
  stomped(player, level) {
    this.squashed = 0.5;
    this.harmful = false;
    this.stompable = false;
  }
  draw(ctx, camX, camY) {
    if (this.squashed > 0) return this.drawSpriteAnchored(ctx, 'yak_squash', camX, camY);
    const name = Math.floor(this.animTime * 6) % 2 ? 'yak2' : 'yak1';
    if (this.dead) return this.drawFlipped(ctx, name, camX, camY);
    this.drawSpriteAnchored(ctx, name, camX, camY);
  }
}

// ----- Pika — small, fast, turns at edges -----
class Pika extends Enemy {
  constructor(x, y) {
    super(x, y, 11, 9);
    this.facing = -1;
    this.squashed = 0;
    this.scoreValue = 100;
  }
  update(dt, level) {
    if (this.dead) return this.updateDead(dt, level);
    if (this.squashed > 0) {
      this.squashed -= dt;
      if (this.squashed <= 0) this.removed = true;
      return;
    }
    this.animTime += dt;
    this.vx = this.facing * 70;
    this.applyGravity(dt);
    this.moveAndCollide(level, dt);
    if (this.hitWall) this.facing *= -1;
    if (this.onGround && !this.groundAhead(level)) this.facing *= -1;
    if (this.y > level.pixelH + 40) this.removed = true;
  }
  stomped(player, level) {
    this.squashed = 0.4;
    this.harmful = false;
    this.stompable = false;
  }
  draw(ctx, camX, camY) {
    if (this.squashed > 0) {
      const s = Sprites['pika1'];
      ctx.save();
      ctx.translate(0, this.h - 4);
      this.drawSpriteAnchored(ctx, 'pika1', camX, camY + (s.h - 4));
      ctx.restore();
      return;
    }
    const name = Math.floor(this.animTime * 10) % 2 ? 'pika2' : 'pika1';
    if (this.dead) return this.drawFlipped(ctx, name, camX, camY);
    this.drawSpriteAnchored(ctx, name, camX, camY);
  }
}

// ----- Langur — stomp turns it into a slidable ball -----
const BALL_IDLE = 1, BALL_SLIDING = 2;
class Langur extends Enemy {
  constructor(x, y) {
    super(x, y, 13, 15);
    this.facing = -1;
    this.ball = 0;            // 0 walking, BALL_IDLE, BALL_SLIDING
    this.wakeTimer = 0;
    this.scoreValue = 100;
  }
  update(dt, level) {
    if (this.dead) return this.updateDead(dt, level);
    this.animTime += dt;
    if (this.ball === BALL_IDLE) {
      this.wakeTimer -= dt;
      this.vx = 0;
      this.applyGravity(dt);
      this.moveAndCollide(level, dt);
      if (this.wakeTimer <= 0) { // wake back up
        this.ball = 0;
        this.h = 15; this.y -= 5;
        this.harmful = true;
      }
      return;
    }
    if (this.ball === BALL_SLIDING) {
      this.applyGravity(dt);
      this.moveAndCollide(level, dt);
      if (this.hitWall) { this.facing *= -1; this.vx = this.facing * 240; Audio_.sfx('bump'); }
      else this.vx = this.facing * 240;
      if (this.y > level.pixelH + 40) this.removed = true;
      return;
    }
    this.vx = this.facing * 38;
    this.applyGravity(dt);
    this.moveAndCollide(level, dt);
    if (this.hitWall) this.facing *= -1;
    if (this.onGround && !this.groundAhead(level)) this.facing *= -1;
    if (this.y > level.pixelH + 40) this.removed = true;
  }
  stomped(player, level) {
    if (this.ball === BALL_SLIDING) {        // stop a sliding ball
      this.ball = BALL_IDLE;
      this.wakeTimer = 5;
      this.vx = 0;
      this.harmful = false;
    } else if (this.ball === BALL_IDLE) {    // kick from above = small nudge
      this.kick(player.cx < this.cx ? 1 : -1, level);
    } else {                                  // curl into ball
      this.ball = BALL_IDLE;
      this.wakeTimer = 5;
      this.h = 10; this.y += 5;
      this.vx = 0;
      this.harmful = false;
    }
  }
  kick(dir, level) {
    this.ball = BALL_SLIDING;
    this.facing = dir;
    this.vx = dir * 240;
    this.harmful = false; // ball hurts only via level's sliding-ball check
    Audio_.sfx('kick');
  }
  draw(ctx, camX, camY) {
    let name;
    if (this.ball) name = Math.floor(this.animTime * 12) % 2 ? 'langur_ball2' : 'langur_ball1';
    else name = Math.floor(this.animTime * 7) % 2 ? 'langur2' : 'langur1';
    if (this.dead) return this.drawFlipped(ctx, name, camX, camY);
    if (this.ball === BALL_IDLE && this.wakeTimer < 1.5 && Math.floor(this.animTime * 10) % 2) {
      // shudder before waking
      this.drawSpriteAnchored(ctx, name, camX + 1, camY);
    } else {
      this.drawSpriteAnchored(ctx, name, camX, camY);
    }
  }
}

// ----- Gorak — Himalayan crow; flies in a sine, stomp grounds it -----
class Gorak extends Enemy {
  constructor(x, y) {
    super(x, y, 14, 10);
    this.facing = -1;
    this.baseY = y;
    this.t = Math.random() * 6;
    this.grounded = false;
    this.squashed = 0;
    this.gravity = 0;
    this.scoreValue = 200;
  }
  update(dt, level) {
    if (this.dead) return this.updateDead(dt, level);
    if (this.squashed > 0) {
      this.squashed -= dt;
      if (this.squashed <= 0) this.removed = true;
      return;
    }
    this.animTime += dt;
    if (this.grounded) {
      this.vx = this.facing * 45;
      this.vy = Math.min(this.vy + PHYS.GRAVITY * dt, PHYS.MAX_FALL);
      this.moveAndCollide(level, dt);
      if (this.hitWall) this.facing *= -1;
      if (this.onGround && !this.groundAhead(level)) this.facing *= -1;
    } else {
      this.t += dt;
      this.vx = this.facing * 55;
      this.x += this.vx * dt;
      this.y = this.baseY + Math.sin(this.t * 2.2) * 24;
      // turn around at patrol bounds
      if (Math.abs(this.x - this.spawnX) > 90) this.facing *= -1;
    }
    if (this.y > level.pixelH + 40) this.removed = true;
  }
  stomped(player, level) {
    if (!this.grounded) {
      this.grounded = true;
      this.vy = 0;
    } else {
      this.squashed = 0.4;
      this.harmful = false;
      this.stompable = false;
    }
  }
  draw(ctx, camX, camY) {
    let name;
    if (this.grounded) name = 'gorak_walk';
    else name = Math.floor(this.animTime * 8) % 2 ? 'gorak2' : 'gorak1';
    if (this.dead) return this.drawFlipped(ctx, name, camX, camY);
    if (this.squashed > 0) name = 'gorak_walk';
    this.drawSpriteAnchored(ctx, name, camX, camY);
  }
}

// ----- Snapper — thorny plant living in a well; rises and snaps -----
class Snapper extends Enemy {
  constructor(wellX, wellTopY) {
    super(wellX + 8, wellTopY, 14, 20);
    this.wellTopY = wellTopY;
    this.state = 'hidden';
    this.timer = 1.2 + Math.random();
    this.stompable = false;
    this.spiky = true;
    this.scoreValue = 200;
    this.gravity = 0;
  }
  update(dt, level) {
    if (this.dead) return this.updateDead(dt, level);
    this.animTime += dt;
    this.timer -= dt;
    const p = level.player;
    switch (this.state) {
      case 'hidden':
        this.y = this.wellTopY + 4;
        if (this.timer <= 0) {
          // don't pop out if the player is standing close
          if (p && Math.abs(p.cx - this.cx) < 36 && Math.abs(p.bottom - this.wellTopY) < 48) {
            this.timer = 0.5;
          } else {
            this.state = 'rising';
            this.timer = 0.6;
          }
        }
        break;
      case 'rising':
        this.y -= (24 / 0.6) * dt;
        if (this.timer <= 0) { this.state = 'out'; this.timer = 1.3; this.y = this.wellTopY - 20; }
        break;
      case 'out':
        if (this.timer <= 0) { this.state = 'sinking'; this.timer = 0.6; }
        break;
      case 'sinking':
        this.y += (24 / 0.6) * dt;
        if (this.timer <= 0) { this.state = 'hidden'; this.timer = 1.4; }
        break;
    }
    this.harmful = this.state !== 'hidden';
  }
  draw(ctx, camX, camY) {
    if (this.state === 'hidden') return;
    const name = Math.floor(this.animTime * 5) % 2 ? 'snapper2' : 'snapper1';
    if (this.dead) return this.drawFlipped(ctx, name, camX, camY);
    // clip to the well mouth so it appears to rise from inside
    ctx.save();
    ctx.beginPath();
    ctx.rect(this.x - 6 - camX, this.wellTopY - 26 - camY, this.w + 12, 30);
    ctx.clip();
    this.drawSpriteAnchored(ctx, name, camX, camY);
    ctx.restore();
  }
}

// ----- Snow leopard — paces, then pounces at the player -----
class Leopard extends Enemy {
  constructor(x, y) {
    super(x, y, 20, 12);
    this.facing = -1;
    this.state = 'pace';
    this.timer = 0;
    this.squashed = 0;
    this.scoreValue = 400;
  }
  update(dt, level) {
    if (this.dead) return this.updateDead(dt, level);
    if (this.squashed > 0) {
      this.squashed -= dt;
      if (this.squashed <= 0) this.removed = true;
      return;
    }
    this.animTime += dt;
    const p = level.player;
    switch (this.state) {
      case 'pace':
        this.vx = this.facing * 40;
        this.applyGravity(dt);
        this.moveAndCollide(level, dt);
        if (this.hitWall) this.facing *= -1;
        if (this.onGround && !this.groundAhead(level)) this.facing *= -1;
        if (p && !p.dying && Math.abs(p.cx - this.cx) < 110 && Math.abs(p.cy - this.cy) < 40 && this.onGround) {
          this.facing = p.cx < this.cx ? -1 : 1;
          this.state = 'crouch';
          this.timer = 0.38;
          this.vx = 0;
        }
        break;
      case 'crouch':
        this.timer -= dt;
        this.vx = 0;
        this.applyGravity(dt);
        this.moveAndCollide(level, dt);
        if (this.timer <= 0) {
          this.state = 'pounce';
          this.vx = this.facing * 215;
          this.vy = -210;
          Audio_.sfx('kick');
        }
        break;
      case 'pounce':
        this.applyGravity(dt);
        this.moveAndCollide(level, dt);
        if (this.onGround) { this.state = 'cooldown'; this.timer = 0.5; this.vx = 0; }
        break;
      case 'cooldown':
        this.timer -= dt;
        this.applyGravity(dt);
        this.moveAndCollide(level, dt);
        if (this.timer <= 0) this.state = 'pace';
        break;
    }
    if (this.y > level.pixelH + 40) this.removed = true;
  }
  stomped(player, level) {
    this.squashed = 0.4;
    this.harmful = false;
    this.stompable = false;
  }
  draw(ctx, camX, camY) {
    let name;
    if (this.state === 'pounce') name = 'leopard_pounce';
    else if (this.state === 'crouch') name = 'leopard2';
    else name = Math.floor(this.animTime * 8) % 2 ? 'leopard2' : 'leopard1';
    if (this.dead) return this.drawFlipped(ctx, name, camX, camY);
    if (this.squashed > 0) name = 'leopard2';
    this.drawSpriteAnchored(ctx, name, camX, camY);
  }
}

// ----- Ice spirit — drifting frost wisp; cannot be stomped -----
class IceSpirit extends Enemy {
  constructor(x, y) {
    super(x, y, 12, 12);
    this.dirX = Math.random() < 0.5 ? -1 : 1;
    this.dirY = 1;
    this.baseY = y;
    this.stompable = false;
    this.spiky = true;
    this.gravity = 0;
    this.scoreValue = 200;
  }
  update(dt, level) {
    if (this.dead) return this.updateDead(dt, level);
    this.animTime += dt;
    const speed = 46;
    this.x += this.dirX * speed * dt;
    this.y += this.dirY * speed * 0.7 * dt;
    // bounce inside a box around spawn, and off solids
    if (this.y < this.baseY - 40 || this.touchingTile(level, TileBehavior.isSolid) && this.dirY < 0) this.dirY = 1;
    if (this.y > this.baseY + 40) this.dirY = -1;
    const tx = Math.floor((this.dirX > 0 ? this.right + 1 : this.x - 1) / TILE);
    const ty = Math.floor(this.cy / TILE);
    if (TileBehavior.isSolid(level.tileAt(tx, ty))) this.dirX *= -1;
    if (Math.abs(this.x - this.spawnX) > 120) this.dirX = this.x > this.spawnX ? -1 : 1;
  }
  draw(ctx, camX, camY) {
    const name = Math.floor(this.animTime * 6) % 2 ? 'icespirit2' : 'icespirit1';
    if (this.dead) return this.drawFlipped(ctx, name, camX, camY);
    this.drawSpriteAnchored(ctx, name, camX, camY);
  }
}
