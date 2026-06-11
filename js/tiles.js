'use strict';
// ---------------------------------------------------------------------------
// Tiles — internal tile IDs, behavior flags, and the char → tile mapping
// used by the ASCII level decoder.
// ---------------------------------------------------------------------------

const T = {
  EMPTY: 0,
  TERRAIN: 1,      // themed ground (grass top / dirt fill)
  SOLID: 2,        // chiseled stone, indestructible
  BRICK: 3,        // breakable when Big
  BRICK_MULTI: 4,  // multi-coin brick
  Q: 5,            // prayer block with contents (meta)
  USED: 6,
  ICE: 7,          // slippery solid
  ONEWAY: 8,       // wooden platform
  BRIDGE: 9,       // suspension bridge plank (one-way)
  SPIKES: 10,
  WATER: 11,       // deadly icy water
  HIDDEN: 12,      // invisible block with contents
  WELL_TL: 13, WELL_TR: 14, WELL_L: 15, WELL_R: 16,
  COIN: 17,        // free-floating coin
  CRUMBLE: 18,     // plank that falls shortly after being stepped on
};

const TileBehavior = {
  isSolid(t) {
    return t === T.TERRAIN || t === T.SOLID || t === T.BRICK || t === T.BRICK_MULTI ||
           t === T.Q || t === T.USED || t === T.ICE ||
           t === T.WELL_TL || t === T.WELL_TR || t === T.WELL_L || t === T.WELL_R;
  },
  isOneway(t) { return t === T.ONEWAY || t === T.BRIDGE || t === T.CRUMBLE; },
  isIce(t) { return t === T.ICE; },
  isHazard(t) { return t === T.SPIKES; },
  isWater(t) { return t === T.WATER; },
  isBumpable(t) { return t === T.BRICK || t === T.BRICK_MULTI || t === T.Q || t === T.HIDDEN; },
};

// Map chars that translate directly to tiles. Entity chars (enemies, items,
// markers) are handled by the level decoder and removed from the grid.
const CHAR_TILES = {
  '#': T.TERRAIN,
  '=': T.SOLID,
  'B': T.BRICK,
  '*': T.BRICK_MULTI,
  '?': T.Q,          // contains a coin by default
  'M': T.Q,          // momo (or khukuri when already big)
  'C': T.Q,          // chiya
  'L': T.Q,          // sel roti (1-up)
  'h': T.HIDDEN,     // hidden coin block
  'H': T.HIDDEN,     // hidden 1-up block
  'U': T.USED,
  'I': T.ICE,
  '-': T.ONEWAY,
  'b': T.BRIDGE,
  'f': T.CRUMBLE,
  '^': T.SPIKES,
  '~': T.WATER,
  'o': T.COIN,
};

// Contents for blocks, by source char
const CHAR_CONTENTS = {
  '?': { content: 'coin' },
  'M': { content: 'power' },
  'C': { content: 'chiya' },
  'L': { content: 'selroti' },
  'h': { content: 'coin' },
  'H': { content: 'selroti' },
  '*': { content: 'coin', count: 8 },
};

// Sprite lookup for a tile in a theme. Terrain resolves top/fill by caller.
function tileSprite(t, theme, frame) {
  switch (t) {
    case T.SOLID: return theme === 'snow' ? 'solid_snow' : 'solid';
    case T.BRICK: case T.BRICK_MULTI:
      return theme === 'snow' ? 'brick_snow' : theme === 'fortress' ? 'brick_fortress' : 'brick';
    case T.Q: return frame % 2 ? 'qblock2' : 'qblock1';
    case T.USED: return 'usedblock';
    case T.ICE: return 'ice';
    case T.CRUMBLE: return 'crumble';
    case T.ONEWAY: return 'platform';
    case T.BRIDGE: return 'bridge';
    case T.SPIKES: return 'spikes';
    case T.WATER: return frame % 2 ? 'water2' : 'water1';
    default: return null;
  }
}
