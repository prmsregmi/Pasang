'use strict';
// ---------------------------------------------------------------------------
// Save — progress & settings in localStorage (gracefully optional).
// ---------------------------------------------------------------------------

const Save = {
  KEY: 'pasang_save_v1',
  data: { unlocked: 0, bestScore: 0, muted: false, completed: false },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) Object.assign(this.data, JSON.parse(raw));
    } catch (e) { /* private mode / file:// quirks — play without saving */ }
    return this.data;
  },

  write() {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(this.data));
    } catch (e) { /* ignore */ }
  },

  unlockLevel(idx) {
    if (idx > this.data.unlocked) {
      this.data.unlocked = idx;
      this.write();
    }
  },

  recordScore(score) {
    if (score > this.data.bestScore) {
      this.data.bestScore = score;
      this.write();
    }
  },

  setMuted(m) { this.data.muted = m; this.write(); },
  setCompleted() { this.data.completed = true; this.write(); },
  reset() {
    this.data = { unlocked: 0, bestScore: this.data.bestScore, muted: this.data.muted, completed: this.data.completed };
    this.write();
  },
};
