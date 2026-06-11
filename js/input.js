'use strict';
// ---------------------------------------------------------------------------
// Input — keyboard + on-screen touch controls
// Actions: left, right, up, down, jump, run, start, mute
// ---------------------------------------------------------------------------

const Input = {
  down: {},        // action -> bool (currently held)
  pressed: {},     // action -> bool (went down this frame)
  _queue: {},      // raw edge events collected between frames

  KEYMAP: {
    ArrowLeft: 'left',  KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
    ArrowUp: 'up',      KeyW: 'up',
    ArrowDown: 'down',  KeyS: 'down',
    KeyZ: 'jump', KeyJ: 'jump', Space: 'jump',
    KeyX: 'run',  KeyK: 'run', ShiftLeft: 'run', ShiftRight: 'run',
    Enter: 'start', Escape: 'start',
    KeyM: 'mute',
  },

  init() {
    addEventListener('keydown', (e) => {
      const a = this.KEYMAP[e.code];
      if (!a) return;
      e.preventDefault();
      if (!this.down[a]) this._queue[a] = true;
      this.down[a] = true;
      Audio_.unlock(); // browsers require a user gesture to start audio
    });
    addEventListener('keyup', (e) => {
      const a = this.KEYMAP[e.code];
      if (!a) return;
      e.preventDefault();
      this.down[a] = false;
    });
    addEventListener('blur', () => { this.down = {}; });
    this.initTouch();
  },

  initTouch() {
    const hasTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (!hasTouch) return;
    const layer = document.getElementById('touch');
    if (!layer) return;
    layer.style.display = 'block';
    const bind = (id, action) => {
      const el = document.getElementById(id);
      if (!el) return;
      const on = (e) => {
        e.preventDefault();
        if (!this.down[action]) this._queue[action] = true;
        this.down[action] = true;
        Audio_.unlock();
      };
      const off = (e) => { e.preventDefault(); this.down[action] = false; };
      el.addEventListener('touchstart', on, { passive: false });
      el.addEventListener('touchend', off, { passive: false });
      el.addEventListener('touchcancel', off, { passive: false });
    };
    bind('t-left', 'left');
    bind('t-right', 'right');
    bind('t-down', 'down');
    bind('t-jump', 'jump');
    bind('t-run', 'run');
    // Tap anywhere outside the buttons acts as "start" on menus
    layer.addEventListener('touchstart', (e) => {
      if (e.target === layer) {
        if (!this.down.start) this._queue.start = true;
        this.down.start = true;
        Audio_.unlock();
        setTimeout(() => { this.down.start = false; }, 100);
      }
    }, { passive: true });
  },

  // Called once per fixed update tick
  beginFrame() {
    this.pressed = this._queue;
    this._queue = {};
  },
};
