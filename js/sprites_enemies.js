'use strict';
// ---------------------------------------------------------------------------
// Enemy, boss & NPC sprites — original designs. Default art faces LEFT
// (enemies usually approach the player from the right).
// ---------------------------------------------------------------------------

// ----- Yak — shaggy, horned, white-blazed walker (24x15) -----
const PAL_YAK = {
  k: '#171217', B: '#5e4028', b: '#422c18', F: '#332312',
  H: '#ece4d0', W: '#e8e0cc', E: '#1a1418', N: '#8a7a66', T: '#332312',
};
defSprite('yak1', PAL_YAK, [
  '...HHH..................',
  '..HH.HH.....kkkkk.......',
  '..HH.kkkkkkkBBBBBkk.....',
  '...kWWBBBBBBBBBBBBBk....',
  '..kWWWBbBBBBbBBBbBBBk.T.',
  '..kWEWBBBBBBBBBBBBBBkTT.',
  '..kWWWBbBBBBbBBBbBBBBkT.',
  '..kNNBBBBBBBBBBBBBBBBkT.',
  '...kBbBBBBbBBBBbBBBBkT..',
  '...kFbFbFbFbFbFbFbFk....',
  '....kBBk.kBBk.kBBk.kBBk.',
  '....kBbk.kBbk.kBbk.kBbk.',
  '....kkk...kkk..kkk..kkk.',
]);
defSprite('yak2', PAL_YAK, [
  '...HHH..................',
  '..HH.HH.....kkkkk.......',
  '..HH.kkkkkkkBBBBBkk.....',
  '...kWWBBBBBBBBBBBBBk....',
  '..kWWWBbBBBBbBBBbBBBk.T.',
  '..kWEWBBBBBBBBBBBBBBkTT.',
  '..kWWWBbBBBBbBBBbBBBBkT.',
  '..kNNBBBBBBBBBBBBBBBBkT.',
  '...kBbBBBBbBBBBbBBBBkT..',
  '...kFbFbFbFbFbFbFbFk....',
  '.....kBBk.kBBk..kBBk....',
  '....kBbk...kBbk...kBbk..',
  '....kkk.....kkk....kkk..',
]);
defSprite('yak_squash', PAL_YAK, [
  '...HHH..................',
  '..HHkHHkkkkkkkkkkkkk....',
  '..HHkBBBBBBBBBBBBBBBBk..',
  '.kWEWBbBBBBbBBBBbBBBBkTT',
  '.kkNkkbkkbkkbkkbkkbkkk..',
]);

// ----- Pika — round tan rodent with a big ear (12x10) -----
const PAL_PIKA = {
  k: '#171217', F: '#c89058', f: '#a06e3c', d: '#7a5028',
  E: '#1a1418', W: '#ece0d0',
};
defSprite('pika1', PAL_PIKA, [
  '...kk.......',
  '..kFdk.kk...',
  '..kFFkkFFk..',
  '.kFEFFFFFFk.',
  'kFFFFFFFFFFk',
  'kfWFFFFFfFFk',
  'kWWWFFFFFFfk',
  '.kWWFFFFfk..',
  '..kfk.kfk...',
  '............',
]);
defSprite('pika2', PAL_PIKA, [
  '...kk.......',
  '..kFdk.kk...',
  '..kFFkkFFk..',
  '.kFEFFFFFFk.',
  'kFFFFFFFFFFk',
  'kfWFFFFFfFFk',
  'kWWWFFFFFFfk',
  '.kWWFFFFfk..',
  '.kfk...kfk..',
  '............',
]);

// ----- Langur — silver fur, black face, long curled tail (16x17) -----
const PAL_LANGUR = {
  k: '#171217', G: '#d4d4de', g: '#a0a0b0', F: '#26202a',
  E: '#e8e0d0', P: '#5a525e',
};
defSprite('langur1', PAL_LANGUR, [
  '............kk..',
  '...kkkk....kGGk.',
  '..kGGGGk...kGGk.',
  '.kGkFFkGk..kGk..',
  '.kGFEFEFGk.kGk..',
  '.kGFFFFFGk.kGk..',
  '.kGkFPFkGkkGk...',
  '..kGkFkGkkGk....',
  '..kGGGGGGGk.....',
  '.kGGgGGgGGk.....',
  '.kGgGGGGgGk.....',
  '.kGGGGGGGGk.....',
  '..kgGGGGgk......',
  '..kGgGGgGk......',
  '..kGGkkGGk......',
  '.kFFk..kFFk.....',
  '.kkk....kkk.....',
]);
defSprite('langur2', PAL_LANGUR, [
  '...........kk...',
  '...kkkk...kGGk..',
  '..kGGGGk..kGGk..',
  '.kGkFFkGk..kGk..',
  '.kGFEFEFGk.kGk..',
  '.kGFFFFFGk.kGk..',
  '.kGkFPFkGkkGk...',
  '..kGkFkGkkGk....',
  '..kGGGGGGGk.....',
  '.kGGgGGgGGk.....',
  '.kGgGGGGgGk.....',
  '.kGGGGGGGGk.....',
  '..kgGGGGgk......',
  '..kGgGGgGk......',
  '...kGkkGk.......',
  '..kFk..kFk......',
  '..kkk..kkk......',
]);
defSprite('langur_ball1', PAL_LANGUR, [
  '...kkkkkk....',
  '..kGGGGGGk...',
  '.kGGFFFFGGk..',
  'kGFFkEEkFFGk.',
  'kGFEFFFFEFGk.',
  'kGFFFFFFFFGk.',
  'kGGFFkkFFGGk.',
  '.kGGFFFFGGk..',
  '..kGGGGGGk...',
  '...kkkkkk....',
]);
defSprite('langur_ball2', PAL_LANGUR, [
  '...kkkkkk....',
  '..kGGGGGGk...',
  '.kGFFGGFFGk..',
  'kGFkEFFEkFGk.',
  'kGFFEFFEFFGk.',
  'kGFFFFFFFFGk.',
  'kGGFkFFkFGGk.',
  '.kGGFFFFGGk..',
  '..kGGGGGGk...',
  '...kkkkkk....',
]);

// ----- Gorak — glossy black mountain crow (18x13) -----
const PAL_GORAK = {
  k: '#171217', B: '#26262f', b: '#191920', W: '#3e3e52',
  Y: '#e89030', E: '#e8e8f0',
};
defSprite('gorak1', PAL_GORAK, [
  '..kk..........kk..',
  '.kWWk........kWWk.',
  '.kWWWk......kWWWk.',
  '..kWWWk....kWWWk..',
  '...kWWWkkkkWWWk...',
  '....kBBBBBBBBk....',
  '..kkBBEkBBBBBk....',
  '.YYkBBBBBBBBBBk...',
  '..kkBBBBBBBBBBBk..',
  '....kBBBBBBBbbk...',
  '.....kkBBBBkk.....',
  '......kYkYk.......',
  '..................',
]);
defSprite('gorak2', PAL_GORAK, [
  '..................',
  '..................',
  '..................',
  '....kkkkkkkkk.....',
  '....kBBBBBBBk.....',
  '..kkBBEkBBBBBk....',
  '.YYkBBBBBBBBBBk...',
  '..kkBBBBBBBBBBBk..',
  '...kWWWBBBBbbkk...',
  '..kWWWWWkWWWWWk...',
  '.kWWWWk...kWWWWk..',
  '..kkkk.....kkkk...',
  '..................',
]);
defSprite('gorak_walk', PAL_GORAK, [
  '....kkk...........',
  '...kBBBk..........',
  '..kBBEkBk.........',
  '.YYkBBBBkk........',
  '...kBBBBBBkkk.....',
  '...kBBWWWBBBBk....',
  '...kBBBWWWBBbk....',
  '....kBBBBBBbk.....',
  '.....kBBBbbk......',
  '......kYk.kYk.....',
  '..................',
]);

// ----- Snapper — snapping lali gurans (red rhododendron) (16x24) -----
const PAL_SNAP = {
  k: '#171217', P: '#d8304a', p: '#a01830', q: '#7a0f22',
  W: '#fff0d0', G: '#2c7a34', g: '#1e5a24', Y: '#f0c040',
};
defSprite('snapper1', PAL_SNAP, [
  '..kPPk....kPPk..',
  '.kPppPkkkkPppPk.',
  '.kPPPPPPPPPPPPk.',
  '..kPPqqqqqqPPk..',
  '..kPqWkqqkWqPk..',
  '..kPqqqqqqqqPk..',
  '..kPqWqkkqWqPk..',
  '..kPPqqqqqqPPk..',
  '.kPpPPPPPPPPpPk.',
  '..kPPk.Yk.kPPk..',
  '...kk.kGGk..kk..',
  '.kGGk.kGGk.kGGk.',
  '..kGGkkGGkkGGk..',
  '...kGGGGGGGGk...',
  '....kGGGGGGk....',
  '.....kGGGGk.....',
  '.....kGGGGk.....',
  '.....kGGGGk.....',
]);
defSprite('snapper2', PAL_SNAP, [
  '................',
  '..kPPkkkkkkPPk..',
  '.kPppPPPPPPppPk.',
  '.kPPPPPPPPPPPPk.',
  '..kPPPqqqqPPPk..',
  '..kPqWqqqqWqPk..',
  '..kPPPqqqqPPPk..',
  '..kPPPPPPPPPPk..',
  '.kPpPPPPPPPPpPk.',
  '..kPPk.Yk.kPPk..',
  '...kk.kGGk..kk..',
  '.kGGk.kGGk.kGGk.',
  '..kGGkkGGkkGGk..',
  '...kGGGGGGGGk...',
  '....kGGGGGGk....',
  '.....kGGGGk.....',
  '.....kGGGGk.....',
  '.....kGGGGk.....',
]);

// ----- Snow leopard — cream coat, rosettes, long thick tail (26x14) -----
const PAL_LEOP = {
  k: '#171217', F: '#e4ded0', f: '#c2bcae', s: '#4e463e',
  E: '#3a8a3a', W: '#f6f2e8', N: '#8a8278',
};
defSprite('leopard1', PAL_LEOP, [
  '.kk.kk.............kkk....',
  'kFfkFfk...........kNNFk...',
  'kFFFFFFkkkkkkkkk..kFsFFk..',
  '.kFEFFFFFFFFFFFFk.kFFsk...',
  '.kFFsFFsFFFsFFsFFkkFFk....',
  'kWWFFFsFFsFFFFsFFFFFk.....',
  'kWWFsFFFFFFsFFFFsFFk......',
  '.kWFFFFsFFFFFFFFFFk.......',
  '..kFFsFFFsFFsFFsFk........',
  '..kFFFFFFFFFFFFFk.........',
  '..kFFsk.....ksFFk.........',
  '..kFFk.......kFFk.........',
  '..kffk.......kffk.........',
  '..kkk.........kkk.........',
]);
defSprite('leopard2', PAL_LEOP, [
  '.kk.kk.............kkk....',
  'kFfkFfk...........kNNFk...',
  'kFFFFFFkkkkkkkkk..kFsFFk..',
  '.kFEFFFFFFFFFFFFk.kFFsk...',
  '.kFFsFFsFFFsFFsFFkkFFk....',
  'kWWFFFsFFsFFFFsFFFFFk.....',
  'kWWFsFFFFFFsFFFFsFFk......',
  '.kWFFFFsFFFFFFFFFFk.......',
  '..kFFsFFFsFFsFFsFk........',
  '..kFFFFFFFFFFFFFk.........',
  '...kFsFk...kFsFk..........',
  '....kFFk...kFFk...........',
  '....kffk...kffk...........',
  '.....kkk...kkk............',
]);
defSprite('leopard_pounce', PAL_LEOP, [
  '.kk.kk.........kkkk.......',
  'kFfkFfk.......kNNFFk......',
  'kFFFFFFkkkkkkkkFsFk.......',
  '.kFEFFFFFFFFFFFFkk........',
  '.kFFsFFsFFFsFFsFk.........',
  'kWWFFFsFFsFFFFsFk.........',
  'kWWFsFFFFFFsFFFFk.........',
  '.kWFFFFsFFFFFFFFFk........',
  '.kFFkFFFFsFFFFkFFk........',
  'kFFk.kFFk....kFFk.........',
  'kFk...kFk.....kFFk........',
  'kk.....kk......kkk........',
]);

// ----- Ice spirit — living snow crystal with a glowing gaze (14x14) -----
const PAL_ICE = {
  k: '#4a7aa8', I: '#d6ecfa', i: '#9cc8e8', W: '#ffffff', E: '#1c4a86',
};
defSprite('icespirit1', PAL_ICE, [
  '......WW......',
  '..W...kIk..W..',
  '..kW.kIIIkW...',
  '...kkIiIiIkk..',
  '..kIiIIIIIiIk.',
  'WWkIIEkIkEIIkW',
  '..kIiIIIIIiIk.',
  '..kIIkIIIkIIk.',
  '...kkIiIiIkk..',
  '..kW.kIIIk.W..',
  '..W...kIk..W..',
  '......WW......',
]);
defSprite('icespirit2', PAL_ICE, [
  '......WW......',
  '.W....kIk...W.',
  '...Wk.kIIIk...',
  '...kkIiIiIkkW.',
  '..kIiIIIIIiIk.',
  'WWkIIkEIEkIIkW',
  '..kIiIIIIIiIk.',
  '..kIIkkIkkIIk.',
  '.WkkIiIiIkk...',
  '...k.kIIIkW...',
  '.W....kIk...W.',
  '......WW......',
]);

// ===========================================================================
// BOSSES
// ===========================================================================

// ----- Bandit Boar (World 1) — 32x22, 2 charge frames -----
const PAL_BOAR = { k: '#171217', B: '#6a4632', b: '#4e3222', T: '#e8e0d0', E: '#c83030', s: '#8a6248', R: '#a82828' };
defSprite('boar1', PAL_BOAR, [
  '........kkkk..kkkkkkk...........',
  '.......kRRRRkkBBBBBBBkk.........',
  '......kRRRRBBBBBBBBBBBBk........',
  '....kkBBBBBBbBBBBbBBBBBBk.......',
  '...kBBBbBBBBBBBBBBBBbBBBBk......',
  '..kBBEkBBBBbBBBBBBBBBBBBBk......',
  '..kBBBBBBBBBBBBbBBBBbBBBBBk.....',
  'T.kBBBBbBBBBBBBBBBBBBBBBBBk.....',
  'TTkbBBBBBBBBbBBBBBBbBBBBBBk.....',
  '.TkBBbBBBBBBBBBBBBBBBBBBBk......',
  'T.kBBBBBBbBBBBBBbBBBBBBBBk......',
  '..kbBBBBBBBBBBBBBBBBBBBbk.......',
  '...kBBbBBBBbBBBBBbBBBBBk........',
  '...ksBBssBBBBssBBBBssBk.........',
  '....kssk.kssk..kssk.kssk........',
  '....kbbk.kbbk..kbbk.kbbk........',
  '....kkk..kkk....kkk..kkk........',
]);
defSprite('boar2', PAL_BOAR, [
  '........kkkk..kkkkkkk...........',
  '.......kRRRRkkBBBBBBBkk.........',
  '......kRRRRBBBBBBBBBBBBk........',
  '....kkBBBBBBbBBBBbBBBBBBk.......',
  '...kBBBbBBBBBBBBBBBBbBBBBk......',
  '..kBBEkBBBBbBBBBBBBBBBBBBk......',
  '..kBBBBBBBBBBBBbBBBBbBBBBBk.....',
  'T.kBBBBbBBBBBBBBBBBBBBBBBBk.....',
  'TTkbBBBBBBBBbBBBBBBbBBBBBBk.....',
  '.TkBBbBBBBBBBBBBBBBBBBBBBk......',
  'T.kBBBBBBbBBBBBBbBBBBBBBBk......',
  '..kbBBBBBBBBBBBBBBBBBBBbk.......',
  '...kBBbBBBBbBBBBBbBBBBBk........',
  '...ksBBssBBBBssBBBBssBk.........',
  '...kssk...kssk.kssk..kssk.......',
  '..kbbk...kbbk...kbbk..kbbk......',
  '..kkk....kkk.....kkk...kkk......',
]);

// ----- Langur King (World 2) — 26x30, 2 frames -----
const PAL_LKING = { k: '#171217', G: '#c8c8d4', g: '#9a9aa8', F: '#3a3440', S: '#e8d0b8', C: '#e8b83a', R: '#c43a3a' };
defSprite('lking1', PAL_LKING, [
  '.......kCk.kCk.kCk........',
  '.......kCCCCCCCCCk........',
  '........kkkkkkkkk.........',
  '.......kGGGGGGGGGk........',
  '......kGFFFFFFFFGGk.......',
  '......kFFSSFFSSFFGk.......',
  '......kFSSkFFkSSFGk.......',
  '......kFFSSFFSSFFGk.......',
  '......kGFFRRRRFFGGk.......',
  '.......kGFFFFFFGGk........',
  '.......kGGGGGGGGk.........',
  '.....kkGGGGGGGGGGkk.......',
  '....kGGGGFFFFFFGGGGk......',
  '...kGGkGFFFFFFFFGkGGk.....',
  '...kGGkGFFFFFFFFGkGGk.....',
  '...kGGkGFFFFFFFFGkGGk.....',
  '...kSSkGFFFFFFFFGkSSk.....',
  '....kkkGFFFFFFFFGkkk......',
  '.......kFFFFFFFFk.........',
  '.......kGFFFFFFGk..k......',
  '.......kGGkkkkGGk.kGk.....',
  '......kGGk....kGGkGk......',
  '......kGGk....kGGGk.......',
  '.....kGGGk....kGGk........',
  '.....kkkk......kkk........',
]);
defSprite('lking2', PAL_LKING, [
  '.......kCk.kCk.kCk........',
  '.......kCCCCCCCCCk........',
  '........kkkkkkkkk.........',
  '.......kGGGGGGGGGk........',
  '......kGFFFFFFFFGGk.......',
  '......kFFSSFFSSFFGk.......',
  '......kFSkSFFSkSFGk.......',
  '......kFFSSFFSSFFGk.......',
  '......kGFFRRRRFFGGk.......',
  '.......kGFFFFFFGGk........',
  '.......kGGGGGGGGk.........',
  '.....kkGGGGGGGGGGkk..k....',
  '....kGGGGFFFFFFGGGGkkGk...',
  '..kkGGkGFFFFFFFFGkGGGk....',
  '.kSSkGkGFFFFFFFFGkGGk.....',
  '.kkkkGkGFFFFFFFFGkkk......',
  '....kGkGFFFFFFFFGk........',
  '....kkkGFFFFFFFFGk........',
  '.......kFFFFFFFFk.........',
  '.......kGFFFFFFGk.........',
  '.......kGGkkkkGGk.........',
  '......kGGk....kGGk........',
  '.....kGGk......kGGk.......',
  '....kGGGk......kGGGk......',
  '....kkkk........kkkk......',
]);

// ----- YETI (Final boss) — 36x40, walk x2, throw, roar -----
const PAL_YETI = { k: '#171217', W: '#e8ecf2', w: '#b8c2d0', B: '#5a6a86', E: '#c83030', T: '#f4f6fa', N: '#3a4456' };
function yetiBase(arms) {
  // arms: 'down' | 'up' | 'throw'
  const head = [
    '............kkkkkkkkk...............',
    '..........kkWWWWWWWWWkk.............',
    '.........kWWWWWWWWWWWWWk............',
    '........kWWwWWWWWWWWwWWWk...........',
    '........kWWNNWWWWWWNNWWWk...........',
    '........kWNEENWWWWNEENWWk...........',
    '........kWWNNWWWWWWNNWWWk...........',
    '........kWWWWWNNNNWWWWWWk...........',
    '........kWWWWNNNNNNWWWWWk...........',
    '.........kWWNTTNNTTNWWWk............',
    '.........kWWWNNNNNNWWWWk............',
    '..........kWWWWWWWWWWWk.............',
  ];
  const bodyUp = [
    '.kkk....kkWWWWWWWWWWWkk....kkk......',
    'kWWWk..kWWWWWWWWWWWWWWWk..kWWWk.....',
    'kWWWWkkWWWWwWWWWWWwWWWWWkkWWWWk.....',
    'kWWWWkWWWWWWWWWWWWWWWWWWWkWWWWk.....',
    'kWWWkkWWwWWWWWwwWWWWWwWWWkkWWWk.....',
    '.kWWkWWWWWWWWwwwwWWWWWWWWWkWWk......',
    '..kkkWWWWwWWwwwwwwWWwWWWWWkkk.......',
    '....kWWWWWWWwwwwwwWWWWWWWWk.........',
  ];
  const bodyDown = [
    '........kkWWWWWWWWWWWkk.............',
    '......kkWWWWWWWWWWWWWWWkk...........',
    '.....kWWWWWwWWWWWWwWWWWWWk..........',
    '....kWWWWWWWWWWWWWWWWWWWWWk.........',
    '...kWWWkWWwWWWWWwwWWWWwWWWWk........',
    '..kWWWk.WWWWWWWwwwwWWWWWWWWWk.......',
    '..kWWk..WWWWwWwwwwwwWWwWWWWWk.......',
    '..kkk...kWWWWWWwwwwWWWWWWWWk........',
  ];
  const bodyThrow = [
    '........kkWWWWWWWWWWWkk..kkkk.......',
    '......kkWWWWWWWWWWWWWWWkkWWWWk......',
    '.....kWWWWWwWWWWWWwWWWWWWWWWWWk.....',
    '....kWWWWWWWWWWWWWWWWWWWWWWWWk......',
    '...kWWWkWWwWWWWWwwWWWWwWWWkkk.......',
    '..kWWWk.WWWWWWWwwwwWWWWWWWWk........',
    '..kWWk..WWWWwWwwwwwwWWwWWWWk........',
    '..kkk...kWWWWWWwwwwWWWWWWWk.........',
  ];
  const lower = [
    '....kWWWwWWWWWWWWWWWWwWWWk..........',
    '....kWWWWWWWwWWWWwWWWWWWWk..........',
    '.....kWWwWWWWWWWWWWWwWWWk...........',
    '.....kWWWWWWwWWWWwWWWWWWk...........',
    '......kWWWWWWWWWWWWWWWWk............',
    '......kWWWWWkkkkkkWWWWWk............',
    '......kWWWWk......kWWWWk............',
    '.....kWWWWWk......kWWWWWk...........',
    '.....kWWWWk........kWWWWk...........',
    '....kNWWWWk........kWWWWNk..........',
    '....kNNWWNk........kNWWNNk..........',
    '.....kkkkk..........kkkkk...........',
  ];
  const body = arms === 'up' ? bodyUp : arms === 'throw' ? bodyThrow : bodyDown;
  return head.concat(body, lower);
}
defSprite('yeti1', PAL_YETI, yetiBase('down'));
defSprite('yeti2', PAL_YETI, yetiBase('down').map((row, i) =>
  i >= 32 ? row.split('').reverse().join('') : row)); // shuffled legs frame
defSprite('yeti_up', PAL_YETI, yetiBase('up'));
defSprite('yeti_throw', PAL_YETI, yetiBase('throw'));

// ----- Village Elder (NPC at fortress ends) — 16x24 -----
defSprite('elder', {
  k: '#171217', R: '#8a2c2c', r: '#6a1e1e', S: '#d8a878', s: '#b08050', W: '#e8e8e0', C: '#e8b83a',
}, [
  '.....kkkkk......',
  '....kWWWWWk.....',
  '....kWWWWWk.....',
  '.....SSSSS......',
  '....SSkSkSS.....',
  '....SSSSSSS.....',
  '....SsSSSsS.....',
  '.....SSSSS......',
  '....RRRRRRR.....',
  '...RRrRRRrRR....',
  '...RrRRRRRrR....',
  '..SRrRRRRRrRS...',
  '..SRrRCCCRrRS...',
  '...RRRCCCRRR....',
  '...RRRRRRRRR....',
  '...RRRRRRRRR....',
  '...RRRRRRRRR....',
  '...RrRRRRRrR....',
  '...RrRRRRRrR....',
  '...RRRRRRRRR....',
  '..kRRRRRRRRRk...',
  '..kRRRRRRRRRk...',
  '...kkk...kkk....',
]);

// Pasang's little sister Maya (rescued at the very end) — 14x20
defSprite('maya', {
  k: '#171217', H: '#2e2218', S: '#eebf91', D: '#e85c8a', d: '#b83a62', W: '#fff0d0',
}, [
  '....kHHHH.....',
  '...kHHHHHk....',
  '...HHSSSHH....',
  '...HSkSkSH....',
  '...HSSSSSH....',
  '...HsSSSsH....',
  '....SSSS......',
  '...DDDDDD.....',
  '..DDdDDdDD....',
  '..DdDDDDdD....',
  '.SDdDDDDdDS...',
  '.SDDDDDDDDS...',
  '..DDDDDDDD....',
  '..DdDDDDdD....',
  '..DDDDDDDD....',
  '..DDDDDDDD....',
  '...kk..kk.....',
  '...kk..kk.....',
]);
