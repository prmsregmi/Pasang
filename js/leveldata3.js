'use strict';
// ---------------------------------------------------------------------------
// Level data — World 3: The High Passes. Original layouts.
// ---------------------------------------------------------------------------

// ============================== 3-1 SNOWFIELD CROSSING =====================
function build_3_1() {
  const b = new LB(210);
  b.ground(0, 42);
  b.set(3, 11, 'P');
  b.set(10, 12, 'y');
  b.set(14, 9, '?');
  // ice patches
  b.hline(18, 24, 12, 'I');
  b.rect(18, 13, 24, 14, '#');
  b.set(21, 9, 'M');
  b.set(28, 12, 'Z');
  b.put(33, 9, 'B?B');
  b.set(38, 12, 'y');
  // frozen river
  b.hline(43, 50, 11, 'b');
  b.hline(43, 50, 14, '~');
  b.set(46, 7, 'G');
  b.coins(44, 49, 8);
  b.ground(51, 76);
  b.hline(54, 60, 12, 'I');
  b.rect(54, 13, 60, 14, '#');
  b.set(57, 12, 'i');
  b.set(63, 12, 'Z');
  b.put(67, 9, '*B?');
  b.set(73, 10, 'n');
  // ice shelf climb
  b.rect(77, 10, 84, 14, '#');
  b.hline(77, 84, 9, 'I');
  b.coins(78, 83, 6);
  b.set(81, 5, 'C');
  b.stairsDown(85, 3, 11);
  b.ground(88, 108);
  b.set(91, 12, '!');
  b.set(95, 12, 'y');
  b.set(99, 12, 'Z');
  b.set(104, 9, 'h');
  // long frozen bridge with breaks
  b.hline(109, 114, 11, 'b');
  b.hline(117, 119, 11, 'f');
  b.hline(122, 127, 11, 'b');
  b.hline(109, 132, 14, '~');
  b.set(115, 7, 'G');
  b.coins(115, 121, 8);
  b.hline(128, 132, 11, 'b');
  b.ground(133, 158);
  b.set(136, 12, 'i');
  b.put(140, 9, '?BM');
  b.set(146, 12, 'Z');
  b.hline(149, 155, 12, 'I');
  b.rect(149, 13, 155, 14, '#');
  b.set(152, 12, 's');
  b.coins(149, 156, 3);
  // wind gap
  b.hline(159, 162, 10, '-');
  b.hline(164, 167, 8, '-');
  b.coins(164, 167, 5);
  b.ground(168, 209);
  b.set(172, 12, 'y');
  b.set(176, 12, 'i');
  b.stairsUp(180, 6, 12);
  b.coins(188, 191, 8);
  b.set(196, 12, '&');
  return b.rows();
}

// ============================== 3-2 ICE GROTTO =============================
function build_3_2() {
  const b = new LB(150);
  b.hline(0, 149, 0, '#');
  b.ground(0, 149, 13);
  b.vline(0, 1, 12, '#');
  b.set(3, 11, 'P');
  b.hline(7, 12, 12, 'I');
  b.coins(7, 12, 10);
  b.set(15, 12, 'i');
  // ice pillars
  b.rect(19, 10, 20, 12, 'I');
  b.rect(24, 8, 25, 12, 'I');
  b.coins(22, 23, 6);
  b.set(28, 12, 'p');
  b.put(31, 8, 'B?BMB');
  b.set(38, 12, 'i');
  // spike crawl
  b.hline(42, 46, 12, '^');
  b.hline(41, 47, 9, '-');
  b.coins(41, 47, 6);
  b.set(50, 12, 'k');
  b.set(54, 11, 'e');     // frozen treasure vault
  b.set(57, 12, 'x');
  b.set(60, 9, '*');
  // crevasse
  b.rect(64, 13, 69, 14, '.');
  b.hline(64, 66, 10, '-');
  b.hline(67, 69, 8, '-');
  b.coins(64, 69, 5);
  b.set(72, 12, 'i');
  b.set(76, 12, 'p');
  b.set(80, 8, 'H');
  b.hline(83, 88, 12, 'I');
  b.set(85, 12, 'Z');
  b.set(92, 12, '!');
  // icicle gallery (low ceiling)
  b.rect(96, 1, 104, 8, '#');
  b.hline(97, 103, 12, 'I');
  b.coins(97, 103, 11);
  b.set(107, 12, 'i');
  b.set(111, 12, 'i');
  b.put(115, 8, '?B?');
  b.set(121, 12, 'k');
  b.coins(125, 128, 10);
  // exit shelf
  b.rect(131, 10, 149, 12, '#');
  b.set(136, 8, 'e');     // way out
  return b.rows();
}

function build_3_2_vault() {
  const b = new LB(32);
  b.hline(0, 31, 0, '#');
  b.ground(0, 31, 13);
  b.vline(0, 1, 12, '#');
  b.set(2, 11, 'P');
  b.coins(5, 26, 11);
  b.coins(7, 24, 9);
  b.rect(12, 10, 14, 12, 'I');
  b.coins(11, 15, 7);
  b.set(18, 5, 'L');
  b.set(21, 9, '*');
  b.set(27, 11, 'X');
  return b.rows();
}

function build_3_2_exit() {
  const b = new LB(36);
  b.ground(0, 35);
  b.set(2, 11, 'P');
  b.hline(8, 14, 12, 'I');
  b.rect(8, 13, 14, 14, '#');
  b.coins(9, 13, 9);
  b.stairsUp(17, 4, 12);
  b.set(28, 12, '&');
  return b.rows();
}

// ============================== 3-3 THE RAZOR RIDGE ========================
function build_3_3() {
  const b = new LB(200);
  b.ground(0, 15);
  b.set(3, 11, 'P');
  b.set(10, 12, 'Z');
  // ridge spires
  b.rect(16, 11, 18, 14, '#');
  b.rect(21, 9, 23, 14, '#');
  b.rect(26, 11, 28, 14, '#');
  b.coins(16, 28, 6);
  b.set(24, 4, 'G');
  // crumble ledge run
  b.hline(31, 33, 10, 'f');
  b.hline(35, 37, 10, 'b');
  b.hline(39, 41, 10, 'f');
  b.hline(31, 44, 14, '~');
  b.coins(35, 41, 7);
  b.rect(45, 9, 54, 14, '#');
  b.hline(45, 54, 8, 'I');
  b.set(48, 7, 'i');
  b.set(52, 4, 'M');
  // wind gusts gap (lifts)
  b.hline(55, 68, 14, '~');
  b.set(58, 9, 'V');
  b.set(64, 7, 'm');
  b.coins(57, 66, 4);
  b.rect(69, 10, 80, 14, '#');
  b.set(72, 9, 'Z');
  b.set(76, 6, '?');
  b.set(79, 9, 'i');
  // long razor bridge
  b.hline(81, 86, 9, 'b');
  b.hline(89, 91, 9, 'f');
  b.hline(94, 99, 9, 'b');
  b.hline(81, 102, 14, '~');
  b.set(87, 5, 'G');
  b.set(97, 5, 'G');
  b.coins(89, 94, 6);
  b.hline(100, 102, 9, 'b');
  b.ground(103, 122);
  b.set(106, 12, '!');
  b.set(110, 12, 'Z');
  b.put(114, 9, 'B*B');
  b.set(119, 12, 'i');
  // spire descent
  b.rect(123, 9, 125, 14, '#');
  b.rect(128, 11, 130, 14, '#');
  b.rect(133, 13, 135, 14, '#');
  b.coins(123, 135, 6);
  b.set(131, 4, 'G');
  b.ground(136, 158);
  b.hline(139, 145, 12, 'I');
  b.rect(139, 13, 145, 14, '#');
  b.set(142, 12, 'i');
  b.set(148, 12, 'Z');
  b.set(153, 9, 'h');
  // last crossing
  b.hline(159, 165, 10, 'b');
  b.hline(167, 169, 10, 'f');
  b.hline(159, 172, 14, '~');
  b.coins(161, 168, 7);
  b.ground(173, 199);
  b.stairsUp(176, 6, 12);
  b.set(192, 12, '&');
  return b.rows();
}

// ============================== 3-4 THE YETI'S LAIR ========================
function build_3_4() {
  const b = new LB(170);
  b.hline(0, 130, 0, '=');
  b.ground(0, 100, 13, '=');
  b.set(3, 11, 'P');
  b.set(12, 8, 'g');
  b.set(18, 2, 'T');
  b.set(24, 9, 'i');
  b.hline(28, 30, 12, '^');
  b.hline(27, 31, 9, '-');
  b.coins(27, 31, 6);
  b.put(35, 9, 'B?BMB');
  b.set(42, 12, 'Z');
  b.set(50, 9, 'g');
  b.set(56, 2, 'T');
  b.set(60, 2, 'T');
  b.coins(57, 59, 11);
  b.set(66, 12, 'i');
  b.set(70, 12, '!');
  b.hline(74, 76, 12, '^');
  b.hline(73, 77, 9, '-');
  b.set(82, 8, 'g');
  b.set(86, 12, 'Z');
  b.set(91, 5, 'M');
  // up to the bridge over the chasm
  b.rect(94, 10, 100, 14, '=');
  // THE BRIDGE — the yeti waits at its center
  b.hline(101, 140, 10, 'b');
  b.hline(101, 148, 14, '~');
  b.set(124, 9, '3');            // THE YETI
  // the lever platform behind him
  b.rect(141, 11, 152, 14, '=');
  b.set(146, 10, 'v');           // bridge release lever
  // Maya waits beyond
  b.rect(153, 11, 169, 14, '=');
  b.set(162, 10, 'Y');
  return b.rows();
}

LEVELS.push(
  {
    world: 3, stage: 1, name: 'Snowfield Crossing', theme: 'snow', music: 'snow',
    time: 300, rows: build_3_1(),
  },
  {
    world: 3, stage: 2, name: 'Ice Grotto', theme: 'cave', music: 'cave',
    time: 300, rows: build_3_2(),
    subareas: [
      { theme: 'cave', music: 'cave', rows: build_3_2_vault() },
      { theme: 'snow', music: 'snow', rows: build_3_2_exit() },
    ],
  },
  {
    world: 3, stage: 3, name: 'The Razor Ridge', theme: 'snow', music: 'snow',
    time: 250, rows: build_3_3(),
  },
  {
    world: 3, stage: 4, name: "The Yeti's Lair", theme: 'fortress', music: 'fortress',
    time: 300, rows: build_3_4(),
  },
);
