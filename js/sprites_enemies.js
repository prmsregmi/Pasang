'use strict';
// ---------------------------------------------------------------------------
// Enemy, boss & NPC sprites — original designs. Default art faces LEFT
// (enemies usually approach the player from the right).
// ---------------------------------------------------------------------------

// ----- Yak — shaggy walker (20x15), 2 walk frames + squashed -----
const PAL_YAK = {
  k: '#171217', B: '#5a3e28', b: '#42301e', s: '#7a563a',
  H: '#d8cab0', E: '#ffffff', h: '#2e2218',
};
defSprite('yak1', PAL_YAK, [
  '..hh............',
  '.hkh.kkkkkkkk...',
  'hh.kBBBBBBBBkk..',
  '.kBBbBBBBBBBBBk.',
  'kBEkBBBbBBBbBBk.',
  'kBBBBBBBBBBBBBBk',
  'kbBBbBBBBbBBBbBk',
  '.kBBBBBBBBBBBBk.',
  '.kbsbsBBbsbsBbk.',
  '..ksbskBksbskk..',
  '..kbbk..kbbk....',
  '..khhk..khhk....',
]);
defSprite('yak2', PAL_YAK, [
  '..hh............',
  '.hkh.kkkkkkkk...',
  'hh.kBBBBBBBBkk..',
  '.kBBbBBBBBBBBBk.',
  'kBEkBBBbBBBbBBk.',
  'kBBBBBBBBBBBBBBk',
  'kbBBbBBBBbBBBbBk',
  '.kBBBBBBBBBBBBk.',
  '.kbsbsBBbsbsBbk.',
  '..kbsbkBkbsbkk..',
  '...kbbk.kbbk....',
  '...khhkkhhk.....',
]);
defSprite('yak_squash', PAL_YAK, [
  '..hh........... ',
  '.hkh.kkkkkkkk...',
  'hhkBBBBBBBBBBkk.',
  'kBEkBbBBbBBbBBBk',
  'kkbbkbbkbbkbbkk.',
]);

// ----- Pika — small fast scurrier (12x10) -----
const PAL_PIKA = { k: '#171217', F: '#c89058', f: '#a06e3c', E: '#1a1418', W: '#e8d8c0' };
defSprite('pika1', PAL_PIKA, [
  '..kk....kk..',
  '.kFFk..kFFk.',
  '.kFFFkkFFFk.',
  'kFEFFFFFFFk.',
  'kFFFFFFFFFFk',
  'kWWFFFfFFFfk',
  '.kWFFFFFfk..',
  '..kfk..kfk..',
]);
defSprite('pika2', PAL_PIKA, [
  '..kk....kk..',
  '.kFFk..kFFk.',
  '.kFFFkkFFFk.',
  'kFEFFFFFFFk.',
  'kFFFFFFFFFFk',
  'kWWFFFfFFFfk',
  '.kWFFFFFfk..',
  '.kfk....kfk.',
]);

// ----- Langur monkey — walker that curls into a ball (16x18 / ball 14x12) -----
const PAL_LANGUR = { k: '#171217', G: '#b8b8c4', g: '#8a8a98', F: '#3a3440', S: '#e8d0b8' };
defSprite('langur1', PAL_LANGUR, [
  '...kkk.....k....',
  '..kGGGk...kGk...',
  '.kGFFFGk..kGk...',
  '.kFSSFGk..kGk...',
  '.kFSSFGk.kGk....',
  '.kGFFGGkkGGk....',
  '..kGGGGGGGk.....',
  '..kGGGGGGk......',
  '.kGGFFFFGGk.....',
  '.kGFFFFFFGk.....',
  '.kGFFFFFFGk.....',
  '..kFFFFFFk......',
  '..kGFFFFGk......',
  '..kGGkkGGk......',
  '..kGk..kGk......',
  '.kGGk..kGGk.....',
]);
defSprite('langur2', PAL_LANGUR, [
  '...kkk......k...',
  '..kGGGk....kGk..',
  '.kGFFFGk...kGk..',
  '.kFSSFGk..kGk...',
  '.kFSSFGk..kGk...',
  '.kGFFGGk.kGk....',
  '..kGGGGGkGk.....',
  '..kGGGGGGk......',
  '.kGGFFFFGGk.....',
  '.kGFFFFFFGk.....',
  '.kGFFFFFFGk.....',
  '..kFFFFFFk......',
  '..kGFFFFGk......',
  '...kGkkGk.......',
  '..kGk...kGk.....',
  '..kGGk..kGGk....',
]);
defSprite('langur_ball1', PAL_LANGUR, [
  '...kkkkkk....',
  '..kGGGGGGk...',
  '.kGFFFFFFGk..',
  'kGFFGGGGFFGk.',
  'kGFGFFFFGFGk.',
  'kGFGFFFFGFGk.',
  'kGFFGGGGFFGk.',
  '.kGFFFFFFGk..',
  '..kGGGGGGk...',
  '...kkkkkk....',
]);
defSprite('langur_ball2', PAL_LANGUR, [
  '...kkkkkk....',
  '..kGGGGGGk...',
  '.kGFFFFFFGk..',
  'kGFFGGGFFFGk.',
  'kGFGFFGGFFGk.',
  'kGFFGGFFGFGk.',
  'kGFFFGGGFFGk.',
  '.kGFFFFFFGk..',
  '..kGGGGGGk...',
  '...kkkkkk....',
]);

// ----- Gorak — Himalayan crow, flying (16x12), 2 wing frames + grounded -----
const PAL_GORAK = { k: '#171217', B: '#2e2e3c', b: '#1e1e2a', W: '#4a4a60', Y: '#e8a830', E: '#e8e8f0' };
defSprite('gorak1', PAL_GORAK, [
  '......kk........',
  '..kkkWWWk.......',
  '.kWWWWWWWk......',
  'kWWWWWWWWWk.....',
  '.kkkBBBBBBkk....',
  '..kBEkBBBBBBk...',
  'YYkBBBBBBBBBk...',
  '..kBBBBBBBBk....',
  '...kkBBBBkk.....',
  '.....kkkk.......',
]);
defSprite('gorak2', PAL_GORAK, [
  '................',
  '................',
  '..kkk...........',
  '.kBBBkkkk.......',
  'kBEkBBBBBkk.....',
  'YYkBBBBBBBBk....',
  '..kBBBBBBBBBk...',
  '...kBBBBBBBk....',
  '....kWWWWWWWk...',
  '.....kWWWWWWWk..',
  '......kkkkkkk...',
]);
defSprite('gorak_walk', PAL_GORAK, [
  '....kkk.........',
  '...kBBBk........',
  '..kBEkBBk.......',
  '.YYkBBBBk.......',
  '...kBBBBBkk.....',
  '...kBBBBBBBk....',
  '...kBBWWBBBk....',
  '....kBBBBBk.....',
  '.....kYk.kYk....',
]);

// ----- Snapper — thorny rhododendron in wells (16x22), 2 frames -----
const PAL_SNAP = { k: '#171217', G: '#2c7a34', g: '#1e5a24', P: '#e84a6a', p: '#b02848', W: '#fff0d0' };
defSprite('snapper1', PAL_SNAP, [
  '....kPPPPk......',
  '...kPpPPpPk.....',
  '..kPPPPPPPPk....',
  '..kPWkPPkWPk....',
  '..kPPPPPPPPk....',
  '..kpPPppPPpk....',
  '...kPPPPPPk.....',
  '....kpPPpk......',
  '..G..kGGk..G....',
  '.kGk.kGGk.kGk...',
  '..kGkkGGkkGk....',
  '...kGGGGGGk.....',
  '....kGGGGk......',
  '....kGGGGk......',
  '....kGGGGk......',
  '....kGGGGk......',
]);
defSprite('snapper2', PAL_SNAP, [
  '....kPPPPk......',
  '...kPPPPPPk.....',
  '..kPPpPPpPPk....',
  '..kPPPPPPPPk....',
  '..kPkWPPWkPk....',
  '..kpPPPPPPpk....',
  '...kPpPPpPk.....',
  '....kPPPPk......',
  '..G..kGGk..G....',
  '.kGk.kGGk.kGk...',
  '..kGkkGGkkGk....',
  '...kGGGGGGk.....',
  '....kGGGGk......',
  '....kGGGGk......',
  '....kGGGGk......',
  '....kGGGGk......',
]);

// ----- Snow leopard — pouncing chaser (24x14), 2 run frames + pounce -----
const PAL_LEOP = { k: '#171217', F: '#d8d4cc', f: '#aaa69c', s: '#6a665e', E: '#3a8a3a', W: '#f4f2ec' };
defSprite('leopard1', PAL_LEOP, [
  '.kk.....................',
  'kFFk..kkkkkkkkk....kk...',
  'kFFkkFFFFFFFFFFkkkFFk...',
  '.kFFFsFFsFFsFFsFFFFFk...',
  'kFEFFFFFFFFFFFFFsFFFk...',
  'kFFFFsFFsFFFsFFFFFFk....',
  'kWWFFFFFFFFFFFsFFFk.....',
  '.kWWFsFFFsFFFFFFFk......',
  '..kFFFFFFFFFFFFFk.......',
  '..kFFsk...ksFFk.........',
  '..kFFk.....kFFk.........',
  '..kkk......kkk..........',
]);
defSprite('leopard2', PAL_LEOP, [
  '.kk.....................',
  'kFFk..kkkkkkkkk....kk...',
  'kFFkkFFFFFFFFFFkkkFFk...',
  '.kFFFsFFsFFsFFsFFFFFk...',
  'kFEFFFFFFFFFFFFFsFFFk...',
  'kFFFFsFFsFFFsFFFFFFk....',
  'kWWFFFFFFFFFFFsFFFk.....',
  '.kWWFsFFFsFFFFFFFk......',
  '..kFFFFFFFFFFFFFk.......',
  '...kFsFk..kFsFk.........',
  '....kFFk..kFFk..........',
  '.....kkk..kkk...........',
]);
defSprite('leopard_pounce', PAL_LEOP, [
  '.kk............kk.......',
  'kFFk..kkkkkkkkkFFk......',
  'kFFkkFFFFFFFFFFFk.......',
  '.kFFFsFFsFFsFFsFk.......',
  'kFEFFFFFFFFFFFFFk.......',
  'kFFFFsFFsFFFsFFk........',
  'kWWFFFFFFFFFFFkk........',
  '.kWWFsFFFsFFFFFFk.......',
  '.kFFkFFFFFFFkFFk........',
  'kFFk..kFFk....kFFk......',
  'kk.....kk......kk.......',
]);

// ----- Ice spirit — spiky frost wisp, no stomping (14x14), 2 frames -----
const PAL_ICE = { k: '#3a6a98', I: '#cfe8f8', i: '#9cc8e8', W: '#ffffff', E: '#2a4a78' };
defSprite('icespirit1', PAL_ICE, [
  '......W.......',
  '..W..kIk..W...',
  '...kkIIIkk....',
  '..kIIiIiIIk...',
  'W.kIiIIIiIk.W.',
  '.kIIIEIEIIIk..',
  '.kIiIIIIIiIk..',
  '.kIIIE.EIIIk..',
  '..kIiIIIiIk...',
  '...kkIIIkk....',
  '..W..kIk..W...',
  '......W.......',
]);
defSprite('icespirit2', PAL_ICE, [
  '......W.......',
  '.W...kIk...W..',
  '...kkIIIkk....',
  '..kIiIIIiIk...',
  '.kIIIiIiIIIk..',
  'WkIIEIIIEIIkW.',
  '.kIiIIIIIiIk..',
  '.kIIE...EIIk..',
  '..kIIiIiIIk...',
  '...kkIIIkk....',
  '.W...kIk...W..',
  '......W.......',
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
