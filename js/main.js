'use strict';
// ---------------------------------------------------------------------------
// Main — boot, fixed-timestep loop, scene state machine, run state.
// ---------------------------------------------------------------------------

const Game = {
  canvas: null, ctx: null,
  scene: null, sceneName: '',
  level: null,
  paused: false,
  pauseCursor: 0,
  run: null,
  lastCheckpoint: null,

  newRun(opts = {}) {
    const lvl = opts.keepLevel && this.run ? this.run.levelIdx : Math.min(Save.data.unlocked, LEVELS.length - 1);
    this.run = {
      score: 0, coins: 0, lives: 3,
      size: 0,
      levelIdx: opts.keepLevel && this.run ? this.run.levelIdx : 0,
      world: 1, stage: 1,
    };
    if (!opts.keepLevel) this.run.levelIdx = 0;
    this.lastCheckpoint = null;
    void lvl;
  },

  setScene(name, args) {
    this.sceneName = name;
    this.scene = Scenes[name];
    this.level = null;
    this.paused = false;
    this.scene.enter(this, args || {});
  },

  startLevel(idx) {
    this.run.levelIdx = idx;
    const def = LEVELS[idx];
    this.run.world = def.world;
    this.run.stage = def.stage;
    this.setScene('intro', { idx });
  },

  beginLevel(idx) {
    this.sceneName = 'level';
    this.scene = null;
    this.paused = false;
    const def = LEVELS[idx];
    const cp = (this.lastCheckpoint && this.lastCheckpoint.idx === idx)
      ? this.lastCheckpoint.pos : null;
    this.level = new LevelState(def, this, { checkpoint: cp });
  },

  onLevelComplete() {
    this.run.size = this.level.player.size;
    this.lastCheckpoint = null;
    Save.unlockLevel(Math.min(this.run.levelIdx + 1, LEVELS.length - 1));
    Save.recordScore(this.run.score);
    if (this.run.levelIdx >= LEVELS.length - 1) {
      this.setScene('ending');
    } else {
      this.setScene('map', { cursor: this.run.levelIdx + 1 });
    }
  },

  onGameComplete() {
    this.setScene('ending');
  },

  onPlayerDeath() {
    this.run.lives--;
    this.run.size = 0;
    if (this.level && this.level.checkpoint) {
      this.lastCheckpoint = { idx: this.run.levelIdx, pos: this.level.checkpoint };
    }
    if (this.run.lives <= 0) {
      this.lastCheckpoint = null;
      this.setScene('gameover');
    } else {
      this.startLevel(this.run.levelIdx);
    }
  },

  update(dt) {
    Input.beginFrame();
    if (Input.pressed.mute) {
      const m = Audio_.toggleMute();
      Save.setMuted(m);
    }

    if (this.level) {
      if (Input.pressed.start) {
        this.paused = !this.paused;
        this.pauseCursor = 0;
        Audio_.sfx('pause');
        if (this.paused) Audio_.stopMusic();
        else Audio_.playMusic(this.level.musicFor(this.level.area), { hurry: this.level.hurry });
      }
      if (this.paused) {
        if (Input.pressed.down || Input.pressed.up) {
          this.pauseCursor = (this.pauseCursor + (Input.pressed.down ? 1 : 2)) % 3;
          Audio_.sfx('select');
        }
        if (Input.pressed.jump) {
          if (this.pauseCursor === 0) {
            this.paused = false;
            Audio_.playMusic(this.level.musicFor(this.level.area), { hurry: this.level.hurry });
          } else if (this.pauseCursor === 1) {
            this.lastCheckpoint = null;
            this.startLevel(this.run.levelIdx);
          } else {
            this.setScene('map');
          }
        }
        return;
      }
      this.level.update(dt);
      return;
    }
    if (this.scene) this.scene.update(this, dt);
  },

  draw() {
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;
    if (this.level) {
      this.level.draw(ctx);
      drawHUD(ctx, this, this.level);
      if (this.paused) {
        ctx.fillStyle = 'rgba(8,8,18,0.7)';
        ctx.fillRect(0, 0, VIEW_W, VIEW_H);
        drawTextCentered(ctx, 'PAUSED', VIEW_W / 2, 78, '#fff', 2);
        ['RESUME', 'RESTART LEVEL', 'QUIT TO MAP'].forEach((opt, i) => {
          const sel = i === this.pauseCursor;
          drawTextCentered(ctx, (sel ? '> ' : '') + opt + (sel ? ' <' : ''),
            VIEW_W / 2, 118 + i * 14, sel ? '#fff' : '#8a96a8');
        });
        drawTextCentered(ctx, 'Z/SPACE SELECT', VIEW_W / 2, 175, '#6a7688');
      }
      return;
    }
    if (this.scene) this.scene.draw(this, ctx);
  },

  fitCanvas() {
    const scale = Math.max(1, Math.floor(Math.min(
      window.innerWidth / VIEW_W, window.innerHeight / VIEW_H)));
    this.canvas.style.width = (VIEW_W * scale) + 'px';
    this.canvas.style.height = (VIEW_H * scale) + 'px';
  },

  boot() {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');
    Save.load();
    Audio_.muted = !!Save.data.muted;
    Input.init();
    buildBackgrounds();
    this.fitCanvas();
    window.addEventListener('resize', () => this.fitCanvas());
    this.newRun();
    this.setScene('title');

    // fixed 60 Hz logic, decoupled rendering
    let last = performance.now();
    let acc = 0;
    const STEP = 1 / 60;
    const frame = (now) => {
      acc += Math.min(0.1, (now - last) / 1000);
      last = now;
      let steps = 0;
      while (acc >= STEP && steps < 4) {
        this.update(STEP);
        acc -= STEP;
        steps++;
      }
      this.draw();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  },
};

window.addEventListener('load', () => Game.boot());
