'use strict';
// ---------------------------------------------------------------------------
// Audio_ — WebAudio chiptune engine: synthesized SFX + pattern sequencer.
// All compositions in music.js are original works.
// ---------------------------------------------------------------------------

const Audio_ = {
  ctx: null,
  master: null, sfxGain: null, musGain: null,
  muted: false,
  _noiseBuf: null,
  _seq: null, // current sequencer state

  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 1;
    this.master.connect(this.ctx.destination);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.5;
    this.sfxGain.connect(this.master);
    this.musGain = this.ctx.createGain();
    this.musGain.gain.value = 0.4;
    this.musGain.connect(this.master);
    // white noise buffer for drums / crashes
    const len = this.ctx.sampleRate * 0.5;
    this._noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this._noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    // restart pending music
    if (this._pendingMusic) { const m = this._pendingMusic; this._pendingMusic = null; this.playMusic(m.name, m.opts); }
  },

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 1;
  },
  toggleMute() { this.setMuted(!this.muted); return this.muted; },

  // --- low-level synth helpers ---------------------------------------------
  _tone({ type = 'square', freq = 440, freqEnd = null, dur = 0.1, vol = 0.5,
          attack = 0.002, when = 0, dest = null, sweep = 'exp' }) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(1, freq), t0);
    if (freqEnd != null) {
      if (sweep === 'exp') osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + dur);
      else osc.frequency.linearRampToValueAtTime(Math.max(1, freqEnd), t0 + dur);
    }
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(g);
    g.connect(dest || this.sfxGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  },

  _noise({ dur = 0.08, vol = 0.3, filterFreq = 4000, filterType = 'highpass', when = 0, dest = null }) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + when;
    const src = this.ctx.createBufferSource();
    src.buffer = this._noiseBuf;
    src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = filterType;
    f.frequency.value = filterFreq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(dest || this.sfxGain);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  },

  // --- sound effects --------------------------------------------------------
  sfx(name) {
    if (!this.ctx || this.muted) return;
    const S = this;
    switch (name) {
      case 'jump':
        S._tone({ type: 'square', freq: 240, freqEnd: 660, dur: 0.16, vol: 0.32 });
        break;
      case 'bigjump':
        S._tone({ type: 'square', freq: 170, freqEnd: 520, dur: 0.2, vol: 0.34 });
        break;
      case 'coin':
        S._tone({ type: 'square', freq: 988, dur: 0.07, vol: 0.3 });
        S._tone({ type: 'square', freq: 1319, dur: 0.22, vol: 0.3, when: 0.07 });
        break;
      case 'stomp':
        S._tone({ type: 'square', freq: 350, freqEnd: 120, dur: 0.12, vol: 0.36 });
        S._noise({ dur: 0.06, vol: 0.18, filterFreq: 900, filterType: 'lowpass' });
        break;
      case 'bump':
        S._tone({ type: 'square', freq: 140, freqEnd: 90, dur: 0.08, vol: 0.32 });
        break;
      case 'break':
        S._noise({ dur: 0.18, vol: 0.32, filterFreq: 2200, filterType: 'highpass' });
        S._tone({ type: 'square', freq: 320, freqEnd: 110, dur: 0.14, vol: 0.22 });
        break;
      case 'sprout': // item rising out of a block
        S._tone({ type: 'square', freq: 392, freqEnd: 880, dur: 0.35, vol: 0.25, sweep: 'lin' });
        break;
      case 'grow':
        for (let i = 0; i < 6; i++)
          S._tone({ type: 'square', freq: 330 + i * 110, dur: 0.07, vol: 0.26, when: i * 0.055 });
        break;
      case 'shrink':
        for (let i = 0; i < 5; i++)
          S._tone({ type: 'square', freq: 760 - i * 120, dur: 0.07, vol: 0.26, when: i * 0.06 });
        break;
      case 'death':
        // handled as a jingle in music.js, but keep a thud
        S._noise({ dur: 0.2, vol: 0.2, filterFreq: 600, filterType: 'lowpass' });
        break;
      case 'kick':
        S._tone({ type: 'square', freq: 520, freqEnd: 900, dur: 0.09, vol: 0.34 });
        break;
      case 'throw':
        S._tone({ type: 'square', freq: 700, freqEnd: 300, dur: 0.09, vol: 0.26 });
        break;
      case 'oneup':
        [523, 659, 784, 1047, 880, 1319].forEach((f, i) =>
          S._tone({ type: 'square', freq: f, dur: 0.09, vol: 0.28, when: i * 0.09 }));
        break;
      case 'well': // descending into a well
        S._tone({ type: 'square', freq: 600, freqEnd: 150, dur: 0.45, vol: 0.3, sweep: 'lin' });
        break;
      case 'bell':
        S._tone({ type: 'triangle', freq: 1175, dur: 1.4, vol: 0.5 });
        S._tone({ type: 'triangle', freq: 1760, dur: 1.0, vol: 0.3 });
        S._tone({ type: 'sine', freq: 2349, dur: 0.7, vol: 0.2 });
        break;
      case 'checkpoint':
        [659, 880, 1175].forEach((f, i) =>
          S._tone({ type: 'triangle', freq: f, dur: 0.25, vol: 0.35, when: i * 0.12 }));
        break;
      case 'bosshit':
        S._tone({ type: 'square', freq: 200, freqEnd: 60, dur: 0.25, vol: 0.4 });
        S._noise({ dur: 0.15, vol: 0.3, filterFreq: 1200, filterType: 'lowpass' });
        break;
      case 'bossdie':
        S._tone({ type: 'square', freq: 400, freqEnd: 40, dur: 0.9, vol: 0.4, sweep: 'lin' });
        S._noise({ dur: 0.7, vol: 0.35, filterFreq: 800, filterType: 'lowpass' });
        break;
      case 'roar':
        S._tone({ type: 'sawtooth', freq: 90, freqEnd: 55, dur: 0.6, vol: 0.42, sweep: 'lin' });
        S._noise({ dur: 0.5, vol: 0.22, filterFreq: 500, filterType: 'lowpass' });
        break;
      case 'pause':
        S._tone({ type: 'square', freq: 660, dur: 0.06, vol: 0.3 });
        S._tone({ type: 'square', freq: 880, dur: 0.06, vol: 0.3, when: 0.08 });
        break;
      case 'select':
        S._tone({ type: 'square', freq: 880, dur: 0.05, vol: 0.3 });
        break;
      case 'tick':
        S._tone({ type: 'square', freq: 1047, dur: 0.03, vol: 0.22 });
        break;
      case 'spring':
        S._tone({ type: 'square', freq: 180, freqEnd: 760, dur: 0.22, vol: 0.32, sweep: 'lin' });
        break;
      case 'lever':
        S._tone({ type: 'square', freq: 300, dur: 0.1, vol: 0.35 });
        S._tone({ type: 'square', freq: 450, dur: 0.15, vol: 0.35, when: 0.1 });
        break;
      case 'crumble':
        S._noise({ dur: 0.5, vol: 0.35, filterFreq: 700, filterType: 'lowpass' });
        break;
      case 'hurry':
        [880, 880, 880].forEach((f, i) =>
          S._tone({ type: 'square', freq: f, dur: 0.08, vol: 0.3, when: i * 0.16 }));
        break;
      case 'fireball': // khukuri ricochet
        S._tone({ type: 'square', freq: 900, freqEnd: 1400, dur: 0.05, vol: 0.18 });
        break;
    }
  },

  // --- music sequencer ------------------------------------------------------
  // Track format (music.js): { tempo: stepsPerSecond, channels: {pulse1, pulse2, tri, noise}, loop }
  // Melodic token: 'c4:2' (note:steps) or '.' / '.:2' for rests. Steps default 1.
  // Noise tokens: 'k' kick, 's' snare, 'h' hat.
  _noteFreq(name) {
    const m = /^([a-g])(#?)(\d)$/.exec(name);
    if (!m) return null;
    const base = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }[m[1]];
    const midi = 12 * (parseInt(m[3]) + 1) + base + (m[2] ? 1 : 0);
    return 440 * Math.pow(2, (midi - 69) / 12);
  },

  _parseChannel(str) {
    // returns [{freq|drum, steps}]
    const out = [];
    for (const tok of str.trim().split(/\s+/)) {
      if (!tok) continue;
      const [head, stepsStr] = tok.split(':');
      const steps = stepsStr ? parseFloat(stepsStr) : 1;
      if (head === '.') out.push({ rest: true, steps });
      else if (head === 'k' || head === 's' || head === 'h') out.push({ drum: head, steps });
      else out.push({ freq: this._noteFreq(head), steps });
    }
    return out;
  },

  currentMusic: null,
  _pendingMusic: null,

  playMusic(name, opts = {}) {
    this.stopMusic();
    this.currentMusic = name;
    if (!this.ctx) { this._pendingMusic = { name, opts }; return; }
    const track = MUSIC[name];
    if (!track) return;
    const rate = (opts.hurry ? 1.3 : 1) * track.tempo; // steps per second
    const stepDur = 1 / rate;
    const channels = [];
    for (const [chName, spec] of Object.entries(track.channels)) {
      const notes = this._parseChannel(spec.pattern);
      let total = 0;
      for (const n of notes) total += n.steps;
      channels.push({
        name: chName, notes, idx: 0, nextTime: 0, totalSteps: total,
        type: spec.type || (chName === 'tri' ? 'triangle' : 'square'),
        vol: spec.vol != null ? spec.vol : 0.22,
        staccato: spec.staccato != null ? spec.staccato : 0.85,
        octave: spec.octave || 0,
      });
    }
    const startTime = this.ctx.currentTime + 0.05;
    for (const ch of channels) ch.nextTime = startTime;
    const seq = { name, channels, stepDur, loop: track.loop !== false, timer: null, onend: opts.onend };
    this._seq = seq;
    const LOOKAHEAD = 0.15;
    const tickFn = () => {
      if (this._seq !== seq || !this.ctx) return;
      const now = this.ctx.currentTime;
      let allDone = true;
      for (const ch of seq.channels) {
        while (ch.nextTime < now + LOOKAHEAD) {
          if (ch.idx >= ch.notes.length) {
            if (seq.loop) ch.idx = 0;
            else break;
          }
          if (ch.idx >= ch.notes.length) break;
          const n = ch.notes[ch.idx++];
          const dur = n.steps * seq.stepDur;
          if (n.drum) this._drum(n.drum, ch.nextTime, ch.vol);
          else if (n.freq) {
            this._tone({
              type: ch.type, freq: n.freq * Math.pow(2, ch.octave),
              dur: Math.max(0.03, dur * ch.staccato), vol: ch.vol,
              when: ch.nextTime - now, dest: this.musGain,
            });
          }
          ch.nextTime += dur;
        }
        if (ch.idx < ch.notes.length || seq.loop) allDone = false;
      }
      if (allDone && seq.onend) {
        const cb = seq.onend; seq.onend = null;
        const last = Math.max(...seq.channels.map(c => c.nextTime));
        setTimeout(cb, Math.max(0, (last - now) * 1000));
      }
    };
    seq.timer = setInterval(tickFn, 40);
    tickFn();
  },

  _drum(kind, when, vol) {
    const off = Math.max(0, when - this.ctx.currentTime);
    if (kind === 'k') {
      this._tone({ type: 'triangle', freq: 130, freqEnd: 45, dur: 0.1, vol: vol * 1.6, when: off, dest: this.musGain });
    } else if (kind === 's') {
      this._noise({ dur: 0.08, vol: vol * 0.9, filterFreq: 1800, filterType: 'highpass', when: off, dest: this.musGain });
    } else if (kind === 'h') {
      this._noise({ dur: 0.03, vol: vol * 0.5, filterFreq: 6000, filterType: 'highpass', when: off, dest: this.musGain });
    }
  },

  stopMusic() {
    if (this._seq) {
      clearInterval(this._seq.timer);
      this._seq = null;
    }
    this.currentMusic = null;
    this._pendingMusic = null;
  },

  // Play a short non-looping jingle, then optionally call back
  playJingle(name, onend) {
    this.playMusic(name, { onend });
  },
};
