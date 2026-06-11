'use strict';
// ---------------------------------------------------------------------------
// Level data — World 1: The Foothills. All level layouts are original.
// LevelBuilder paints a 15-row char grid; see tiles.js + level.js for chars.
// ---------------------------------------------------------------------------

const LEVELS = [];

class LB {
  constructor(w, h = 15) {
    this.w = w; this.h = h;
    this.g = Array.from({ length: h }, () => Array(w).fill('.'));
  }
  set(x, y, ch) {
    if (x >= 0 && x < this.w && y >= 0 && y < this.h) this.g[y][x] = ch;
  }
  put(x, y, str) { for (let i = 0; i < str.length; i++) if (str[i] !== ' ') this.set(x + i, y, str[i]); }
  hline(x0, x1, y, ch) { for (let x = x0; x <= x1; x++) this.set(x, y, ch); }
  vline(x, y0, y1, ch) { for (let y = y0; y <= y1; y++) this.set(x, y, ch); }
  rect(x0, y0, x1, y1, ch) { for (let y = y0; y <= y1; y++) this.hline(x0, x1, y, ch); }
  ground(x0, x1, top = 13, ch = '#') { this.rect(x0, top, x1, this.h - 1, ch); }
  stairsUp(x0, n, baseTop = 12, ch = '#') {
    for (let i = 0; i < n; i++) this.vline(x0 + i, baseTop - i, this.h - 1, ch);
  }
  stairsDown(x0, n, fromTop, ch = '#') {
    for (let i = 0; i < n; i++) this.vline(x0 + i, fromTop + i, this.h - 1, ch);
  }
  coins(x0, x1, y) { this.hline(x0, x1, y, 'o'); }
  rows() { return this.g.map(r => r.join('')); }
}

// ============================== 1-1 TERRACE TRAIL ==========================
function build_1_1() {
  const b = new LB(210);
  b.ground(0, 52);
  b.set(3, 11, 'P');
  b.set(10, 9, '?');
  b.set(14, 12, 'y');
  b.put(16, 9, 'MB?B?');
  b.set(18, 5, '?');
  b.set(23, 11, 'w');
  b.set(27, 12, 'y');
  // first gap
  b.ground(55, 82);
  b.coins(33, 35, 8);
  b.set(40, 12, 'k');
  b.set(44, 11, 'e');     // bonus coin cave
  b.set(47, 12, 'x');     // return marker
  b.set(50, 12, 'p');
  // second island
  b.put(58, 9, 'B*B');
  b.set(63, 12, 'y');
  b.set(66, 12, 'y');
  b.stairsUp(68, 3, 12);
  b.rect(71, 10, 73, 14, '#');
  b.set(72, 6, 'C');      // chiya on the plateau
  b.stairsDown(74, 3, 11);
  b.ground(77, 80);
  b.set(79, 12, '!');     // checkpoint before the river
  // river with a suspension bridge
  b.hline(81, 86, 13, 'b');
  b.hline(81, 86, 14, '~');
  b.ground(87, 110);
  b.set(90, 7, 'G');
  b.coins(92, 95, 9);
  b.put(96, 9, 'BBLBB');
  b.set(103, 12, 'y');
  b.set(106, 12, 'k');
  // floating platforms over a pit
  b.hline(111, 113, 10, '-');
  b.coins(111, 113, 7);
  b.ground(114, 140);
  b.set(118, 10, 'n');    // snapper well
  b.put(124, 9, '?B?B');
  b.set(130, 12, 'p');
  b.set(133, 12, 'y');
  b.set(136, 12, 's');    // springboard to sky coins
  b.coins(133, 139, 3);
  // pit then home stretch
  b.ground(144, 209);
  b.set(148, 12, 'y');
  b.coins(166, 169, 8);
  b.set(162, 12, 'k');
  b.set(172, 9, 'h');     // hidden coin block
  b.stairsUp(176, 8, 12);
  b.set(196, 12, '&');    // the bell
  return b.rows();
}

function build_1_1_cave() {
  const b = new LB(44);
  b.hline(0, 43, 0, '#');
  b.ground(0, 43, 13);
  b.vline(0, 1, 12, '#');
  b.set(3, 2, 'P');
  b.coins(6, 12, 11);
  b.coins(8, 10, 8);
  b.rect(14, 10, 16, 12, '#');
  b.coins(14, 16, 7);
  b.set(19, 9, '*');
  b.coins(22, 28, 11);
  b.rect(24, 10, 26, 12, '#');
  b.coins(24, 26, 7);
  b.set(35, 11, 'X');     // exit well back to the trail
  return b.rows();
}

// ============================== 1-2 THE OLD WELL CAVES =====================
function build_1_2() {
  const b = new LB(140);
  b.hline(0, 139, 0, '#');
  b.ground(0, 139, 13);
  b.vline(0, 1, 12, '#');
  b.set(3, 11, 'P');
  // brick shelf near the start
  b.hline(8, 14, 4, 'B');
  b.coins(8, 14, 11);
  b.set(15, 12, 'p');
  // pillars
  b.rect(20, 10, 21, 12, '#');
  b.coins(23, 25, 9);
  b.rect(27, 8, 28, 12, '#');
  b.set(31, 12, 'k');
  b.put(34, 8, 'B?BMB');
  // spike alley with a high road
  b.hline(40, 44, 9, '-');
  b.hline(40, 44, 12, '^');
  b.coins(40, 44, 6);
  b.set(47, 12, 'p');
  b.set(50, 11, 'e');     // bonus room
  b.set(53, 12, 'x');
  b.set(56, 9, '*');
  // pit with platforms
  b.rect(60, 13, 64, 14, '.');
  b.hline(60, 62, 10, '-');
  b.hline(63, 65, 8, '-');
  b.coins(60, 65, 5);
  b.set(68, 12, 'k');
  b.put(70, 9, 'BB');
  b.set(72, 9, 'H');      // hidden sel roti
  b.set(74, 12, 'p');
  // stepped pillars
  b.rect(78, 11, 79, 12, '#');
  b.rect(82, 9, 83, 12, '#');
  b.rect(86, 11, 87, 12, '#');
  b.coins(78, 87, 6);
  b.set(90, 12, 'k');
  b.set(93, 12, 'p');
  b.set(96, 12, 'y');
  b.put(100, 8, '?B?');
  b.set(106, 12, '!');
  // low ceiling crawl
  b.rect(110, 1, 118, 9, '#');
  b.coins(111, 117, 11);
  b.set(121, 12, 'p');
  b.coins(124, 127, 10);
  // exit plateau with the way out
  b.rect(128, 10, 139, 12, '#');
  b.set(132, 8, 'e');     // exit well to the surface
  return b.rows();
}

function build_1_2_bonus() {
  const b = new LB(30);
  b.hline(0, 29, 0, '#');
  b.ground(0, 29, 13);
  b.vline(0, 1, 12, '#');
  b.set(2, 11, 'P');
  b.coins(5, 24, 11);
  b.coins(7, 22, 9);
  b.coins(9, 20, 7);
  b.set(14, 4, 'L');
  b.set(25, 11, 'X');
  return b.rows();
}

function build_1_2_exit() {
  const b = new LB(36);
  b.ground(0, 35);
  b.set(2, 11, 'P');
  b.coins(8, 11, 9);
  b.stairsUp(14, 4, 12);
  b.set(26, 12, '&');
  return b.rows();
}

// ============================== 1-3 SUSPENSION HEIGHTS =====================
function build_1_3() {
  const b = new LB(200);
  b.ground(0, 21);
  b.set(3, 11, 'P');
  b.set(12, 12, 'y');
  b.set(16, 9, '?');
  // climb to the cliffs
  b.stairsUp(22, 4, 12);
  b.rect(26, 9, 30, 14, '#');
  // long rope bridge over the river
  b.hline(31, 44, 9, 'b');
  b.hline(31, 44, 14, '~');
  b.set(37, 5, 'G');
  b.coins(34, 41, 6);
  b.rect(45, 9, 52, 14, '#');
  b.coins(46, 50, 6);
  b.set(49, 8, 'p');
  // crumbling crossing
  b.hline(53, 56, 9, 'f');
  b.hline(57, 60, 9, 'b');
  b.hline(53, 60, 14, '~');
  b.rect(61, 9, 70, 14, '#');
  b.set(64, 5, 'M');
  b.set(67, 8, 'k');
  // lift gap
  b.hline(71, 80, 14, '~');
  b.set(74, 10, 'm');
  b.coins(74, 77, 7);
  b.rect(81, 11, 95, 14, '#');
  b.set(85, 10, 'k');
  b.set(89, 10, 'y');
  b.set(92, 9, 'w');
  // the great bridge with missing planks
  b.hline(96, 100, 11, 'b');
  b.hline(103, 104, 11, 'b');
  b.hline(107, 110, 11, 'f');
  b.hline(96, 112, 14, '~');
  b.coins(101, 102, 8);
  b.set(105, 6, 'G');
  b.ground(113, 125);
  b.set(115, 12, '!');
  b.set(119, 12, 's');
  b.coins(116, 122, 3);
  b.set(123, 12, 'p');
  // vertical lift canyon
  b.hline(126, 138, 14, '~');
  b.set(130, 9, 'V');
  b.hline(134, 136, 8, '-');
  b.coins(134, 136, 5);
  b.rect(139, 10, 155, 14, '#');
  b.put(142, 6, 'B?B?B');
  b.set(148, 9, 'y');
  b.set(152, 9, 'y');
  // final bridge
  b.hline(156, 165, 10, 'b');
  b.hline(156, 165, 14, '~');
  b.set(160, 6, 'G');
  b.coins(158, 163, 7);
  b.ground(166, 199);
  b.stairsUp(168, 6, 12);
  b.set(182, 9, 'h');
  b.set(190, 12, '&');
  return b.rows();
}

// ============================== 1-4 BANDIT BOAR'S FORTRESS =================
function build_1_4() {
  const b = new LB(150);
  b.hline(0, 149, 0, '=');
  b.ground(0, 149, 13, '=');
  b.set(3, 11, 'P');
  b.hline(9, 11, 12, '^');
  b.hline(8, 12, 9, '-');
  b.set(16, 9, 'g');
  b.rect(20, 11, 24, 14, '=');
  b.set(22, 8, '?');
  b.set(28, 2, 'T');
  b.set(33, 12, 'k');
  b.hline(38, 40, 12, '^');
  b.hline(37, 41, 9, '-');
  b.coins(37, 41, 6);
  b.set(45, 8, 'g');
  b.rect(50, 10, 51, 12, '=');
  b.set(55, 12, '!');
  b.set(58, 5, 'M');
  b.set(60, 2, 'T');
  b.coins(62, 63, 11);
  b.set(65, 2, 'T');
  b.hline(70, 73, 12, '^');
  b.hline(69, 74, 9, '-');
  b.set(78, 9, 'g');
  b.set(82, 12, 'k');
  b.set(85, 12, 'k');
  b.rect(90, 11, 95, 14, '=');
  b.coins(91, 94, 8);
  // arena
  b.rect(97, 10, 97, 12, '=');   // low wall in
  b.set(115, 12, '1');           // BANDIT BOAR
  b.rect(129, 10, 129, 12, '='); // low wall out
  b.set(138, 11, 'E');           // the village elder
  return b.rows();
}

LEVELS.push(
  {
    world: 1, stage: 1, name: 'Terrace Trail', theme: 'hills', music: 'overworld',
    time: 300, rows: build_1_1(),
    subareas: [{ theme: 'cave', music: 'cave', rows: build_1_1_cave() }],
  },
  {
    world: 1, stage: 2, name: 'The Old Well Caves', theme: 'cave', music: 'cave',
    time: 300, rows: build_1_2(),
    subareas: [
      { theme: 'cave', music: 'cave', rows: build_1_2_bonus() },
      { theme: 'hills', music: 'overworld', rows: build_1_2_exit() },
    ],
  },
  {
    world: 1, stage: 3, name: 'Suspension Heights', theme: 'hills', music: 'overworld',
    time: 250, rows: build_1_3(),
  },
  {
    world: 1, stage: 4, name: "Bandit Boar's Fortress", theme: 'fortress', music: 'fortress',
    time: 250, rows: build_1_4(),
  },
);
