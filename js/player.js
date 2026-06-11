'use strict';
// ---------------------------------------------------------------------------
// Player — Pasang. Sizes: 0 small, 1 big (momo), 2 khukuri power.
// ---------------------------------------------------------------------------

const SIZE_SMALL = 0, SIZE_BIG = 1, SIZE_KHUKURI = 2;

class Player extends Entity {
  constructor(x, y) {
    super(x, y, 12, 14);
    this.size = SIZE_SMALL;
    this.facing = 1;
    this.runFrame = 0;
    this.runTime = 0;
    this.jumpHeld = false;
    this.skidding = false;
    this.crouching = false;
    this.invuln = 0;          // post-damage invulnerability seconds
    this.star = 0;            // chiya rush seconds
    this.throwTimer = 0;
    this.dying = false;
    this.deadTimer = 0;
    this.enteringWell = null; // {timer, well}
    this.exitingWell = 0;
    this.pendingGrow = 0;     // grow/shrink animation freeze
    this.growTo = null;
    this.animFlash = 0;
  }

  setSize(size) {
    const wasBottom = this.bottom;
    this.size = size;
    const h = size === SIZE_SMALL ? 14 : (this.crouching ? 16 : 26);
    this.y = wasBottom - h;
    this.h = h;
  }

  grow(toSize) {
    if (toSize <= this.size) return;
    Audio_.sfx('grow');
    this.pendingGrow = 0.7;
    this.growTo = toSize;
  }

  takeDamage(level) {
    if (this.invuln > 0 || this.star > 0 || this.dying || this.pendingGrow > 0) return;
    if (this.size === SIZE_SMALL) {
      this.die(level);
    } else {
      Audio_.sfx('shrink');
      this.setSize(this.size === SIZE_KHUKURI ? SIZE_BIG : SIZE_SMALL);
      this.invuln = 2;
    }
  }

  die(level) {
    if (this.dying) return;
    this.dying = true;
    this.deadTimer = 0;
    this.vy = -330;
    this.vx = 0;
    level.onPlayerDying();
  }

  bounce(held) {
    this.vy = -(held ? PHYS.STOMP_BOUNCE_HELD : PHYS.STOMP_BOUNCE);
  }

  update(dt, level) {
    if (this.dying) {
      this.deadTimer += dt;
      if (this.deadTimer > 0.35) { // brief freeze, then fall
        this.vy = Math.min(this.vy + PHYS.GRAVITY * dt, PHYS.MAX_FALL * 1.4);
        this.y += this.vy * dt;
      }
      if (this.y > level.pixelH + 80 && this.deadTimer > 1.6) level.onPlayerDead();
      return;
    }
    if (this.pendingGrow > 0) { // freeze during grow animation
      this.pendingGrow -= dt;
      this.animFlash += dt;
      if (this.pendingGrow <= 0 && this.growTo != null) {
        this.setSize(this.growTo);
        this.growTo = null;
      }
      return;
    }
    if (this.enteringWell) {
      this.enteringWell.timer -= dt;
      this.y += 30 * dt;
      if (this.enteringWell.timer <= 0) {
        const w = this.enteringWell.well;
        this.enteringWell = null;
        level.warpThroughWell(w);
      }
      return;
    }
    if (this.exitingWell > 0) {
      this.exitingWell -= dt;
      this.y -= 30 * dt;
      return;
    }

    this.invuln = Math.max(0, this.invuln - dt);
    if (this.star > 0) {
      this.star -= dt;
      if (this.star <= 0) level.onStarEnd();
    }
    this.throwTimer = Math.max(0, this.throwTimer - dt);
    this.animFlash += dt;

    const left = Input.down.left, right = Input.down.right;
    const run = Input.down.run;
    const wantCrouch = Input.down.down && this.size !== SIZE_SMALL && this.onGround;

    // crouch transitions (big only)
    if (wantCrouch && !this.crouching) {
      this.crouching = true;
      this.y += 10; this.h = 16;
    } else if (!Input.down.down && this.crouching) {
      // stand up only if there is headroom
      const headFree = !this.touchingHeadroom(level, 10);
      if (headFree) { this.crouching = false; this.y -= 10; this.h = 26; }
    }

    // --- horizontal control ---
    const starBoost = this.star > 0 ? 1.25 : 1;
    const maxSpeed = (run ? PHYS.RUN_MAX : PHYS.WALK_MAX) * starBoost;
    let move = 0;
    if (left && !right) move = -1;
    if (right && !left) move = 1;
    if (this.crouching && this.onGround) move = 0;

    const iceMul = this.onIce ? PHYS.ICE_FACTOR : 1;
    this.skidding = false;
    if (move !== 0) {
      this.facing = move;
      if (this.onGround && sign(this.vx) !== 0 && sign(this.vx) !== move) {
        // skid
        this.skidding = true;
        this.vx += move * PHYS.SKID_DECEL * iceMul * dt;
      } else {
        const acc = this.onGround ? (run ? PHYS.RUN_ACCEL : PHYS.ACCEL) * iceMul : PHYS.AIR_ACCEL;
        this.vx += move * acc * dt;
        if (Math.abs(this.vx) > maxSpeed) {
          // ease back to cap (lets you keep running momentum when releasing run)
          this.vx = move * Math.max(maxSpeed, Math.abs(this.vx) - PHYS.FRICTION * dt);
        }
      }
    } else if (this.onGround) {
      const fr = PHYS.FRICTION * iceMul * dt;
      if (Math.abs(this.vx) <= fr) this.vx = 0;
      else this.vx -= sign(this.vx) * fr;
    }

    // --- jumping ---
    if (Input.pressed.jump && this.onGround) {
      const bonus = PHYS.JUMP_SPEED_RUN_BONUS * Math.abs(this.vx) / PHYS.RUN_MAX;
      this.vy = -(PHYS.JUMP_SPEED + bonus);
      this.jumpHeld = true;
      Audio_.sfx(this.size === SIZE_SMALL ? 'jump' : 'bigjump');
    }
    if (!Input.down.jump) this.jumpHeld = false;
    const g = (this.vy < 0 && this.jumpHeld) ? PHYS.GRAVITY_JUMP_HELD : PHYS.GRAVITY;
    this.vy = Math.min(this.vy + g * dt, PHYS.MAX_FALL);

    // --- throw khukuri ---
    if (Input.pressed.run && this.size === SIZE_KHUKURI && !this.crouching) {
      if (level.countProjectiles() < 2) {
        level.spawn(new KhukuriProj(
          this.cx + this.facing * 8, this.y + 6, this.facing));
        this.throwTimer = 0.25;
        Audio_.sfx('throw');
      }
    }

    // --- move & collide ---
    this.moveAndCollide(level, dt, { bumper: this });
    if (this.hitHead) Audio_.sfx('bump');

    // --- tile interactions ---
    this.collectCoins(level);
    if (this.touchingTile(level, TileBehavior.isHazard)) this.takeDamage(level);
    if (this.touchingTile(level, TileBehavior.isWater)) this.die(level);
    if (this.y > level.pixelH + 24) this.die(level);

    // crumble planks under feet
    if (this.onGround) {
      for (const ft of this.feetTiles(level)) level.steppedOn(ft.tx, ft.ty);
    }

    // enter wells
    if (Input.pressed.down && this.onGround && !this.crouching || (Input.down.down && this.onGround && this.size === SIZE_SMALL)) {
      const well = level.wellUnder(this);
      if (well && well.enterable) {
        this.enteringWell = { timer: 0.7, well };
        this.vx = 0; this.vy = 0;
        this.x = well.x + well.w / 2 - this.w / 2;
        if (this.crouching) { this.crouching = false; this.y -= 10; this.h = 26; }
        Audio_.sfx('well');
        return;
      }
    }

    // animation bookkeeping
    if (this.onGround && Math.abs(this.vx) > 8) {
      this.runTime += dt * (0.6 + Math.abs(this.vx) / PHYS.RUN_MAX);
      if (this.runTime > 0.09) { this.runTime = 0; this.runFrame = (this.runFrame + 1) % 3; }
    } else if (this.onGround) {
      this.runFrame = 0;
    }
  }

  touchingHeadroom(level, dy) {
    const tx0 = Math.floor((this.x + 1) / TILE);
    const tx1 = Math.floor((this.x + this.w - 1) / TILE);
    const ty = Math.floor((this.y - dy) / TILE);
    for (let tx = tx0; tx <= tx1; tx++)
      if (TileBehavior.isSolid(level.tileAt(tx, ty))) return true;
    return false;
  }

  collectCoins(level) {
    const tx0 = Math.floor(this.x / TILE);
    const tx1 = Math.floor((this.x + this.w - 0.01) / TILE);
    const ty0 = Math.floor(this.y / TILE);
    const ty1 = Math.floor((this.y + this.h - 0.01) / TILE);
    for (let ty = ty0; ty <= ty1; ty++)
      for (let tx = tx0; tx <= tx1; tx++)
        if (level.tileAt(tx, ty) === T.COIN) level.takeCoinTile(tx, ty);
  }

  spriteName() {
    const big = this.size !== SIZE_SMALL;
    const suffix = this.size === SIZE_KHUKURI ? '_g' : '';
    if (this.dying) return 'p_sm_die';
    if (this.pendingGrow > 0) {
      // flicker between sizes while growing
      const phase = Math.floor(this.animFlash * 12) % 2;
      if (this.growTo != null) {
        return phase ? 'p_sm_idle' : 'p_big_idle' + (this.growTo === SIZE_KHUKURI ? '_g' : '');
      }
      return phase ? 'p_sm_idle' : 'p_big_idle' + suffix;
    }
    if (big) {
      if (this.crouching) return 'p_big_crouch' + suffix;
      if (this.throwTimer > 0) return 'p_big_throw' + suffix;
      if (!this.onGround) return 'p_big_jump' + suffix;
      if (this.skidding) return 'p_big_skid' + suffix;
      if (Math.abs(this.vx) > 8) return ['p_big_run1', 'p_big_run2', 'p_big_idle'][this.runFrame] + suffix;
      return 'p_big_idle' + suffix;
    }
    if (!this.onGround) return 'p_sm_jump';
    if (this.skidding) return 'p_sm_skid';
    if (Math.abs(this.vx) > 8) return ['p_sm_run1', 'p_sm_run2', 'p_sm_idle'][this.runFrame];
    return 'p_sm_idle';
  }

  draw(ctx, camX, camY) {
    // flicker while invulnerable
    if (this.invuln > 0 && Math.floor(this.animFlash * 18) % 2 === 0 && !this.dying) return;
    const name = this.spriteName();
    const s = Sprites[name];
    if (!s) return;
    const dx = this.x - (s.w - this.w) / 2 - camX;
    const dy = this.y + this.h - s.h - camY;
    if (this.star > 0) {
      // chiya rush shimmer
      const hue = (this.animFlash * 600) % 360;
      ctx.save();
      ctx.filter = `hue-rotate(${Math.floor(hue)}deg) saturate(1.6) brightness(1.15)`;
      drawSprite(ctx, name, dx, dy, this.facing < 0);
      ctx.restore();
    } else {
      drawSprite(ctx, name, dx, dy, this.facing < 0);
    }
  }
}
