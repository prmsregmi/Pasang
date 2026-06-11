'use strict';
// ---------------------------------------------------------------------------
// Pasang — core constants & helpers
// ---------------------------------------------------------------------------

const TILE = 16;
const VIEW_W = 384;
const VIEW_H = 240;
const TILES_X = VIEW_W / TILE;   // 24
const TILES_Y = VIEW_H / TILE;   // 15

// Physics constants (px/s and px/s^2 at the fixed 60 Hz step)
const PHYS = {
  GRAVITY: 1500,
  GRAVITY_JUMP_HELD: 750,   // reduced gravity while rising & holding jump
  MAX_FALL: 270,
  WALK_MAX: 95,
  RUN_MAX: 160,
  ACCEL: 340,
  RUN_ACCEL: 420,
  SKID_DECEL: 620,
  FRICTION: 360,
  ICE_FACTOR: 0.22,         // multiplier for accel/friction on ice
  AIR_ACCEL: 300,
  JUMP_SPEED: 292,
  JUMP_SPEED_RUN_BONUS: 38, // extra jump speed at full run
  STOMP_BOUNCE: 200,
  STOMP_BOUNCE_HELD: 320,
};

const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
const lerp = (a, b, t) => a + (b - a) * t;
const sign = (v) => v < 0 ? -1 : v > 0 ? 1 : 0;

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

// Deterministic-ish RNG for visuals (decor placement) so levels look stable
function makeRng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const rand = (lo, hi) => lo + Math.random() * (hi - lo);
const irand = (lo, hi) => Math.floor(rand(lo, hi + 1));

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

// Zero-padded number for HUD
function pad(n, len) {
  return String(Math.max(0, Math.floor(n))).padStart(len, '0');
}

// Global event bus-lite: score popups etc. registered by level state
