'use strict';
// ---------------------------------------------------------------------------
// HUD — score, coins, world, time, lives.
// ---------------------------------------------------------------------------

function drawHUD(ctx, game, level) {
  const run = game.run;
  drawTextShadow(ctx, 'PASANG', 12, 6, '#fff');
  drawTextShadow(ctx, pad(run.score, 6), 12, 15, '#fff');

  drawSprite(ctx, 'coin1', 104, 5);
  drawTextShadow(ctx, 'x' + pad(run.coins, 2), 118, 8, '#fff');

  drawTextShadow(ctx, 'WORLD', 168, 6, '#fff');
  drawTextShadow(ctx, run.world + '-' + run.stage, 176, 15, '#fff');

  drawTextShadow(ctx, 'TIME', 232, 6, '#fff');
  const t = level ? Math.max(0, Math.ceil(level.time)) : 0;
  drawTextShadow(ctx, pad(t, 3), 235, 15, level && level.time <= 100 ? '#f06060' : '#fff');

  drawTextShadow(ctx, 'LIVES', 290, 6, '#fff');
  drawTextShadow(ctx, 'x' + pad(run.lives, 2), 296, 15, '#fff');

  if (Audio_.muted) drawTextShadow(ctx, 'MUTE', 344, 6, '#f0c050');
}
