'use strict';
// ---------------------------------------------------------------------------
// Entity — base class with AABB tile collision against the level grid.
// ---------------------------------------------------------------------------

class Entity {
  constructor(x, y, w, h) {
    this.x = x; this.y = y;       // top-left of hitbox
    this.w = w; this.h = h;
    this.vx = 0; this.vy = 0;
    this.onGround = false;
    this.onIce = false;
    this.hitWall = false;
    this.hitHead = false;
    this.removed = false;         // marked for deletion
    this.gravity = PHYS.GRAVITY;
    this.maxFall = PHYS.MAX_FALL;
    this.facing = -1;             // -1 left, 1 right
  }

  get cx() { return this.x + this.w / 2; }
  get cy() { return this.y + this.h / 2; }
  get bottom() { return this.y + this.h; }
  get right() { return this.x + this.w; }

  overlaps(o) { return rectsOverlap(this.x, this.y, this.w, this.h, o.x, o.y, o.w, o.h); }

  applyGravity(dt) {
    this.vy = Math.min(this.vy + this.gravity * dt, this.maxFall);
  }

  // Move with tile collision. opts: {oneway: respect one-way platforms (default true),
  // dropThrough: ignore one-ways this frame, bumper: entity that bumps blocks with head}
  moveAndCollide(level, dt, opts = {}) {
    const useOneway = opts.oneway !== false;
    this.hitWall = false;
    this.hitHead = false;
    const wasBottom = this.bottom;

    // --- horizontal ---
    let nx = this.x + this.vx * dt;
    if (this.vx !== 0) {
      const dir = sign(this.vx);
      const edgeX = dir > 0 ? nx + this.w : nx;
      const tx = Math.floor(edgeX / TILE);
      const ty0 = Math.floor(this.y / TILE);
      const ty1 = Math.floor((this.y + this.h - 0.01) / TILE);
      let blocked = false;
      for (let ty = ty0; ty <= ty1; ty++) {
        if (TileBehavior.isSolid(level.tileAt(tx, ty))) { blocked = true; break; }
      }
      if (blocked) {
        nx = dir > 0 ? tx * TILE - this.w - 0.01 : (tx + 1) * TILE + 0.01;
        this.vx = 0;
        this.hitWall = true;
      }
    }
    this.x = nx;

    // --- vertical ---
    let ny = this.y + this.vy * dt;
    this.onGround = false;
    this.onIce = false;
    if (this.vy > 0) { // falling
      const tyB = Math.floor((ny + this.h) / TILE);
      const tx0 = Math.floor((this.x + 1) / TILE);
      const tx1 = Math.floor((this.x + this.w - 1) / TILE);
      let landed = false, ice = false;
      for (let tx = tx0; tx <= tx1; tx++) {
        const t = level.tileAt(tx, tyB);
        if (TileBehavior.isSolid(t)) {
          landed = true;
          if (TileBehavior.isIce(t)) ice = true;
        } else if (useOneway && !opts.dropThrough && TileBehavior.isOneway(t)) {
          // only land if we were above the platform top last frame
          if (wasBottom <= tyB * TILE + 4) landed = true;
        }
      }
      if (landed) {
        ny = tyB * TILE - this.h - 0.01;
        this.vy = 0;
        this.onGround = true;
        this.onIce = ice;
        // landing on lifts/crumble handled by level via standingTiles
      }
    } else if (this.vy < 0) { // rising
      const tyT = Math.floor(ny / TILE);
      const tx0 = Math.floor((this.x + 1) / TILE);
      const tx1 = Math.floor((this.x + this.w - 1) / TILE);
      let bumped = false;
      const bumpTiles = [];
      for (let tx = tx0; tx <= tx1; tx++) {
        const t = level.tileAt(tx, tyT);
        if (TileBehavior.isSolid(t) || (opts.bumper && t === T.HIDDEN)) {
          bumped = true;
          bumpTiles.push({ tx, ty: tyT, t });
        }
      }
      if (bumped) {
        ny = (tyT + 1) * TILE + 0.01;
        this.vy = 0;
        this.hitHead = true;
        if (opts.bumper) {
          // bump the tile closest to our center
          bumpTiles.sort((a, b) =>
            Math.abs((a.tx + 0.5) * TILE - this.cx) - Math.abs((b.tx + 0.5) * TILE - this.cx));
          level.bumpTile(bumpTiles[0].tx, bumpTiles[0].ty, opts.bumper);
        }
      }
    }
    this.y = ny;
  }

  // Tiles currently under the feet (for crumble planks, hazards)
  feetTiles(level) {
    const out = [];
    const tyB = Math.floor((this.y + this.h + 1) / TILE);
    const tx0 = Math.floor((this.x + 1) / TILE);
    const tx1 = Math.floor((this.x + this.w - 1) / TILE);
    for (let tx = tx0; tx <= tx1; tx++) out.push({ tx, ty: tyB, t: level.tileAt(tx, tyB) });
    return out;
  }

  // Does the body overlap any tile matching pred?
  touchingTile(level, pred) {
    const tx0 = Math.floor(this.x / TILE);
    const tx1 = Math.floor((this.x + this.w - 0.01) / TILE);
    const ty0 = Math.floor(this.y / TILE);
    const ty1 = Math.floor((this.y + this.h - 0.01) / TILE);
    for (let ty = ty0; ty <= ty1; ty++)
      for (let tx = tx0; tx <= tx1; tx++)
        if (pred(level.tileAt(tx, ty))) return true;
    return false;
  }

  // Is there ground just ahead (used by edge-turning walkers)?
  groundAhead(level) {
    const aheadX = this.facing > 0 ? this.right + 2 : this.x - 2;
    const tx = Math.floor(aheadX / TILE);
    const ty = Math.floor((this.bottom + 2) / TILE);
    const t = level.tileAt(tx, ty);
    return TileBehavior.isSolid(t) || TileBehavior.isOneway(t);
  }
}
