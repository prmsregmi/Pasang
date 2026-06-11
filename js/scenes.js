'use strict';
// ---------------------------------------------------------------------------
// Scenes — title, world map, level intro, game over, pause, ending/credits.
// ---------------------------------------------------------------------------

// Map node positions: a trail climbing from the foothills to the summit.
const MAP_NODES = [
  { x: 38,  y: 196 }, { x: 84,  y: 178 }, { x: 126, y: 192 }, { x: 166, y: 164 },
  { x: 196, y: 138 }, { x: 232, y: 152 }, { x: 264, y: 122 }, { x: 296, y: 134 },
  { x: 312, y: 100 }, { x: 336, y: 78 },  { x: 354, y: 56 },  { x: 366, y: 34 },
];

const Scenes = {};

// ----------------------------------------------------------------- TITLE
Scenes.title = {
  enter(game) {
    this.t = 0;
    this.cursor = 0;
    this.options = Save.data.unlocked > 0 || Save.data.completed
      ? ['CONTINUE JOURNEY', 'NEW JOURNEY'] : ['BEGIN JOURNEY'];
    Audio_.playMusic('title');
  },
  update(game, dt) {
    this.t += dt;
    if (Input.pressed.down || Input.pressed.up) {
      this.cursor = (this.cursor + 1) % this.options.length;
      Audio_.sfx('select');
    }
    if (Input.pressed.start || Input.pressed.jump) {
      Audio_.sfx('coin');
      if (this.options[this.cursor] === 'NEW JOURNEY') Save.reset();
      game.newRun();
      game.setScene('map');
    }
  },
  draw(game, ctx) {
    drawBackground(ctx, 'hills', this.t * 12, this.t);
    // title plaque
    ctx.fillStyle = 'rgba(12,10,24,0.55)';
    ctx.fillRect(0, 36, VIEW_W, 86);
    drawTextCentered(ctx, 'A HIMALAYAN ADVENTURE', VIEW_W / 2, 44, '#f0e0b0');
    // big logo
    const wob = Math.sin(this.t * 2) * 2;
    drawTextShadow(ctx, 'PASANG', VIEW_W / 2 - textWidth('PASANG', 4) / 2, 58 + wob, '#ffd24a', 4, '#4a2808');
    drawTextCentered(ctx, 'RING THE BELLS  RESCUE MAYA  FACE THE YETI', VIEW_W / 2, 100, '#d8e8f8');

    this.options.forEach((opt, i) => {
      const sel = i === this.cursor;
      drawTextCentered(ctx, (sel ? '> ' : '  ') + opt + (sel ? ' <' : '  '),
        VIEW_W / 2, 148 + i * 14, sel ? '#fff' : '#b8c4d8');
    });
    if (Save.data.bestScore > 0) {
      drawTextCentered(ctx, 'BEST ' + pad(Save.data.bestScore, 6), VIEW_W / 2, 190, '#e8b83a');
    }
    if (Save.data.completed) {
      drawSprite(ctx, 'sparkle', VIEW_W / 2 - 78, 188);
      drawSprite(ctx, 'sparkle', VIEW_W / 2 + 72, 188);
    }
    drawTextCentered(ctx, 'ARROWS/WASD MOVE   Z/SPACE JUMP   X/SHIFT RUN', VIEW_W / 2, 212, '#9ab0c8');
    drawTextCentered(ctx, 'ENTER START   M MUTE', VIEW_W / 2, 224, '#9ab0c8');
    // Pasang waving on a hill beside the flag
    drawSprite(ctx, 'p_victory', 38, 160);
    drawSprite(ctx, Math.floor(this.t * 4) % 2 ? 'npflag2' : 'npflag1', 60, 138);
  },
};

// ----------------------------------------------------------------- MAP
Scenes.map = {
  enter(game, args) {
    this.t = 0;
    this.cursor = clamp((args && args.cursor != null) ? args.cursor : game.run.levelIdx, 0, Save.data.unlocked);
    this.cursor = Math.min(this.cursor, LEVELS.length - 1);
    Audio_.playMusic('map');
  },
  update(game, dt) {
    this.t += dt;
    const maxIdx = Math.min(Save.data.unlocked, LEVELS.length - 1);
    if (Input.pressed.right || Input.pressed.up) {
      if (this.cursor < maxIdx) { this.cursor++; Audio_.sfx('select'); }
    }
    if (Input.pressed.left || Input.pressed.down) {
      if (this.cursor > 0) { this.cursor--; Audio_.sfx('select'); }
    }
    if (Input.pressed.start || Input.pressed.jump) {
      Audio_.sfx('coin');
      game.startLevel(this.cursor);
    }
  },
  draw(game, ctx) {
    // panorama: valley to summit
    const grd = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    grd.addColorStop(0, '#3a5a8c'); grd.addColorStop(0.5, '#7aa8d0'); grd.addColorStop(1, '#cfe8c8');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    // the mountain
    ctx.fillStyle = '#e8f0f8';
    ctx.beginPath();
    ctx.moveTo(180, VIEW_H); ctx.lineTo(382, 10); ctx.lineTo(384, VIEW_H);
    ctx.fill();
    ctx.fillStyle = '#b8cce0';
    ctx.beginPath();
    ctx.moveTo(230, VIEW_H); ctx.lineTo(383, 14); ctx.lineTo(384, VIEW_H);
    ctx.fill();
    // foothill bands
    ctx.fillStyle = '#8cba74';
    ctx.beginPath(); ctx.moveTo(0, VIEW_H); ctx.lineTo(0, 190);
    ctx.quadraticCurveTo(90, 150, 200, 175); ctx.lineTo(260, VIEW_H); ctx.fill();
    ctx.fillStyle = '#6aa05c';
    ctx.beginPath(); ctx.moveTo(0, VIEW_H); ctx.lineTo(0, 208);
    ctx.quadraticCurveTo(120, 180, 240, 205); ctx.lineTo(300, VIEW_H); ctx.fill();

    // the great stupa watches over the valley
    paintBoudhanath(ctx, 152, 214, 0.55, { flags: false });

    drawTextShadow(ctx, 'THE TRAIL TO THE YETI', 12, 8, '#fff', 1);
    drawText(ctx, 'W1 FOOTHILLS', 12, 222, '#2c5a2c');
    drawText(ctx, 'W2 MONASTERY HILLS', 130, 222, '#3a3a6a');
    drawText(ctx, 'W3 HIGH PASSES', 268, 222, '#4a6a8a');

    // trail
    ctx.strokeStyle = 'rgba(90,60,30,0.7)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    MAP_NODES.forEach((n, i) => i ? ctx.lineTo(n.x, n.y) : ctx.moveTo(n.x, n.y));
    ctx.stroke();
    ctx.setLineDash([]);

    // nodes
    MAP_NODES.forEach((n, i) => {
      const unlocked = i <= Save.data.unlocked;
      const isFortress = i % 4 === 3;
      ctx.fillStyle = unlocked ? (isFortress ? '#c83030' : '#f8d030') : '#6a6a78';
      ctx.fillRect(n.x - 4, n.y - 4, 8, 8);
      ctx.strokeStyle = '#2a2018';
      ctx.strokeRect(n.x - 4.5, n.y - 4.5, 9, 9);
      if (i === 11) {
        drawSprite(ctx, 'bell', n.x - 8, n.y - 22);
        drawSprite(ctx, Math.floor(this.t * 4) % 2 ? 'npflag2' : 'npflag1', n.x - 26, n.y - 26);
      }
    });

    // cursor: Pasang standing on the selected node
    const cn = MAP_NODES[this.cursor];
    const bob = Math.sin(this.t * 5) * 2;
    drawSprite(ctx, 'p_sm_idle', cn.x - 8, cn.y - 21 + bob);

    const def = LEVELS[this.cursor];
    ctx.fillStyle = 'rgba(12,10,24,0.7)';
    ctx.fillRect(8, 30, 170, 30);
    drawText(ctx, def.world + '-' + def.stage + ' ' + def.name.toUpperCase(), 14, 35, '#fff');
    drawText(ctx, 'ENTER TO START', 14, 47, '#e8b83a');
    drawHUDMini(ctx, game);
  },
};

function drawHUDMini(ctx, game) {
  drawTextShadow(ctx, 'LIVES x' + game.run.lives, 300, 8, '#fff');
  drawTextShadow(ctx, pad(game.run.score, 6), 300, 18, '#fff');
}

// ----------------------------------------------------------------- INTRO CARD
Scenes.intro = {
  enter(game, args) {
    this.t = 0;
    this.idx = args.idx;
    Audio_.stopMusic();
  },
  update(game, dt) {
    this.t += dt;
    if (this.t > 2 || Input.pressed.start || Input.pressed.jump) {
      game.beginLevel(this.idx);
    }
  },
  draw(game, ctx) {
    const def = LEVELS[this.idx];
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    drawTextCentered(ctx, 'WORLD ' + def.world + '-' + def.stage, VIEW_W / 2, 86, '#fff', 2);
    drawTextCentered(ctx, def.name.toUpperCase(), VIEW_W / 2, 110, '#e8b83a');
    drawSprite(ctx, 'p_sm_idle', VIEW_W / 2 - 24, 132);
    drawText(ctx, 'x ' + pad(game.run.lives, 2), VIEW_W / 2, 137, '#fff');
  },
};

// ----------------------------------------------------------------- GAME OVER
Scenes.gameover = {
  enter(game) {
    this.t = 0;
    this.cursor = 0;
    Audio_.stopMusic();
    Audio_.playJingle('gameover');
    Save.recordScore(game.run.score);
  },
  update(game, dt) {
    this.t += dt;
    if (this.t < 1.5) return;
    if (Input.pressed.up || Input.pressed.down) {
      this.cursor = 1 - this.cursor;
      Audio_.sfx('select');
    }
    if (Input.pressed.start || Input.pressed.jump) {
      if (this.cursor === 0) {
        game.newRun({ keepLevel: true });
        game.startLevel(game.run.levelIdx);
      } else {
        game.setScene('title');
      }
    }
  },
  draw(game, ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    drawTextCentered(ctx, 'GAME OVER', VIEW_W / 2, 78, '#c83030', 2);
    drawTextCentered(ctx, 'SCORE ' + pad(game.run.score, 6), VIEW_W / 2, 110, '#fff');
    if (this.t > 1.5) {
      ['TRY AGAIN', 'BACK TO TITLE'].forEach((opt, i) => {
        const sel = i === this.cursor;
        drawTextCentered(ctx, (sel ? '> ' : '') + opt + (sel ? ' <' : ''),
          VIEW_W / 2, 140 + i * 14, sel ? '#fff' : '#8a96a8');
      });
    }
  },
};

// ----------------------------------------------------------------- ENDING
Scenes.ending = {
  enter(game) {
    this.t = 0;
    Audio_.playMusic('ending');
    Save.setCompleted();
    Save.recordScore(game.run.score);
    this.credits = [
      'PASANG RANG THE GREAT BELL',
      'THE YETI FLED INTO LEGEND',
      'AND MAYA CAME HOME',
      '',
      'THE FOOTHILLS ARE SAFE AGAIN',
      '',
      '- A HIMALAYAN ADVENTURE -',
      '',
      'ORIGINAL GAME, ART AND MUSIC',
      'MADE WITH LOVE FOR THE HIMALAYA',
      '',
      'STARRING',
      'PASANG THE SHERPA',
      'MAYA HIS SISTER',
      'THE VILLAGE ELDER',
      '',
      'AND',
      'YAKS  PIKAS  LANGURS',
      'GORAKS  SNOW LEOPARDS',
      'THE BANDIT BOAR',
      'THE LANGUR KING',
      'AND THE YETI HIMSELF',
      '',
      'FINAL SCORE',
      '',
      'THANK YOU FOR PLAYING!',
    ];
  },
  update(game, dt) {
    this.t += dt;
    if (this.t > 6 && (Input.pressed.start)) {
      game.setScene('title');
    }
  },
  draw(game, ctx) {
    // sunrise over the peaks
    const grd = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    grd.addColorStop(0, '#2a2a5e'); grd.addColorStop(0.45, '#c86a4a'); grd.addColorStop(0.75, '#f0c060');
    grd.addColorStop(1, '#f8e8b0');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.fillStyle = '#f8e070';
    ctx.beginPath(); ctx.arc(VIEW_W / 2, 150, 26, 0, 7); ctx.fill();
    ctx.fillStyle = '#3a3456';
    ctx.beginPath();
    ctx.moveTo(0, VIEW_H); ctx.lineTo(60, 140); ctx.lineTo(120, VIEW_H); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(90, VIEW_H); ctx.lineTo(200, 100); ctx.lineTo(310, VIEW_H); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(250, VIEW_H); ctx.lineTo(340, 130); ctx.lineTo(384, VIEW_H); ctx.fill();
    // heroes on the summit
    drawSprite(ctx, 'p_victory', 184, 76);
    drawSprite(ctx, 'maya', 206, 82);
    drawSprite(ctx, 'bell', 156, 80);
    if (Math.floor(this.t * 1.5) % 3 === 0) drawSprite(ctx, 'sparkle', 162, 70);

    // scrolling credits
    const scroll = Math.max(0, this.t - 2.5) * 12;
    ctx.fillStyle = 'rgba(10,8,20,0.45)';
    ctx.fillRect(0, 150, VIEW_W, 90);
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 150, VIEW_W, 90); ctx.clip();
    this.credits.forEach((line, i) => {
      const y = 235 - scroll + i * 14;
      if (y > 140 && y < 245) {
        const text = line === 'FINAL SCORE' ? 'FINAL SCORE ' + pad(game.run.score, 6) : line;
        drawTextCentered(ctx, text, VIEW_W / 2, y, '#fff');
      }
    });
    ctx.restore();
    if (this.t > 6 && Math.floor(this.t * 2) % 2) {
      drawTextCentered(ctx, 'PRESS ENTER', VIEW_W / 2, 226, '#ffe080');
    }
  },
};
