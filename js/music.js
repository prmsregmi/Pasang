'use strict';
// ---------------------------------------------------------------------------
// MUSIC — original compositions for Pasang (pentatonic, Nepali-folk flavored).
// Token format: 'note:steps' (16th-note steps), '.' = rest, drums: k/s/h.
// tempo = steps per second. All melodies are original works for this project.
// ---------------------------------------------------------------------------

const MUSIC = {

  // World 1 & 2 overworld — bright folk bounce in G major pentatonic
  overworld: {
    tempo: 7.5, loop: true,
    channels: {
      pulse1: { vol: 0.20, staccato: 0.8, pattern: `
        g4:1 b4:1 d5:2 e5:1 d5:1 b4:2 a4:1 b4:1 g4:2 e4:2 g4:2
        a4:1 b4:1 d5:2 e5:2 g5:2 e5:1 d5:1 b4:2 a4:4
        g4:1 b4:1 d5:2 e5:1 d5:1 b4:2 a4:1 b4:1 g4:2 e4:2 g4:2
        e5:1 d5:1 b4:1 d5:1 e5:2 d5:2 b4:1 a4:1 g4:4 .:2` },
      pulse2: { vol: 0.10, staccato: 0.5, pattern: `
        . b3:1 . d4:1 . b3:1 . d4:1 . g3:1 . b3:1 . g3:1 . b3:1
        . g3:1 . c4:1 . g3:1 . c4:1 . f#3:1 . d4:1 . f#3:1 . d4:1
        . b3:1 . d4:1 . b3:1 . d4:1 . g3:1 . b3:1 . g3:1 . b3:1
        . g3:1 . c4:1 . g3:1 . c4:1 . f#3:1 . a3:1 b3:2 .:2` },
      tri: { vol: 0.26, staccato: 0.9, pattern: `
        g2:2 d3:2 g2:2 d3:2 e2:2 b2:2 e2:2 b2:2
        c3:2 g2:2 c3:2 g2:2 d3:2 a2:2 d3:2 a2:2
        g2:2 d3:2 g2:2 d3:2 e2:2 b2:2 e2:2 b2:2
        c3:2 g2:2 c3:2 g2:2 d3:2 a2:2 d3:2 a2:2` },
      noise: { vol: 0.10, pattern: `
        k:1 h:1 s:1 h:1 k:1 k:1 s:1 h:1 k:1 h:1 s:1 h:1 k:1 k:1 s:1 h:1
        k:1 h:1 s:1 h:1 k:1 k:1 s:1 h:1 k:1 h:1 s:1 h:1 k:1 k:1 s:1 h:1
        k:1 h:1 s:1 h:1 k:1 k:1 s:1 h:1 k:1 h:1 s:1 h:1 k:1 k:1 s:1 h:1
        k:1 h:1 s:1 h:1 k:1 k:1 s:1 h:1 k:1 h:1 s:1 h:1 k:1 s:1 s:1 s:1` },
    },
  },

  // Underground / cave — sparse and echoing
  cave: {
    tempo: 4.5, loop: true,
    channels: {
      pulse1: { vol: 0.20, staccato: 0.6, pattern: `
        a3:2 .:2 c4:2 .:2 e4:1 d4:1 c4:2 .:4 a3:2 .:2 g3:2 .:2 a3:2 .:6` },
      pulse2: { vol: 0.08, staccato: 0.6, pattern: `
        .:1 a2:2 .:2 c3:2 .:2 e3:1 d3:1 c3:2 .:4 a2:2 .:2 g2:2 .:2 a2:2 .:5` },
      tri: { vol: 0.22, staccato: 0.95, pattern: `a2:8 f2:8 g2:8 a2:8` },
      noise: { vol: 0.06, pattern: `.:6 h:1 .:1 .:6 h:1 .:1 .:6 h:1 .:1 .:6 h:1 .:1` },
    },
  },

  // High passes — airy 3/4 waltz in D major pentatonic
  snow: {
    tempo: 5.5, loop: true,
    channels: {
      pulse1: { vol: 0.20, type: 'triangle', staccato: 0.95, pattern: `
        d5:2 e5:1 f#5:3 a5:2 f#5:1 e5:3 d5:2 e5:1 f#5:3 e5:2 d5:1 b4:3
        a4:2 b4:1 d5:3 e5:2 f#5:1 e5:3 d5:4 b4:2 a4:6` },
      pulse2: { vol: 0.08, staccato: 0.6, pattern: `
        .:2 f#3:2 a3:2 .:2 f#3:2 a3:2 .:2 f#3:2 a3:2 .:2 d3:2 f#3:2
        .:2 b3:2 d4:2 .:2 f#3:2 a3:2 .:2 c#4:2 e4:2 .:2 f#3:2 a3:2` },
      tri: { vol: 0.24, staccato: 0.95, pattern: `d2:6 d2:6 d2:6 b1:6 g2:6 d2:6 a2:6 d2:6` },
      noise: { vol: 0.05, pattern: `.:2 h:2 h:2 .:2 h:2 h:2 .:2 h:2 h:2 .:2 h:2 h:2
        .:2 h:2 h:2 .:2 h:2 h:2 .:2 h:2 h:2 .:2 h:2 h:2` },
    },
  },

  // Fortress — driving minor riff
  fortress: {
    tempo: 8, loop: true,
    channels: {
      pulse1: { vol: 0.20, staccato: 0.75, pattern: `
        a3:1 a3:1 e4:1 a3:1 g4:1 a3:1 e4:1 a3:1 f4:1 f4:1 c5:1 f4:1 e4:1 e4:1 b4:1 e4:1
        a3:1 a3:1 e4:1 a3:1 g4:1 a3:1 e4:1 a3:1 d4:1 d4:1 a4:1 d4:1 d#4:1 d#4:1 e4:2` },
      pulse2: { vol: 0.09, staccato: 0.95, pattern: `a4:8 f4:8 a4:8 d#4:4 e4:4` },
      tri: { vol: 0.26, staccato: 0.9, pattern: `
        a2:1 a2:1 a3:1 a2:1 a2:1 a3:1 a2:1 a2:1 f2:1 f2:1 f3:1 f2:1 e2:1 e2:1 e3:1 e2:1
        a2:1 a2:1 a3:1 a2:1 a2:1 a3:1 a2:1 a2:1 d2:1 d2:1 d3:1 d2:1 d#2:1 d#2:1 e2:2` },
      noise: { vol: 0.11, pattern: `k:1 h:1 s:1 h:1 k:1 h:1 s:1 h:1 k:1 h:1 s:1 h:1 k:1 h:1 s:1 h:1
        k:1 h:1 s:1 h:1 k:1 h:1 s:1 h:1 k:1 h:1 s:1 h:1 k:1 s:1 s:1 s:1` },
    },
  },

  // Boss battles — frantic
  boss: {
    tempo: 9.5, loop: true,
    channels: {
      pulse1: { vol: 0.20, staccato: 0.7, pattern: `
        e4:1 e4:1 g4:1 e4:1 a#4:1 a4:1 g4:1 e4:1 g4:1 g4:1 a#4:1 g4:1 c5:1 a#4:1 g4:1 g4:1
        e4:1 e4:1 g4:1 e4:1 a#4:1 a4:1 g4:1 e4:1 d#4:1 d#4:1 g4:1 d#4:1 e4:1 e4:1 g4:1 e4:1` },
      pulse2: { vol: 0.09, staccato: 0.9, pattern: `
        e3:2 .:2 e3:2 .:2 g3:2 .:2 g3:2 .:2 e3:2 .:2 e3:2 .:2 d#3:2 .:2 e3:2 .:2` },
      tri: { vol: 0.27, staccato: 0.9, pattern: `
        e2:1 e3:1 e2:1 e3:1 e2:1 e3:1 e2:1 e3:1 g2:1 g3:1 g2:1 g3:1 g2:1 g3:1 g2:1 g3:1
        e2:1 e3:1 e2:1 e3:1 e2:1 e3:1 e2:1 e3:1 d#2:1 d#3:1 d#2:1 d#3:1 e2:1 e3:1 e2:1 e3:1` },
      noise: { vol: 0.12, pattern: `k:1 k:1 s:1 h:1 k:1 h:1 s:1 s:1 k:1 k:1 s:1 h:1 k:1 h:1 s:1 s:1
        k:1 k:1 s:1 h:1 k:1 h:1 s:1 s:1 k:1 k:1 s:1 h:1 k:1 s:1 s:1 s:1` },
    },
  },

  // Chiya rush (invincibility) — joyful sprint in C major pentatonic
  chiya: {
    tempo: 10, loop: true,
    channels: {
      pulse1: { vol: 0.20, staccato: 0.8, pattern: `
        c5:1 d5:1 e5:1 g5:1 e5:1 g5:1 a5:1 g5:1 e5:1 g5:1 e5:1 d5:1 c5:1 d5:1 e5:1 d5:1
        c5:1 d5:1 e5:1 g5:1 a5:1 g5:1 c6:1 a5:1 g5:1 e5:1 g5:1 e5:1 d5:1 c5:1 a4:1 c5:1` },
      pulse2: { vol: 0.09, staccato: 0.5, pattern: `
        . e4:1 . g4:1 . e4:1 . g4:1 . f4:1 . a4:1 . e4:1 . g4:1
        . e4:1 . g4:1 . e4:1 . g4:1 . f4:1 . a4:1 . g4:1 . c5:1` },
      tri: { vol: 0.25, staccato: 0.9, pattern: `
        c3:2 g2:2 c3:2 g2:2 f2:2 c3:2 g2:2 c3:2 c3:2 g2:2 c3:2 g2:2 f2:2 c3:2 g2:2 c3:2` },
      noise: { vol: 0.11, pattern: `k:1 h:1 s:1 h:1 k:1 h:1 s:1 h:1 k:1 h:1 s:1 h:1 k:1 h:1 s:1 h:1
        k:1 h:1 s:1 h:1 k:1 h:1 s:1 h:1 k:1 h:1 s:1 h:1 k:1 h:1 s:1 s:1` },
    },
  },

  // Title screen — serene bells over a mountain dawn
  title: {
    tempo: 4, loop: true,
    channels: {
      pulse1: { vol: 0.22, type: 'triangle', staccato: 0.95, pattern: `
        a4:4 c5:2 d5:2 e5:4 d5:2 c5:2 a4:4 g4:2 a4:2 c5:6 .:2` },
      pulse2: { vol: 0.07, staccato: 0.95, pattern: `a3:8 f3:8 g3:8 a3:8` },
      tri: { vol: 0.20, staccato: 0.95, pattern: `a2:8 f2:8 g2:8 a2:8` },
    },
  },

  // World map — plucky trail-walking tune
  map: {
    tempo: 6.5, loop: true,
    channels: {
      pulse1: { vol: 0.20, staccato: 0.7, pattern: `
        g4:1 g4:1 a4:1 b4:1 d5:2 b4:1 d5:1 e5:2 d5:1 b4:1 a4:2 g4:2` },
      tri: { vol: 0.24, staccato: 0.85, pattern: `g2:2 d3:2 e2:2 d3:2 c3:2 d3:2 g2:2 d3:2` },
      noise: { vol: 0.07, pattern: `h:1 h:1 s:1 h:1 h:1 h:1 s:1 h:1 h:1 h:1 s:1 h:1 h:1 h:1 s:1 h:1` },
    },
  },

  // Level clear jingle
  clear: {
    tempo: 8, loop: false,
    channels: {
      pulse1: { vol: 0.22, staccato: 0.85, pattern: `g4:1 a4:1 b4:1 d5:1 e5:1 g5:1 a5:2 g5:2 d5:1 e5:1 g5:4` },
      pulse2: { vol: 0.10, staccato: 0.85, pattern: `b3:1 d4:1 g4:1 b4:1 c5:1 e5:1 f#5:2 b4:2 b4:1 c5:1 b4:4` },
      tri: { vol: 0.26, staccato: 0.9, pattern: `g2:4 c3:4 d3:4 g2:4` },
    },
  },

  // Death jingle
  death: {
    tempo: 7, loop: false,
    channels: {
      pulse1: { vol: 0.22, staccato: 0.85, pattern: `e4:2 d4:2 c4:2 a3:2 .:2 e3:2 a2:4` },
      tri: { vol: 0.24, staccato: 0.9, pattern: `a2:4 e2:4 .:2 a1:6` },
      noise: { vol: 0.10, pattern: `k:2 .:14` },
    },
  },

  // Game over
  gameover: {
    tempo: 5, loop: false,
    channels: {
      pulse1: { vol: 0.22, staccato: 0.9, pattern: `c4:2 a3:2 g3:2 e3:2 .:2 g3:2 e3:2 d3:2 c3:8` },
      tri: { vol: 0.24, staccato: 0.95, pattern: `a2:8 f2:8 c2:8` },
    },
  },

  // Ending / credits — warm and proud
  ending: {
    tempo: 5, loop: true,
    channels: {
      pulse1: { vol: 0.21, staccato: 0.9, pattern: `
        d4:2 g4:2 b4:2 a4:2 g4:2 e4:2 g4:4
        e4:2 a4:2 c5:2 b4:2 a4:2 g4:2 a4:4
        b4:2 d5:2 b4:2 a4:2 g4:2 a4:2 g4:4` },
      pulse2: { vol: 0.08, staccato: 0.7, pattern: `
        g3:2 b3:2 d4:2 b3:2 g3:2 b3:2 d4:2 b3:2
        a3:2 c4:2 e4:2 c4:2 a3:2 c4:2 e4:2 c4:2
        g3:2 b3:2 d4:2 b3:2 d4:2 b3:2 g3:2 b3:2` },
      tri: { vol: 0.24, staccato: 0.95, pattern: `g2:8 e2:8 a2:8 d2:8 g2:8 d2:8` },
    },
  },
};
