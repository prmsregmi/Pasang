'use strict';
// ---------------------------------------------------------------------------
// Level data — World 2: Monastery Hills. Original layouts.
// ---------------------------------------------------------------------------

// ============================== 2-1 PRAYER FLAG PASS =======================
function build_2_1() {
  const b = new LB(210);
  b.ground(0, 40);
  b.set(3, 11, 'P');
  b.set(10, 9, '?');
  b.set(13, 12, 'y');
  b.put(17, 9, 'B?BM');
  b.set(22, 12, 'k');
  b.set(27, 10, 'n');
  b.set(33, 12, 'y');
  b.set(36, 12, 'y');
  // rolling rise
  b.stairsUp(41, 3, 12);
  b.rect(44, 10, 56, 14, '#');
  b.set(47, 7, '?');
  b.set(50, 9, 'k');
  b.set(54, 6, 'G');
  b.stairsDown(57, 3, 11);
  b.ground(60, 78);
  b.set(63, 12, 'p');
  b.put(66, 9, '*B*');
  b.set(72, 12, 'y');
  b.set(75, 11, 'e');     // bonus cave
  b.set(70, 12, 'x');
  // gap with lift
  b.set(82, 10, 'm');
  b.coins(80, 86, 7);
  b.ground(88, 112);
  b.set(91, 12, '!');
  b.set(95, 12, 'k');
  b.set(99, 7, 'G');
  b.put(102, 9, '?BC');
  b.set(108, 10, 'n');
  // double gap with bridge and crumble
  b.hline(113, 117, 11, 'b');
  b.hline(118, 120, 11, 'f');
  b.hline(113, 124, 14, '~');
  b.set(121, 7, 'G');
  b.hline(121, 124, 11, 'b');
  b.ground(125, 150);
  b.set(128, 12, 'y');
  b.set(132, 12, 'y');
  b.coins(136, 140, 9);
  b.set(143, 12, 's');
  b.coins(140, 146, 3);
  b.set(147, 12, 'k');
  // high road / low road
  b.hline(152, 162, 8, '-');
  b.coins(152, 162, 5);
  b.ground(151, 168);
  b.set(156, 12, 'k');
  b.set(160, 12, 'p');
  b.set(165, 9, 'h');
  // climb out
  b.ground(169, 209);
  b.stairsUp(172, 6, 12);
  b.set(184, 12, 'y');
  b.coins(187, 190, 8);
  b.set(196, 12, '&');
  return b.rows();
}

function build_2_1_cave() {
  const b = new LB(36);
  b.hline(0, 35, 0, '#');
  b.ground(0, 35, 13);
  b.vline(0, 1, 12, '#');
  b.set(2, 11, 'P');
  b.coins(5, 16, 11);
  b.rect(10, 10, 12, 12, '#');
  b.coins(9, 13, 7);
  b.set(18, 9, '*');
  b.coins(21, 26, 11);
  b.set(24, 7, 'C');
  b.set(29, 11, 'X');
  return b.rows();
}

// ============================== 2-2 MOONLIT CLIMB ==========================
function build_2_2() {
  const b = new LB(190);
  b.ground(0, 25);
  b.set(3, 11, 'P');
  b.set(10, 12, 'p');
  b.set(14, 9, '?');
  b.set(18, 12, 'k');
  b.set(22, 7, 'G');
  // springboard cliffs — bounce your way up
  b.rect(26, 9, 34, 14, '#');
  b.set(29, 8, 's');
  b.coins(27, 33, 4);
  b.rect(35, 6, 42, 14, '#');
  b.set(38, 5, 'M');
  b.stairsDown(43, 4, 7);
  b.ground(47, 70);
  b.set(50, 12, 'y');
  b.set(54, 12, 'p');
  b.put(58, 9, 'B*B');
  b.set(63, 7, 'G');
  b.set(66, 12, 'k');
  // night gap run
  b.hline(71, 74, 10, '-');
  b.hline(77, 80, 8, '-');
  b.hline(83, 86, 10, '-');
  b.coins(71, 86, 5);
  b.ground(87, 110);
  b.set(90, 12, '!');
  b.set(94, 12, 'k');
  b.set(98, 10, 'n');
  b.set(104, 9, 'h');
  b.set(107, 12, 'p');
  // moon-lift canyon
  b.hline(111, 126, 14, '~');
  b.set(114, 9, 'V');
  b.set(121, 10, 'm');
  b.coins(113, 124, 6);
  b.ground(127, 150);
  b.set(130, 12, 'y');
  b.set(134, 7, 'G');
  b.put(138, 9, '?B?');
  b.set(144, 12, 'k');
  b.set(148, 12, 'p');
  // rooftop run (one-ways over a drop)
  b.hline(151, 156, 9, '-');
  b.hline(158, 163, 7, '-');
  b.hline(165, 170, 9, '-');
  b.coins(158, 163, 4);
  b.ground(157, 189);
  b.set(160, 12, 'y');
  b.set(167, 12, 'y');
  b.stairsUp(173, 5, 12);
  b.set(184, 12, '&');
  return b.rows();
}

// ============================== 2-3 CLIFFSIDE GOMPA ========================
function build_2_3() {
  const b = new LB(200);
  b.ground(0, 18);
  b.set(3, 11, 'P');
  b.set(10, 12, 'k');
  b.set(14, 9, '?');
  // first cliff face
  b.rect(19, 9, 24, 14, '#');
  b.rect(25, 5, 30, 14, '#');
  b.coins(20, 23, 6);
  b.set(27, 2, 'h');
  b.stairsDown(31, 3, 6);
  b.ground(34, 52);
  b.set(37, 12, 'y');
  b.set(41, 10, 'n');
  b.put(46, 9, 'MB?');
  b.set(50, 12, 'p');
  // canyon of ledges
  b.hline(53, 55, 11, '-');
  b.hline(57, 59, 9, '-');
  b.hline(61, 63, 7, '-');
  b.hline(65, 68, 9, '-');
  b.coins(57, 63, 4);
  b.set(60, 4, 'G');
  b.rect(69, 9, 80, 14, '#');
  b.set(72, 8, 'k');
  b.set(76, 5, 'C');
  b.set(79, 8, 'p');
  // crumbling descent
  b.hline(81, 83, 9, 'f');
  b.hline(84, 86, 11, 'f');
  b.hline(81, 92, 14, '~');
  b.hline(87, 92, 12, 'b');
  b.ground(93, 118);
  b.set(96, 12, '!');
  b.set(100, 12, 'y');
  b.set(104, 12, 'y');
  b.put(108, 9, 'B?B*');
  b.set(114, 7, 'G');
  // gompa towers
  b.rect(119, 8, 121, 14, '#');
  b.rect(124, 6, 126, 14, '#');
  b.rect(129, 8, 131, 14, '#');
  b.coins(119, 131, 3);
  b.set(125, 3, 'L');
  b.ground(132, 154);
  b.set(135, 12, 'k');
  b.set(139, 12, 'k');
  b.set(143, 10, 'n');
  b.set(149, 12, 'p');
  // final ledges to the bell
  b.hline(155, 158, 10, '-');
  b.hline(160, 163, 8, '-');
  b.coins(160, 163, 5);
  b.set(165, 5, 'G');
  b.ground(164, 199);
  b.stairsUp(168, 6, 12);
  b.set(180, 9, 'h');
  b.set(190, 12, '&');
  return b.rows();
}

// ============================== 2-4 LANGUR KING'S GOMPA ====================
function build_2_4() {
  const b = new LB(155);
  b.hline(0, 154, 0, '=');
  b.ground(0, 154, 13, '=');
  b.set(3, 11, 'P');
  b.set(10, 2, 'T');
  b.hline(14, 16, 12, '^');
  b.hline(13, 17, 9, '-');
  b.set(21, 8, 'g');
  b.put(25, 9, 'B?BMB');
  b.set(31, 12, 'k');
  // pit with platform
  b.rect(35, 13, 38, 14, '.');
  b.hline(35, 38, 10, '-');
  b.coins(35, 38, 7);
  b.set(42, 2, 'T');
  b.set(47, 9, 'g');
  b.set(52, 12, 's');
  b.hline(54, 57, 12, '^');
  b.coins(52, 58, 4);
  b.set(61, 12, '!');
  // low ceiling gallery
  b.rect(65, 1, 74, 8, '=');
  b.set(69, 11, 'g');
  b.set(77, 12, 'p');
  b.set(80, 12, 'p');
  b.set(84, 2, 'T');
  b.set(88, 2, 'T');
  b.hline(92, 94, 12, '^');
  b.hline(91, 95, 9, '-');
  b.set(98, 9, '*');
  b.set(102, 12, 'k');
  // raised entry, drop into the throne room
  b.rect(106, 9, 112, 14, '=');
  b.coins(107, 111, 6);
  b.set(126, 12, '2');           // LANGUR KING
  b.rect(138, 9, 138, 12, '=');  // exit wall (running jump)
  b.set(146, 11, 'E');
  return b.rows();
}

LEVELS.push(
  {
    world: 2, stage: 1, name: 'Prayer Flag Pass', theme: 'hills', music: 'overworld',
    time: 300, rows: build_2_1(),
    subareas: [{ theme: 'cave', music: 'cave', rows: build_2_1_cave() }],
  },
  {
    world: 2, stage: 2, name: 'Moonlit Climb', theme: 'night', music: 'snow',
    time: 300, rows: build_2_2(),
  },
  {
    world: 2, stage: 3, name: 'Cliffside Gompa', theme: 'night', music: 'overworld',
    time: 250, rows: build_2_3(),
  },
  {
    world: 2, stage: 4, name: "Langur King's Gompa", theme: 'fortress', music: 'fortress',
    time: 250, rows: build_2_4(),
  },
);
