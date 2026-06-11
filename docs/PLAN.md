# Pasang — Full Game Design & Build Plan

A complete 2D side-scrolling platformer in the classic Super Mario Bros. *structure*
(original assets, characters, music, and level layouts — nothing copied), set in the
Nepali Himalayas. You play **Pasang**, a young Sherpa climbing from the foothills to
the high passes to ring the Great Bell and drive the Yeti from the mountain.

## Tech decisions (locked)

- **Vanilla JavaScript + HTML5 Canvas + WebAudio. Zero dependencies, no build step.**
- Classic `<script>` tags in dependency order — works from `file://` (double-click
  `index.html`) and from any static server (`python3 -m http.server`, `npx serve`).
- All graphics are **procedural pixel art**: sprites defined as palette-indexed
  string grids in code, rasterized to offscreen canvases at boot. No image files.
- All music/SFX synthesized with WebAudio (square/triangle/noise chiptune channels).
  Original pentatonic, Nepali-flavored compositions.
- Logical resolution **384×240** (24×15 tiles of 16 px), integer-scaled, crisp pixels.
- Fixed 60 Hz timestep with accumulator; rendering decoupled.
- Save progress in `localStorage`.
- Dev-only test harness: Playwright + headless Chromium (devDependency, not needed to play).

## Theming map (Mario structure → Pasang)

| Mario concept | Pasang equivalent |
|---|---|
| Mario | **Pasang**, young Sherpa (red jacket, topi) |
| Mushroom (grow) | **Momo** (steamed dumpling) |
| Fire Flower (projectile) | **Khukuri** (throw spinning khukuris, max 2 onscreen, bounce) |
| Star (invincibility) | **Chiya** (butter tea — "Himalayan Rush": invincible + faster, music change) |
| 1-Up Mushroom | **Sel Roti** (golden ring-shaped rice bread), hidden/rare |
| Coins (100 → 1-up) | **Rupee coins** |
| ? Block | **Prayer block** (carved stone block with glowing eye symbol) |
| Brick block | **Stone brick** (breakable when Big; some multi-coin) |
| Pipes (+ bonus areas) | **Stone wells** (enterable → cave bonus rooms) |
| Piranha plant | **Snapper** (snapping thorny rhododendron in wells) |
| Goomba | **Yak** (grumpy walker; stomp to squash) |
| Koopa (+ shell) | **Langur monkey** (stomp → curls into ball; kick to slide; chain kills) |
| Koopa Paratroopa | **Gorak** (Himalayan crow; flying, swoops; stomp grounds it) |
| Buzzy/Spiny (no stomp) | **Ice Spirit** (frost wisp, world 3; khukuri/chiya only) |
| Fast chaser | **Snow Leopard** (pounces, world 3) + **Pika** (small fast scurrier) |
| Firebar | **Flame chain** (rotating butter-lamp flames, fortress levels) |
| Thwomp | **Stone slab** (falling crusher, fortress levels) |
| Flagpole finish | **Ring the Bell** (bell on a post; jump-hit, height = bonus) |
| Mid checkpoint | **Prayer wheel** (touch to spin = checkpoint) |
| Castle/Bowser | **Fortress (dzong)** with boss; final boss = **Yeti** on a suspension
  bridge with a rope lever behind him (cut the bridge — homage to the axe) |
| Toad's "thank you" | Village elder / monk at fortress end |

No water/swimming levels (replaced by cave + ridge levels). No slopes (like SMB1).
Rivers/ice water are hazards crossed by suspension bridges.

## Worlds & levels (12 total)

- **World 1 — The Foothills** (green terraces, rivers, suspension bridges)
  - 1-1 Terrace Trail (intro, wells, first langur)
  - 1-2 The Old Well Caves (underground theme, multi-coin bricks, exit well)
  - 1-3 Suspension Heights (bridges, gaps, goraks, falling planks)
  - 1-4 Bandit Boar's Fortress (flame chains, boss: **Bandit Boar** — charges, stomp ×3)
- **World 2 — Monastery Hills** (prayer flags, cliffs, night, monasteries)
  - 2-1 Prayer Flag Pass (hills, moving rope-lifts)
  - 2-2 Moonlit Climb (night palette, goraks + pikas, springboard drums)
  - 2-3 Cliffside Gompa (vertical-ish cliffs, leap-of-faith coins, hidden 1-up)
  - 2-4 Langur King's Gompa (stone slabs, boss: **Langur King** — leaps & throws, stomp ×3)
- **World 3 — The High Passes** (snow, ice physics, blizzard, yeti lair)
  - 3-1 Snowfield Crossing (slippery ice tiles, snow leopards)
  - 3-2 Ice Grotto (cave + ice, ice spirits)
  - 3-3 The Razor Ridge (gauntlet: narrow ridges, wind gusts, goraks)
  - 3-4 The Yeti's Lair (final: flame chains + slabs + **YETI** bridge fight → ending)
- Bonus sub-areas: ≥4 underground coin caves via wells, 1 sky bonus via vine→**rope**.

## Engine feature checklist

- [x] = done, update as we go (heartbeat resumes here)
- [x] Boot/scaffold: index.html, canvas scale, main loop, input (keyboard + touch)
- [x] Sprite system: palettes, pixel-grid rasterizer, sprite sheet, animations
- [x] Player physics: accel/skid/run, variable jump, sizes (small/big/khukuri),
      damage + i-frames, death, ice friction
- [x] Tilemap: ASCII level decoder, solid/one-way/hazard/slippery/breakable/bumpable,
      block contents, hidden blocks, coins, camera
- [x] Items: momo, khukuri, chiya, sel roti, coin, projectiles, particles, score popups
- [x] Enemies: yak, pika, langur(+ball), gorak, snapper, leopard, ice spirit
- [x] Fortress hazards: flame chain, stone slab, moving/falling platforms, springboard
- [x] Wells/sub-areas, prayer-wheel checkpoint, bell finish + tally, timer/hurry
- [x] HUD, pause, mute
- [x] Audio: SFX synth + music sequencer + all tracks (title, map, overworld, cave,
      snow, fortress, chiya rush, hurry variants, clear, death, game over, ending)
- [x] Scenes: title, world map (node path), level intro card, game over, ending/credits
- [x] Save: localStorage (unlocks, best scores, settings)
- [x] Bosses: Bandit Boar, Langur King, Yeti (bridge + lever)
- [x] Levels: all 12 + sub-areas authored & tuned
- [x] Playwright smoke test: boots, no console errors, title renders, level playable
      (plus flow test: wells, power-ups, all 3 bosses, lever finale, ending, game over)
- [x] README: plug-and-play run instructions, controls
- [ ] Final pass: balance, juice (particles/screen shake), bugfixes, push

## Controls

Arrows / WASD move · Z / J / Space jump · X / K run + throw · Enter pause/start ·
M mute. Touch: on-screen D-pad + A/B buttons on small screens.

## Legal

Everything original. Mario is referenced only as genre inspiration (see README).
No Nintendo names, designs, layouts, or music are copied.
