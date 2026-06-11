'use strict';
// ---------------------------------------------------------------------------
// Sprites — procedural pixel art. Every sprite is an original design,
// defined as palette-indexed string grids ('.' = transparent) and
// rasterized to offscreen canvases at script load.
// ---------------------------------------------------------------------------

const Sprites = {};

function defSprite(name, pal, rows) {
  const h = rows.length;
  const w = Math.max(...rows.map(r => r.length));
  const c = makeCanvas(w, h);
  const g = c.getContext('2d');
  for (let y = 0; y < h; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      const col = pal[ch];
      if (col) { g.fillStyle = col; g.fillRect(x, y, 1, 1); }
    }
  }
  Sprites[name] = { c, w, h };
}

function drawSprite(ctx, name, x, y, flip = false) {
  const s = Sprites[name];
  if (!s) return;
  x = Math.round(x); y = Math.round(y);
  if (flip) {
    ctx.save();
    ctx.translate(x + s.w, y);
    ctx.scale(-1, 1);
    ctx.drawImage(s.c, 0, 0);
    ctx.restore();
  } else {
    ctx.drawImage(s.c, x, y);
  }
}

// ===========================================================================
// PASANG — the player. Cream dhaka topi with red pattern, jacket, dark
// pants, brown boots. Two jacket palettes: crimson (Big) and saffron-gold
// (Khukuri power). Small Pasang uses the crimson palette.
// ===========================================================================

const PAL_PASANG_RED = {
  k: '#1a1418',           // outline / dark
  C: '#f2e6c8', R: '#c43a3a', // topi cream + pattern
  S: '#eebf91', s: '#c99367',  // skin + shade
  J: '#d2403c', j: '#9c2622',  // jacket + shade
  P: '#3c3c55', B: '#7c4a24',  // pants, boots
  W: '#f5f0e6',                // scarf / trim
};
const PAL_PASANG_GOLD = Object.assign({}, PAL_PASANG_RED, {
  J: '#e8a82c', j: '#b0741a', W: '#fff3d0',
});

// ----- Small Pasang (16x16) -----
function defSmallPasang(suffix, pal) {
  defSprite('p_sm_idle' + suffix, pal, [
    '.....CCCCC......',
    '....CCRCCRC.....',
    '....CCCCCCC.....',
    '.....SSSSSs.....',
    '.....SkSSkS.....',
    '.....SSSSSs.....',
    '......SSSs......',
    '....JJJJJJJ.....',
    '...JjJJJJJjJ....',
    '...JjJJJJJjJ....',
    '...SS.JJJ.SS....',
    '.....PPPPP......',
    '.....PP.PP......',
    '.....PP.PP......',
    '....BBB.BBB.....',
    '....BBB.BBB.....',
  ]);
  defSprite('p_sm_run1' + suffix, pal, [
    '.....CCCCC......',
    '....CCRCCRC.....',
    '....CCCCCCC.....',
    '.....SSSSSs.....',
    '.....SkSSkS.....',
    '.....SSSSSs.....',
    '......SSSs......',
    '....JJJJJJJ.....',
    '...JjJJJJJjS....',
    '...JjJJJJJj.....',
    '...SS.JJJJ......',
    '.....PPPPP......',
    '....PPP.PPP.....',
    '...BPP...PPB....',
    '..BBB.....BB....',
    '..BB......BBB...',
  ]);
  defSprite('p_sm_run2' + suffix, pal, [
    '.....CCCCC......',
    '....CCRCCRC.....',
    '....CCCCCCC.....',
    '.....SSSSSs.....',
    '.....SkSSkS.....',
    '.....SSSSSs.....',
    '......SSSs......',
    '....JJJJJJJ.....',
    '...SJJJJJJjJ....',
    '....JJJJJJjJ....',
    '......JJJ.SS....',
    '.....PPPPP......',
    '.....PPPPP......',
    '.....PP.PP......',
    '....BBBBBB......',
    '.....BBBB.......',
  ]);
  defSprite('p_sm_jump' + suffix, pal, [
    '.....CCCCC..S...',
    '....CCRCCRC.S...',
    '....CCCCCCCJ....',
    '.....SSSSSsJ....',
    '.....SkSSkSj....',
    '.....SSSSSj.....',
    '......SSSs......',
    '...SJJJJJJJ.....',
    '...SjJJJJJJ.....',
    '....jJJJJJJ.....',
    '.....JJJJJ......',
    '....PPPPPP......',
    '...BPP..PPP.....',
    '...BB....PPB....',
    '..........BB....',
    '................',
  ]);
  defSprite('p_sm_skid' + suffix, pal, [
    '.....CCCCC......',
    '....CCRCCRC.....',
    '....CCCCCCC.....',
    '.....SSSSSs.....',
    '.....SkSSkS.....',
    '.....SSSSSs.....',
    '......SSSs......',
    '....JJJJJJJS....',
    '...JJJJJJJJS....',
    '...SJJJJJjJ.....',
    '...S..JJJ.......',
    '.....PPPPP......',
    '....PPP..PP.....',
    '...BPP....PB....',
    '...BB.....BB....',
    '................',
  ]);
  defSprite('p_sm_die' + suffix, pal, [
    '................',
    '.....CCCCC......',
    '....CCRCCRC.....',
    '....CCCCCCC.....',
    '.....SSSSSs.....',
    '.....SxSSxS.....',
    '.....SSSSSs.....',
    '...S..SSSs..S...',
    '...SJJJJJJJJS...',
    '....JJJJJJJj....',
    '....JjJJJJJj....',
    '.....PPPPP......',
    '....PP...PP.....',
    '...BBB...BBB....',
    '................',
    '................',
  ]);
  // x = closed eyes for death sprite
  defSprite('p_sm_climb' + suffix, pal, [
    '.....CCCCC......',
    '....CCRCCRC.....',
    '....CCCCCCC.....',
    '.....SSSSSs.....',
    '.....SkSSkS.....',
    '.....SSSSSs.....',
    '..S...SSSs..S...',
    '..SJJJJJJJJJS...',
    '...JjJJJJJjJ....',
    '...JjJJJJJjJ....',
    '.....JJJJJ......',
    '.....PPPPP......',
    '....PP..PP......',
    '....PP..BB......',
    '...BBB..........',
    '................',
  ]);
}
PAL_PASANG_RED.x = PAL_PASANG_RED.k;
PAL_PASANG_GOLD.x = PAL_PASANG_GOLD.k;
defSmallPasang('', PAL_PASANG_RED);

// ----- Big Pasang (16x28, in a 16x28 grid) -----
function defBigPasang(suffix, pal) {
  defSprite('p_big_idle' + suffix, pal, [
    '.....CCCCCC.....',
    '....CCRCCRCC....',
    '....CCCCCCCC....',
    '....CCCCCCCC....',
    '.....SSSSSSs....',
    '.....SkSSSkS....',
    '.....SSSSSSs....',
    '.....sSSSSs.....',
    '......SSSS......',
    '....JJJWWJJJ....',
    '...JJJJWWJJJJ...',
    '...JjJJJJJJjJ...',
    '...JjJJJJJJjJ...',
    '...JjJJJJJJjJ...',
    '...SSjJJJJjSS...',
    '...SS.JJJJ.SS...',
    '......kkkk......',
    '.....PPPPPP.....',
    '.....PPPPPP.....',
    '.....PP..PP.....',
    '.....PP..PP.....',
    '.....PP..PP.....',
    '.....PP..PP.....',
    '....BBB..BBB....',
    '....BBB..BBB....',
    '...BBBB..BBBB...',
    '................',
    '................',
  ]);
  defSprite('p_big_run1' + suffix, pal, [
    '.....CCCCCC.....',
    '....CCRCCRCC....',
    '....CCCCCCCC....',
    '....CCCCCCCC....',
    '.....SSSSSSs....',
    '.....SkSSSkS....',
    '.....SSSSSSs....',
    '.....sSSSSs.....',
    '......SSSS......',
    '....JJJWWJJJ....',
    '...JJJJWWJJJS...',
    '...JjJJJJJJjS...',
    '...JjJJJJJJj....',
    '...JjJJJJJJj....',
    '...SSjJJJJj.....',
    '...SS.JJJJ......',
    '......kkkk......',
    '.....PPPPPP.....',
    '....PPPPPPP.....',
    '....PPP..PPP....',
    '...PPP....PPP...',
    '..BPP......PP...',
    '..BB.......PPB..',
    '.BBB........BB..',
    '.BB.........BBB.',
    '................',
    '................',
    '................',
  ]);
  defSprite('p_big_run2' + suffix, pal, [
    '.....CCCCCC.....',
    '....CCRCCRCC....',
    '....CCCCCCCC....',
    '....CCCCCCCC....',
    '.....SSSSSSs....',
    '.....SkSSSkS....',
    '.....SSSSSSs....',
    '.....sSSSSs.....',
    '......SSSS......',
    '....JJJWWJJJ....',
    '...SJJJWWJJJJ...',
    '...SjJJJJJJjJ...',
    '....jJJJJJJjJ...',
    '....jJJJJJJjJ...',
    '.....jJJJJjSS...',
    '......JJJJ.SS...',
    '......kkkk......',
    '.....PPPPPP.....',
    '.....PPPPPP.....',
    '.....PPPPPP.....',
    '.....PP.PPP.....',
    '.....PP.PP......',
    '.....PP.PP......',
    '....BBBBBB......',
    '....BBBBB.......',
    '....BBBB........',
    '................',
    '................',
  ]);
  defSprite('p_big_jump' + suffix, pal, [
    '.....CCCCCC..S..',
    '....CCRCCRCC.S..',
    '....CCCCCCCCJ...',
    '....CCCCCCCCJ...',
    '.....SSSSSSsJ...',
    '.....SkSSSkSj...',
    '.....SSSSSSj....',
    '.....sSSSSs.....',
    '......SSSS......',
    '...SJJJWWJJJ....',
    '...SJJJWWJJJJ...',
    '...JjJJJJJJjJ...',
    '...JjJJJJJJjJ...',
    '....jJJJJJJj....',
    '.....jJJJJj.....',
    '......JJJJ......',
    '......kkkk......',
    '.....PPPPPP.....',
    '....PPPPPPP.....',
    '...BPPP..PPP....',
    '...BBP....PPP...',
    '...BB......PPB..',
    '............BB..',
    '............BBB.',
    '................',
    '................',
    '................',
    '................',
  ]);
  defSprite('p_big_skid' + suffix, pal, [
    '.....CCCCCC.....',
    '....CCRCCRCC....',
    '....CCCCCCCC....',
    '....CCCCCCCC....',
    '.....SSSSSSs....',
    '.....SkSSSkS....',
    '.....SSSSSSs....',
    '.....sSSSSs.....',
    '......SSSS......',
    '....JJJWWJJJS...',
    '...JJJJWWJJJS...',
    '...SJJJJJJJj....',
    '...SjJJJJJJj....',
    '....jJJJJJj.....',
    '.....JJJJJ......',
    '......kkkk......',
    '.....PPPPPP.....',
    '....PPPPPPP.....',
    '....PPP..PPP....',
    '...BPP.....PPB..',
    '...BB......BBB..',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
  ]);
  defSprite('p_big_crouch' + suffix, pal, [
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '.....CCCCCC.....',
    '....CCRCCRCC....',
    '....CCCCCCCC....',
    '....CCCCCCCC....',
    '.....SSSSSSs....',
    '.....SkSSSkS....',
    '.....SSSSSSs....',
    '....JJJWWJJJ....',
    '...JJJJWWJJJJ...',
    '...JjJJJJJJjJ...',
    '...SSJJJJJJSS...',
    '.....PPPPPP.....',
    '.....PPPPPP.....',
    '....BBB..BBB....',
    '....BBB..BBB....',
    '...BBBB..BBBB...',
    '................',
    '................',
  ]);
  defSprite('p_big_throw' + suffix, pal, [
    '.....CCCCCC.....',
    '....CCRCCRCC....',
    '....CCCCCCCC....',
    '....CCCCCCCC....',
    '.....SSSSSSs....',
    '.....SkSSSkS....',
    '.....SSSSSSs....',
    '.....sSSSSs.....',
    '......SSSS......',
    '....JJJWWJJJJJS.',
    '...JJJJWWJJJJJS.',
    '...JjJJJJJJj....',
    '...JjJJJJJJj....',
    '...JjJJJJJJj....',
    '...SSjJJJJj.....',
    '...SS.JJJJ......',
    '......kkkk......',
    '.....PPPPPP.....',
    '.....PPPPPP.....',
    '.....PP..PP.....',
    '.....PP..PP.....',
    '.....PP..PP.....',
    '.....PP..PP.....',
    '....BBB..BBB....',
    '....BBB..BBB....',
    '...BBBB..BBBB...',
    '................',
    '................',
  ]);
}
defBigPasang('', PAL_PASANG_RED);
defBigPasang('_g', PAL_PASANG_GOLD);

// Victory pose (used by ending + level clear)
defSprite('p_victory', PAL_PASANG_RED, [
  '..S..........S..',
  '..S.CCCCCC...S..',
  '...CCRCCRCC.J...',
  '..JCCCCCCCCJ....',
  '..J.SSSSSSsJ....',
  '...jSkSSSkSj....',
  '....SSSSSSs.....',
  '....sSSSSs......',
  '.....SSSS.......',
  '....JJJWWJJ.....',
  '...JJJJWWJJJ....',
  '...JjJJJJJJj....',
  '...JjJJJJJJj....',
  '....jJJJJJj.....',
  '.....JJJJJ......',
  '......kkkk......',
  '.....PPPPPP.....',
  '.....PPPPPP.....',
  '.....PP..PP.....',
  '.....PP..PP.....',
  '.....PP..PP.....',
  '....BBB..BBB....',
  '....BBB..BBB....',
  '...BBBB..BBBB...',
]);

// ===========================================================================
// ITEMS
// ===========================================================================

// Momo (grow power-up) — pleated dumpling steaming in a bamboo basket
defSprite('it_momo', {
  k: '#1a1418', M: '#f8f0e0', m: '#d8c8a8', p: '#b8a888',
  B: '#c89858', b: '#966e34', d: '#6e4e20', s: '#dcecf4',
}, [
  '....s.....s.....',
  '...s.....s......',
  '...s..s..s......',
  '....s..s........',
  '.......kk.......',
  '.....kkmmkk.....',
  '....kMmMMmMk....',
  '...kMpMmMpMMk...',
  '..kMMMpMpMMMMk..',
  '..kMMMMMMMMMMk..',
  '.kBBBBBBBBBBBBk.',
  '.kBdBbBdBbBdBBk.',
  '.kBBBBBBBBBBBBk.',
  '..kkkkkkkkkkkk..',
]);

// Khukuri (projectile power-up) — the recurved blade with its cho notch
defSprite('it_khukuri', {
  k: '#1a1418', E: '#e4eaf2', e: '#a8b4c2', d: '#76828e',
  H: '#8a5a28', h: '#6b421c', G: '#e8b83a',
}, [
  '...........kk...',
  '..........kEEk..',
  '.........kEEEk..',
  '........kEEEEk..',
  '.......kEEEEek..',
  '......kEEEEeek..',
  '.....kEEEEeek...',
  '....kEEEEeek....',
  '...kEEEEeek.....',
  '..kEEEeeek......',
  '..kEEeedk.......',
  '..kEdk.k........',
  '..kGGk..........',
  '..kHHhk.........',
  '..kHHhk.........',
  '...kkk..........',
]);

// Chiya (invincibility) — a hot glass of milk tea
defSprite('it_chiya', {
  k: '#1a1418', G: '#cfe0ec', T: '#c08a4e', t: '#a06c34', m: '#e0c8a0', W: '#e8f4fc',
}, [
  '....W....W......',
  '...W....W.......',
  '...W.W..W.......',
  '....W..W........',
  '..kkkkkkkkkk....',
  '..kGmmmmmmGk....',
  '..kGTTTTTTGk....',
  '..kGTtTTTtGk....',
  '..kGTTTTTTGk....',
  '...kGTtTTGk.....',
  '...kGTTTTGk.....',
  '....kkkkkk......',
]);

// Sel roti (1-up) — glossy golden-brown ring of fried rice bread
defSprite('it_selroti', {
  k: '#1a1418', G: '#d8923a', g: '#b06e22', d: '#8a5418', W: '#f0c878',
}, [
  '....kkkkkk......',
  '..kkGGGWGGkk....',
  '.kGWgGGGGgGGk...',
  '.kGGkkkkkkGWk...',
  'kGWk......kGGk..',
  'kGgk......kgWk..',
  'kWGk......kGGk..',
  'kGgk......kgGk..',
  '.kGGkkkkkkGGk...',
  '.kGWgGGGgGWGk...',
  '..kkGGGWGGkk....',
  '....kkkkkk......',
]);

// Nepal's double-pennant flag on a pole — 2 flutter frames
function defNepalFlag(name, flut) {
  defSprite(name, {
    k: '#171217', C: '#c8102e', c: '#9a0c22', B: '#1a3a8c',
    W: '#f4f4f8', P: '#8a5a28', p: '#5e3c16', G: '#e8b83a',
  }, flut === 0 ? [
    '.kG.............',
    '.kPB............',
    '.kPBB...........',
    '.kPBCBB.........',
    '.kPBCCCBB.......',
    '.kPBCWCCCBB.....',
    '.kPBWWWCCCCB....',
    '.kPBCWCCCCB.....',
    '.kPBCCCCCB......',
    '.kPBCCCB........',
    '.kPBBCCCBB......',
    '.kPBCCWCCCBB....',
    '.kPBCWWWCCCCB...',
    '.kPBCWWWWCCCCB..',
    '.kPBCCWCCCCB....',
    '.kPBCCCCCB......',
    '.kPBCCCB........',
    '.kPBCB..........',
    '.kPB............',
    '.kPp............',
    '.kPp............',
    '.kPp............',
    '.kPp............',
    '.kPp............',
  ] : [
    '.kG.............',
    '.kPB............',
    '.kPBB...........',
    '.kPBCBB.........',
    '.kPBCCCBBB......',
    '.kPBCWCCCCB.....',
    '.kPBWWWCCCB.....',
    '.kPBCWCCCB......',
    '.kPBCCCCB.......',
    '.kPBCCCB........',
    '.kPBBCCCBBB.....',
    '.kPBCCWCCCCBB...',
    '.kPBCWWWCCCCB...',
    '.kPBCWWWWCCCB...',
    '.kPBCCWCCCCB....',
    '.kPBCCCCB.......',
    '.kPBCCCB........',
    '.kPBCB..........',
    '.kPB............',
    '.kPp............',
    '.kPp............',
    '.kPp............',
    '.kPp............',
    '.kPp............',
  ]);
}
defNepalFlag('npflag1', 0);
defNepalFlag('npflag2', 1);

// Small wayside pagoda shrine (decor)
defPaintedTile('shrine', 28, 30, (g) => {
  // brick base
  g.fillStyle = '#8a4a32'; g.fillRect(8, 18, 12, 12);
  g.fillStyle = '#6e3826'; g.fillRect(8, 18, 12, 2); g.fillRect(12, 22, 4, 8);
  // lower roof
  g.fillStyle = '#3e2c1e';
  g.beginPath(); g.moveTo(2, 18); g.lineTo(14, 10); g.lineTo(26, 18); g.fill();
  g.fillStyle = '#5a4028'; g.fillRect(2, 17, 24, 2);
  // upper tier
  g.fillStyle = '#8a4a32'; g.fillRect(11, 8, 6, 4);
  g.fillStyle = '#3e2c1e';
  g.beginPath(); g.moveTo(6, 9); g.lineTo(14, 3); g.lineTo(22, 9); g.fill();
  // gajur finial
  g.fillStyle = '#e8b83a'; g.fillRect(13, 0, 2, 4);
  g.fillRect(12, 2, 4, 1);
});

// Rupee coin — 4 spin frames
const PAL_COIN = { k: '#7a5a10', G: '#f8d030', g: '#caa018', W: '#fff8c8' };
defSprite('coin1', PAL_COIN, [
  '....kkkkkk..',
  '...kGGGGGGk.',
  '..kGWGggGGGk',
  '..kGgG..GgGk',
  '..kGgG..GgGk',
  '..kGgG..GgGk',
  '..kGgG..GgGk',
  '..kGGGggGWGk',
  '...kGGGGGGk.',
  '....kkkkkk..',
]);
defSprite('coin2', PAL_COIN, [
  '.....kkkk...',
  '....kGGGGk..',
  '....kGgGGk..',
  '....kGgGGk..',
  '....kGgGGk..',
  '....kGgGGk..',
  '....kGgGGk..',
  '....kGgGGk..',
  '....kGGGGk..',
  '.....kkkk...',
]);
defSprite('coin3', PAL_COIN, [
  '......kk....',
  '.....kGGk...',
  '.....kGGk...',
  '.....kGGk...',
  '.....kGGk...',
  '.....kGGk...',
  '.....kGGk...',
  '.....kGGk...',
  '.....kGGk...',
  '......kk....',
]);
defSprite('coin4', PAL_COIN, [
  '.....kkkk...',
  '....kGGGGk..',
  '....kGGgGk..',
  '....kGGgGk..',
  '....kGGgGk..',
  '....kGGgGk..',
  '....kGGgGk..',
  '....kGGgGk..',
  '....kGGGGk..',
  '.....kkkk...',
]);

// Thrown khukuri projectile — 2 rotation frames
const PAL_KPROJ = { k: '#1a1418', E: '#dfe6ee', e: '#9fb0c0', H: '#8a5a28' };
defSprite('kproj1', PAL_KPROJ, [
  '.....kk.',
  '....kEEk',
  '...kEEk.',
  '..kEEk..',
  '.kEEk...',
  'kHHk....',
  'kHk.....',
  '.k......',
]);
defSprite('kproj2', PAL_KPROJ, [
  'kk......',
  'kEEk....',
  '.kEEk...',
  '..kEEk..',
  '...kEEk.',
  '....kHHk',
  '.....kHk',
  '......k.',
]);

// Yeti ice chunk + langur fruit projectiles
defSprite('icechunk', { k: '#4a7aa8', I: '#cfe8f8', i: '#9cc8e8' }, [
  '..kkkk....',
  '.kIIIIk...',
  'kIIiIIIk..',
  'kIiIIIiIk.',
  'kIIIiIIIk.',
  '.kIiIIik..',
  '..kkkkk...',
]);
defSprite('fruit', { k: '#5a2c10', F: '#e85c30', f: '#b83a18', L: '#3f8c3f' }, [
  '...L....',
  '..LL....',
  '.kFFk...',
  'kFFfFk..',
  'kFfFFk..',
  'kFFFfk..',
  '.kFFk...',
  '..kk....',
]);

// Particles
defSprite('shard', { B: '#b89464', b: '#8a6a40' }, ['BBb.', 'Bbb.', 'bb..']);
defSprite('shard_snow', { B: '#e8f2fa', b: '#b8d0e0' }, ['BBb.', 'Bbb.', 'bb..']);
defSprite('sparkle', { W: '#ffffff', Y: '#f8d030' }, ['..W..', '.WYW.', 'WYYYW', '.WYW.', '..W..']);
defSprite('snowflake', { W: '#eef6ff' }, ['W.W', '.W.', 'W.W']);
defSprite('puff', { W: '#f0ead8', w: '#cfc8b0' }, [
  '.WWW.', 'WWwWW', 'WwWwW', 'WWwWW', '.WWW.',
]);

// ===========================================================================
// TILES — painted with canvas primitives for texture
// ===========================================================================

function defPaintedTile(name, w, h, painter) {
  const c = makeCanvas(w, h);
  painter(c.getContext('2d'), w, h);
  Sprites[name] = { c, w, h };
}

function speckle(g, w, h, color, n, rng) {
  g.fillStyle = color;
  for (let i = 0; i < n; i++) g.fillRect(Math.floor(rng() * w), Math.floor(rng() * h), 1, 1);
}

// Terrain: "top" tile (with surface) and "fill" tile per theme
function defTerrain(theme, surface, surfHi, soil, soilDark, soilSpeck) {
  defPaintedTile('top_' + theme, TILE, TILE, (g) => {
    const rng = makeRng(7 + theme.length);
    g.fillStyle = soil; g.fillRect(0, 0, 16, 16);
    speckle(g, 16, 16, soilDark, 9, rng);
    g.fillStyle = surface; g.fillRect(0, 0, 16, 5);
    g.fillStyle = surfHi; g.fillRect(0, 0, 16, 2);
    // tufts on the surface lip
    g.fillStyle = surfHi;
    g.fillRect(2, 2, 1, 2); g.fillRect(7, 2, 1, 3); g.fillRect(12, 2, 1, 2);
    g.fillStyle = soilDark; g.fillRect(0, 5, 16, 1);
  });
  defPaintedTile('fill_' + theme, TILE, TILE, (g) => {
    const rng = makeRng(13 + theme.length);
    g.fillStyle = soil; g.fillRect(0, 0, 16, 16);
    speckle(g, 16, 16, soilDark, 11, rng);
    speckle(g, 16, 16, soilSpeck, 5, rng);
  });
}
defTerrain('hills', '#58b048', '#88d060', '#9c6a38', '#7a4e26', '#b8854a');
defTerrain('night', '#3a7a4a', '#549a5c', '#6a4a30', '#4e3520', '#80603e');
defTerrain('cave',  '#8a8a9a', '#a8a8b8', '#5a5a6c', '#42424f', '#6e6e80');
defTerrain('snow',  '#f0f6fc', '#ffffff', '#8a93b0', '#6a7390', '#a0a8c4');
defTerrain('fortress', '#7a7484', '#948e9e', '#4a4452', '#36303e', '#5e5866');

// Breakable stone brick
function defBrick(name, base, dark, lite) {
  defPaintedTile(name, TILE, TILE, (g) => {
    g.fillStyle = base; g.fillRect(0, 0, 16, 16);
    g.fillStyle = dark;
    g.fillRect(0, 7, 16, 1); g.fillRect(0, 15, 16, 1);
    g.fillRect(7, 0, 1, 7); g.fillRect(3, 8, 1, 7); g.fillRect(11, 8, 1, 7);
    g.fillStyle = lite;
    g.fillRect(0, 0, 16, 1); g.fillRect(0, 8, 3, 1); g.fillRect(4, 8, 7, 1); g.fillRect(12, 8, 4, 1);
  });
}
defBrick('brick', '#c09858', '#7e5e2e', '#e0bc80');
defBrick('brick_snow', '#b8d4ec', '#7a96b4', '#e0f0fc');
defBrick('brick_fortress', '#8a8494', '#544e62', '#aaa4b4');

// Prayer block (the "?" block) — golden with a carved eye, 2 glow frames
function defPrayerBlock(name, base, dark, lite, eye) {
  defPaintedTile(name, TILE, TILE, (g) => {
    g.fillStyle = base; g.fillRect(0, 0, 16, 16);
    g.fillStyle = lite; g.fillRect(0, 0, 16, 2); g.fillRect(0, 0, 2, 16);
    g.fillStyle = dark; g.fillRect(0, 14, 16, 2); g.fillRect(14, 0, 2, 16);
    g.fillStyle = dark;
    g.fillRect(2, 2, 1, 1); g.fillRect(13, 2, 1, 1); g.fillRect(2, 13, 1, 1); g.fillRect(13, 13, 1, 1);
    // carved Himalayan eye symbol
    g.fillStyle = eye;
    g.fillRect(5, 5, 6, 2);     // brow
    g.fillRect(4, 7, 2, 2); g.fillRect(10, 7, 2, 2); // eyes
    g.fillRect(7, 8, 2, 3);     // nose curl
    g.fillRect(6, 11, 1, 1); g.fillRect(9, 11, 1, 1);
  });
}
defPrayerBlock('qblock1', '#e8b83a', '#a87c1a', '#ffe080', '#7a4a08');
defPrayerBlock('qblock2', '#f0cc60', '#b8923a', '#fff0b0', '#8a5a18');
defPaintedTile('usedblock', TILE, TILE, (g) => {
  g.fillStyle = '#9a8a78'; g.fillRect(0, 0, 16, 16);
  g.fillStyle = '#b8a890'; g.fillRect(0, 0, 16, 2); g.fillRect(0, 0, 2, 16);
  g.fillStyle = '#6e6050'; g.fillRect(0, 14, 16, 2); g.fillRect(14, 0, 2, 16);
  g.fillStyle = '#6e6050';
  g.fillRect(2, 2, 1, 1); g.fillRect(13, 2, 1, 1); g.fillRect(2, 13, 1, 1); g.fillRect(13, 13, 1, 1);
});

// Solid chiseled stone (indestructible)
function defSolid(name, base, dark, lite) {
  defPaintedTile(name, TILE, TILE, (g) => {
    g.fillStyle = base; g.fillRect(0, 0, 16, 16);
    g.fillStyle = lite; g.fillRect(0, 0, 16, 2); g.fillRect(0, 0, 2, 16);
    g.fillStyle = dark; g.fillRect(0, 14, 16, 2); g.fillRect(14, 0, 2, 16);
    g.fillStyle = dark; g.fillRect(4, 4, 8, 8);
    g.fillStyle = base; g.fillRect(4, 4, 7, 7);
    g.fillStyle = lite; g.fillRect(4, 4, 7, 1);
  });
}
defSolid('solid', '#9a9aaa', '#5e5e70', '#c0c0d0');
defSolid('solid_snow', '#a8c4e0', '#6a86a4', '#d0e4f4');

// Ice block — slippery solid
defPaintedTile('ice', TILE, TILE, (g) => {
  g.fillStyle = '#9cd4f0'; g.fillRect(0, 0, 16, 16);
  g.fillStyle = '#c8ecfc'; g.fillRect(0, 0, 16, 3);
  g.fillStyle = '#e8f8ff'; g.fillRect(2, 4, 3, 1); g.fillRect(8, 8, 4, 1); g.fillRect(4, 12, 3, 1);
  g.fillStyle = '#6aa8cc'; g.fillRect(0, 14, 16, 2); g.fillRect(14, 0, 2, 14);
});

// One-way wooden platform
defPaintedTile('platform', TILE, 8, (g) => {
  g.fillStyle = '#a8743c'; g.fillRect(0, 0, 16, 5);
  g.fillStyle = '#d09858'; g.fillRect(0, 0, 16, 2);
  g.fillStyle = '#7a5226'; g.fillRect(0, 5, 16, 1);
  g.fillStyle = '#7a5226'; g.fillRect(3, 1, 1, 3); g.fillRect(11, 1, 1, 3);
});

// Suspension bridge plank (one-way, with rope rail drawn above)
defPaintedTile('bridge', TILE, TILE, (g) => {
  g.fillStyle = '#9a6a34'; g.fillRect(0, 4, 16, 4);
  g.fillStyle = '#c08c4c'; g.fillRect(0, 4, 16, 1);
  g.fillStyle = '#6e4a20'; g.fillRect(0, 7, 16, 1);
  g.fillStyle = '#6e4a20'; g.fillRect(4, 4, 1, 4); g.fillRect(12, 4, 1, 4);
  // rope rail
  g.fillStyle = '#d8c090'; g.fillRect(0, 0, 16, 1);
  g.fillStyle = '#b89c68'; g.fillRect(2, 1, 1, 3); g.fillRect(10, 1, 1, 3);
});

// Crumbling plank (falls when stood on)
defPaintedTile('crumble', TILE, TILE, (g) => {
  g.fillStyle = '#9a6a34'; g.fillRect(0, 4, 16, 4);
  g.fillStyle = '#c08c4c'; g.fillRect(0, 4, 16, 1);
  g.fillStyle = '#5a3c18'; g.fillRect(3, 4, 1, 4); g.fillRect(7, 5, 1, 3); g.fillRect(12, 4, 1, 4);
  g.fillStyle = '#d8c090'; g.fillRect(0, 0, 16, 1);
  g.fillStyle = '#b89c68'; g.fillRect(6, 1, 1, 3);
});

// Spikes
defPaintedTile('spikes', TILE, TILE, (g) => {
  g.fillStyle = '#aab2c0';
  for (let i = 0; i < 4; i++) {
    const bx = i * 4;
    g.beginPath();
    g.moveTo(bx, 16); g.lineTo(bx + 2, 6); g.lineTo(bx + 4, 16);
    g.fill();
  }
  g.fillStyle = '#7a8290'; g.fillRect(0, 14, 16, 2);
  g.fillStyle = '#e8eef6';
  for (let i = 0; i < 4; i++) g.fillRect(i * 4 + 1, 8, 1, 4);
});

// Icy water (hazard) — 2 animation frames
function defWater(name, phase) {
  defPaintedTile(name, TILE, TILE, (g) => {
    g.fillStyle = '#2c5a88'; g.fillRect(0, 0, 16, 16);
    g.fillStyle = '#4880b0'; g.fillRect(0, 0, 16, 4);
    g.fillStyle = '#cfe8f8';
    if (phase === 0) { g.fillRect(1, 0, 4, 1); g.fillRect(9, 1, 4, 1); }
    else { g.fillRect(5, 1, 4, 1); g.fillRect(12, 0, 4, 1); }
  });
}
defWater('water1', 0);
defWater('water2', 1);

// Stone well — 2 tiles wide; rim + shaft
defPaintedTile('well_top', 32, 16, (g) => {
  g.fillStyle = '#8a8a96'; g.fillRect(0, 4, 32, 12);
  g.fillStyle = '#b0b0bc'; g.fillRect(0, 4, 32, 3);
  g.fillStyle = '#62626e'; g.fillRect(0, 14, 32, 2);
  g.fillStyle = '#4a4a56'; g.fillRect(4, 7, 24, 7);
  g.fillStyle = '#26262e'; g.fillRect(6, 8, 20, 6);
  g.fillStyle = '#62626e';
  g.fillRect(3, 4, 2, 12); g.fillRect(27, 4, 2, 12);
  g.fillRect(9, 5, 2, 2); g.fillRect(15, 5, 2, 2); g.fillRect(21, 5, 2, 2);
});
defPaintedTile('well_shaft', 32, 16, (g) => {
  g.fillStyle = '#8a8a96'; g.fillRect(0, 0, 32, 16);
  g.fillStyle = '#62626e';
  g.fillRect(0, 3, 32, 1); g.fillRect(0, 9, 32, 1); g.fillRect(0, 15, 32, 1);
  g.fillRect(8, 0, 1, 3); g.fillRect(20, 4, 1, 5); g.fillRect(12, 10, 1, 5); g.fillRect(26, 10, 1, 5);
  g.fillStyle = '#a4a4b0'; g.fillRect(0, 0, 32, 1); g.fillRect(0, 0, 1, 16); g.fillRect(31, 0, 1, 16);
});

// Springboard (yak-hide drum) — 3 compression frames
function defSpring(name, top) {
  defPaintedTile(name, TILE, TILE, (g) => {
    g.fillStyle = '#c8a060'; g.fillRect(2, top, 12, 15 - top);
    g.fillStyle = '#8a6830'; g.fillRect(2, top, 12, 1);
    g.fillStyle = '#e8d0a0'; g.fillRect(2, top + 1, 12, 2);
    g.fillStyle = '#8a6830';
    g.fillRect(2, top, 1, 15 - top); g.fillRect(13, top, 1, 15 - top);
    g.fillRect(4, top + 3, 1, 12 - top); g.fillRect(8, top + 3, 1, 12 - top); g.fillRect(11, top + 3, 1, 12 - top);
    g.fillStyle = '#6a4a18'; g.fillRect(0, 14, 16, 2);
  });
}
defSpring('spring1', 2);
defSpring('spring2', 7);
defSpring('spring3', 11);

// Bell + post (level goal)
defSprite('bell', { k: '#5a4408', G: '#f0c040', g: '#c09020', W: '#fff0b0' }, [
  '......kkkk......',
  '.....kkGGkk.....',
  '....kGGGGGGk....',
  '...kGWGGGGGGk...',
  '...kGWGGGGGGk...',
  '..kGGWGGGGGGGk..',
  '..kGGWGGGGGGGk..',
  '..kGGGGGGGGGGk..',
  '.kGGGGGGGGGGGGk.',
  '.kkkkkkkkkkkkkk.',
  '....kggGGggk....',
  '......kGGk......',
  '.......kk.......',
]);
defPaintedTile('bellpost', TILE, TILE, (g) => {
  g.fillStyle = '#8a5a28'; g.fillRect(6, 0, 4, 16);
  g.fillStyle = '#b07c40'; g.fillRect(6, 0, 1, 16);
  g.fillStyle = '#5e3c16'; g.fillRect(9, 0, 1, 16);
});
defPaintedTile('bellbeam', TILE, TILE, (g) => {
  g.fillStyle = '#8a5a28'; g.fillRect(0, 4, 16, 4);
  g.fillStyle = '#b07c40'; g.fillRect(0, 4, 16, 1);
  g.fillStyle = '#5e3c16'; g.fillRect(0, 7, 16, 1);
});

// Prayer wheel checkpoint — 2 frames (16x26 with post)
function defPrayerWheel(name, spin) {
  defSprite(name, {
    k: '#5a3808', G: '#e8b83a', g: '#b8862a', R: '#c43a3a', B: '#8a5a28', W: '#fff0c0',
  }, spin === 0 ? [
    '.......kk.......',
    '......kGGk......',
    '....kkkkkkkk....',
    '...kGGGGGGGGk...',
    '...kGRWWGRGGk...',
    '...kGGGGGGGGk...',
    '...kGRGWWRGGk...',
    '...kGGGGGGGGk...',
    '...kgggggggGk...',
    '....kkkkkkkk....',
    '......kBBk......',
    '......kBBk......',
    '......kBBk......',
    '......kBBk......',
    '.....kBBBBk.....',
    '....kBBBBBBk....',
  ] : [
    '.......kk.......',
    '......kGGk......',
    '....kkkkkkkk....',
    '...kGGGGGGGGk...',
    '...kGGRWWGRGk...',
    '...kGGGGGGGGk...',
    '...kGWRGGWRGk...',
    '...kGGGGGGGGk...',
    '...kgggggggGk...',
    '....kkkkkkkk....',
    '......kBBk......',
    '......kBBk......',
    '......kBBk......',
    '......kBBk......',
    '.....kBBBBk.....',
    '....kBBBBBBk....',
  ]);
}
defPrayerWheel('wheel1', 0);
defPrayerWheel('wheel2', 1);

// Lever (yeti bridge release)
defSprite('lever', { k: '#1a1418', H: '#c0c8d4', B: '#8a5a28', G: '#e8b83a' }, [
  '..........kk....',
  '.........kGGk...',
  '.........kGGk...',
  '........kHk.....',
  '.......kHk......',
  '......kHk.......',
  '.....kHk........',
  '....kHk.........',
  '...kkkkkkk......',
  '..kBBBBBBBk.....',
  '..kBBBBBBBk.....',
]);

// Prayer flag string segments — 2 flutter frames (drawn as decor)
function defFlags(name, lift) {
  const colors = ['#3a6ee8', '#f8f8f8', '#e83a3a', '#3aa83a', '#f8d030'];
  defPaintedTile(name, 80, 12, (g) => {
    g.strokeStyle = '#d8d0b8';
    g.beginPath();
    g.moveTo(0, 2); g.quadraticCurveTo(40, 5, 80, 2);
    g.stroke();
    for (let i = 0; i < 5; i++) {
      const fx = 6 + i * 16;
      const fy = 3 + (i % 2 === lift ? 0 : 1);
      g.fillStyle = colors[i];
      g.beginPath();
      g.moveTo(fx, fy); g.lineTo(fx + 9, fy); g.lineTo(fx + 8, fy + 7); g.lineTo(fx + 1, fy + 7);
      g.fill();
    }
  });
}
defFlags('flags1', 0);
defFlags('flags2', 1);

// Decorative bush / rhododendron
defPaintedTile('bush', 32, 16, (g) => {
  g.fillStyle = '#2c7a34';
  g.beginPath(); g.arc(8, 12, 7, 0, 7); g.fill();
  g.beginPath(); g.arc(17, 10, 8, 0, 7); g.fill();
  g.beginPath(); g.arc(25, 12, 6, 0, 7); g.fill();
  g.fillStyle = '#3f9c46';
  g.beginPath(); g.arc(8, 10, 5, 0, 7); g.fill();
  g.beginPath(); g.arc(17, 8, 6, 0, 7); g.fill();
  g.fillStyle = '#e84a6a';
  g.fillRect(6, 8, 2, 2); g.fillRect(15, 5, 2, 2); g.fillRect(22, 9, 2, 2); g.fillRect(11, 11, 2, 2);
});

// Grass tuft
defPaintedTile('tuft', 16, 6, (g) => {
  g.fillStyle = '#6cc054';
  g.fillRect(2, 2, 1, 4); g.fillRect(4, 0, 1, 6); g.fillRect(6, 3, 1, 3);
  g.fillRect(9, 1, 1, 5); g.fillRect(11, 3, 1, 3); g.fillRect(13, 2, 1, 4);
});

// Mani stone (decor)
defPaintedTile('mani', 24, 14, (g) => {
  g.fillStyle = '#8a8a96';
  g.beginPath(); g.ellipse(12, 10, 11, 6, 0, 0, 7); g.fill();
  g.fillStyle = '#a8a8b4';
  g.beginPath(); g.ellipse(12, 8, 9, 5, 0, 0, 7); g.fill();
  g.fillStyle = '#5e5e6a';
  g.fillRect(6, 6, 3, 1); g.fillRect(11, 5, 3, 1); g.fillRect(15, 7, 3, 1); g.fillRect(8, 9, 3, 1); g.fillRect(13, 10, 3, 1);
});

// Butter lamp / torch — 2 frames (fortress decor)
function defLamp(name, f) {
  defSprite(name, { k: '#1a1418', B: '#c09020', F: '#ffd040', f: '#ff8830', W: '#fff8d0' }, f === 0 ? [
    '....W...',
    '...FFf..',
    '...FFF..',
    '..fFFf..',
    '..kBBk..',
    '.kBBBBk.',
    '..kBBk..',
  ] : [
    '...W....',
    '..fFF...',
    '..FFF...',
    '..fFFf..',
    '..kBBk..',
    '.kBBBBk.',
    '..kBBk..',
  ]);
}
defLamp('lamp1', 0);
defLamp('lamp2', 1);

// Flame chain flame — 2 frames
function defFlame(name, f) {
  defSprite(name, { F: '#ffd040', f: '#ff8830', r: '#e84818' }, f === 0 ? [
    '..Ff..',
    '.FFfr.',
    'fFFFfr',
    'fFFFf.',
    '.fFf..',
    '..f...',
  ] : [
    '..fF..',
    '.rfFF.',
    'rfFFFf',
    '.fFFFf',
    '..fFf.',
    '...f..',
  ]);
}
defFlame('flame1', 0);
defFlame('flame2', 1);

// Stone slab crusher (24x24)
defPaintedTile('slab', 24, 24, (g) => {
  g.fillStyle = '#8a8496'; g.fillRect(0, 0, 24, 24);
  g.fillStyle = '#aaa4b6'; g.fillRect(0, 0, 24, 2); g.fillRect(0, 0, 2, 24);
  g.fillStyle = '#544e62'; g.fillRect(0, 22, 24, 2); g.fillRect(22, 0, 2, 24);
  // angry carved face
  g.fillStyle = '#3a3444';
  g.fillRect(5, 7, 4, 3); g.fillRect(15, 7, 4, 3);     // eyes
  g.fillRect(4, 5, 5, 2); g.fillRect(15, 5, 5, 2);     // brows
  g.fillRect(7, 15, 10, 3);                            // mouth
  g.fillStyle = '#e8e4f0'; g.fillRect(8, 16, 2, 2); g.fillRect(13, 16, 2, 2); // teeth
});

// Moving platform (48x8 wooden lift)
defPaintedTile('lift', 48, 8, (g) => {
  g.fillStyle = '#a8743c'; g.fillRect(0, 0, 48, 6);
  g.fillStyle = '#d09858'; g.fillRect(0, 0, 48, 2);
  g.fillStyle = '#7a5226'; g.fillRect(0, 6, 48, 1);
  g.fillStyle = '#7a5226';
  for (let i = 0; i < 4; i++) g.fillRect(5 + i * 12, 2, 1, 4);
});
