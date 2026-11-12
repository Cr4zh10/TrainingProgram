/* Plate Planner — calories, macros and a weak-point hypertrophy plan.
   Plain JavaScript, no build step: works on GitHub Pages as-is. */
(() => {
  'use strict';

  // ---------------------------------------------------------------- Equipment
  const EQUIPMENT = [
    { group: 'Realleader machines — upper body', items: [
      ['chest_press', 'Seated chest press'],
      ['incline_press', 'Incline chest press (plate-loaded)'],
      ['pec_fly', 'Pec fly / rear delt machine'],
      ['shoulder_press', 'Shoulder press'],
      ['lateral_raise', 'Lateral raise machine'],
      ['lat_pulldown', 'Lat pulldown'],
      ['seated_row', 'Seated row'],
      ['tbar_row', 'Chest-supported T-bar row'],
      ['pullover', 'Pullover machine'],
      ['assisted', 'Assisted chin / dip'],
      ['biceps_machine', 'Biceps curl (preacher) machine'],
      ['triceps_machine', 'Triceps extension machine'],
      ['ab_crunch', 'Abdominal crunch machine'],
      ['captains_chair', "Vertical knee raise (captain's chair)"],
    ]},
    { group: 'Realleader machines — lower body', items: [
      ['hack_squat', 'Hack squat'],
      ['pendulum', 'Pendulum squat'],
      ['leg_press', '45° leg press'],
      ['leg_ext', 'Leg extension'],
      ['seated_curl', 'Seated leg curl'],
      ['lying_curl', 'Lying (prone) leg curl'],
      ['hip_thrust', 'Hip thrust machine'],
      ['glute_kickback', 'Glute kickback machine'],
      ['abductor', 'Hip abductor'],
      ['standing_calf', 'Standing calf raise'],
      ['seated_calf', 'Seated calf raise'],
      ['back_ext', '45° back extension'],
    ]},
    { group: 'Cables and free weights', items: [
      ['cable', 'Cable crossover / functional trainer'],
      ['smith', 'Smith machine'],
      ['db', 'Dumbbells'],
      ['bench', 'Adjustable bench'],
    ]},
  ];
  const ALL_EQUIP = EQUIPMENT.flatMap(g => g.items.map(i => i[0]));

  // ---------------------------------------------------------------- Exercises
  // k: c = compound, i = isolation. up = upper-chest emphasis.
  const EX = {
    incline_mach: { n: 'Incline chest press (machine)', eq: ['incline_press'], k: 'c', r: '6–10', up: 1, t: 'Handles in line with upper chest; let them travel back to a deep stretch.' },
    chest_press: { n: 'Seated chest press (machine)', eq: ['chest_press'], k: 'c', r: '6–10', t: 'Shoulder blades pinned back; full stretch every rep.' },
    smith_incline: { n: 'Smith incline press (30°)', eq: ['smith', 'bench'], k: 'c', r: '6–10', up: 1, t: 'Bar touches upper chest, no bounce.' },
    db_incline: { n: 'Incline dumbbell press (30°)', eq: ['db', 'bench'], k: 'c', r: '8–12', up: 1, t: 'Lower until you feel a full chest stretch.' },
    db_flat: { n: 'Flat dumbbell press', eq: ['db', 'bench'], k: 'c', r: '8–12', t: 'Elbows ~45° from the torso.' },
    pec_fly: { n: 'Pec fly machine', eq: ['pec_fly'], k: 'i', r: '10–15', t: 'Open wide into a deep stretch and pause 1 s.' },
    cable_fly_low: { n: 'Low-to-high cable fly', eq: ['cable'], k: 'i', r: '12–15', up: 1, t: 'Upper-chest bias; slight bend in the elbows.' },
    cable_fly: { n: 'Cable crossover (mid height)', eq: ['cable'], k: 'i', r: '12–15', t: 'Step forward so the cables stretch the chest at the start.' },
    db_fly: { n: 'Dumbbell flye', eq: ['db', 'bench'], k: 'i', r: '10–15', t: 'Stop at a comfortable deep stretch.' },

    lat_pd: { n: 'Lat pulldown', eq: ['lat_pulldown'], k: 'c', r: '8–12', t: 'Full stretch at the top; drive elbows down to your sides.' },
    assisted_pu: { n: 'Assisted pull-up', eq: ['assisted'], k: 'c', r: '6–10', t: 'Use the least assistance that keeps you in the rep range.' },
    cable_1arm_pd: { n: 'Kneeling single-arm cable pulldown', eq: ['cable'], k: 'c', r: '10–12', t: 'Reach up for a long stretch, pull elbow to hip.' },
    db_row_hip: { n: 'Dumbbell row to the hip', eq: ['db', 'bench'], k: 'c', r: '8–12', t: 'Pull toward the hip, not the chest, to bias the lats.' },
    pullover_m: { n: 'Pullover machine', eq: ['pullover'], k: 'i', r: '10–15', t: 'Big overhead stretch; one of the best lat isolations.' },
    straight_arm: { n: 'Cable straight-arm pulldown', eq: ['cable'], k: 'i', r: '12–15', t: 'Hinge slightly forward; arms nearly straight.' },
    db_pullover: { n: 'Dumbbell pullover', eq: ['db', 'bench'], k: 'i', r: '10–15', t: 'Keep ribs down; feel the lats stretch overhead.' },

    tbar: { n: 'Chest-supported T-bar row', eq: ['tbar_row'], k: 'c', r: '8–12', t: 'Chest stays on the pad; squeeze shoulder blades together.' },
    seated_row: { n: 'Seated row (machine)', eq: ['seated_row'], k: 'c', r: '8–12', t: 'Let shoulders reach forward each rep for a full stretch.' },
    cable_row: { n: 'Seated cable row', eq: ['cable'], k: 'c', r: '10–12', t: 'Tall chest, pause at the squeeze.' },
    db_cs_row: { n: 'Chest-supported dumbbell row', eq: ['db', 'bench'], k: 'c', r: '10–12', t: 'Lie face-down on an incline bench.' },
    seated_row_wide: { n: 'Seated row, wide grip (elbows out)', eq: ['seated_row'], k: 'c', r: '10–15', t: 'Upper-back and rear-delt bias.' },
    cable_row_wide: { n: 'Wide-grip cable row', eq: ['cable'], k: 'c', r: '10–15', t: 'Elbows flare out ~60°.' },
    db_1arm_row: { n: 'One-arm dumbbell row', eq: ['db', 'bench'], k: 'c', r: '8–12', t: 'Brace on the bench; full stretch at the bottom.' },

    sh_press: { n: 'Shoulder press (machine)', eq: ['shoulder_press'], k: 'c', r: '6–10', t: 'Handles start at chin height or lower.' },
    db_sh_press: { n: 'Seated dumbbell shoulder press', eq: ['db', 'bench'], k: 'c', r: '8–12', t: 'Bench nearly upright; control the descent.' },
    smith_sh: { n: 'Smith seated shoulder press', eq: ['smith', 'bench'], k: 'c', r: '6–10', t: 'Bar to chin level.' },
    cable_front: { n: 'Cable front raise', eq: ['cable'], k: 'i', r: '12–15', t: 'Raise to eye level only.' },
    db_front: { n: 'Dumbbell front raise', eq: ['db'], k: 'i', r: '12–15', t: 'No swinging.' },

    lat_raise_m: { n: 'Lateral raise machine', eq: ['lateral_raise'], k: 'i', r: '12–20', t: 'Lead with the elbows; slow lowering.' },
    cable_lat: { n: 'Cable lateral raise (cable behind body)', eq: ['cable'], k: 'i', r: '12–20', t: 'Tension stays on at the bottom of the rep.' },
    db_lat: { n: 'Dumbbell lateral raise', eq: ['db'], k: 'i', r: '12–20', t: 'Slight forward lean; stop at shoulder height.' },
    cable_y: { n: 'Cable Y-raise', eq: ['cable'], k: 'i', r: '12–20', t: 'Cross the cables; raise in a Y shape.' },
    db_lean: { n: 'Lean-away dumbbell lateral raise', eq: ['db'], k: 'i', r: '12–20', t: 'Hold a post and lean out for more stretch.' },

    rev_pec: { n: 'Reverse pec deck', eq: ['pec_fly'], k: 'i', r: '12–20', t: 'Sweep the arms wide, not back.' },
    cable_rev: { n: 'Cable reverse fly', eq: ['cable'], k: 'i', r: '12–20', t: 'Cross the cables at shoulder height.' },
    db_rear: { n: 'Chest-supported rear-delt dumbbell fly', eq: ['db', 'bench'], k: 'i', r: '12–20', t: 'Light weight, strict form.' },
    face_pull: { n: 'Cable face pull', eq: ['cable'], k: 'i', r: '12–20', t: 'Pull to the forehead, elbows high.' },

    preacher_m: { n: 'Preacher curl machine', eq: ['biceps_machine'], k: 'i', r: '8–12', t: 'Full stretch at the bottom of each rep.' },
    incline_curl: { n: 'Incline dumbbell curl', eq: ['db', 'bench'], k: 'i', r: '10–15', t: 'Arms hang behind the body for a long-length stretch.' },
    bayesian: { n: 'Bayesian cable curl (facing away)', eq: ['cable'], k: 'i', r: '10–15', t: 'Arm behind the torso; curl forward.' },
    hammer: { n: 'Dumbbell hammer curl', eq: ['db'], k: 'i', r: '10–15', t: 'Builds the brachialis and forearms.' },
    cable_curl: { n: 'Cable curl', eq: ['cable'], k: 'i', r: '10–15', t: 'Elbows stay still.' },

    oh_cable: { n: 'Overhead cable triceps extension', eq: ['cable'], k: 'i', r: '10–15', t: 'Overhead work grew the triceps ~40% more than pushdowns in research.' },
    tri_mach: { n: 'Triceps extension machine', eq: ['triceps_machine'], k: 'i', r: '8–12', t: 'Full lockout, controlled stretch.' },
    dip_assist: { n: 'Assisted dip', eq: ['assisted'], k: 'c', r: '6–12', t: 'Upright torso for triceps; go to a comfortable depth.' },
    db_oh_ext: { n: 'Seated dumbbell overhead extension', eq: ['db', 'bench'], k: 'i', r: '10–15', t: 'One dumbbell, both hands; deep stretch.' },
    pushdown: { n: 'Cable pushdown', eq: ['cable'], k: 'i', r: '10–15', t: 'Elbows pinned to your sides.' },
    db_skull: { n: 'Dumbbell skull crusher', eq: ['db', 'bench'], k: 'i', r: '10–15', t: 'Lower behind the head for more stretch.' },

    hack: { n: 'Hack squat', eq: ['hack_squat'], k: 'c', r: '6–10', t: 'Go deep; knees travel forward over the toes.' },
    pendulum: { n: 'Pendulum squat', eq: ['pendulum'], k: 'c', r: '8–12', t: 'Very quad-focused and easy on the lower back.' },
    leg_press: { n: '45° leg press', eq: ['leg_press'], k: 'c', r: '10–15', t: 'Feet low and narrow for quads; deep without the lower back lifting.' },
    smith_squat: { n: 'Smith machine squat', eq: ['smith'], k: 'c', r: '6–10', t: 'Feet slightly forward; full depth.' },
    bss: { n: 'Dumbbell Bulgarian split squat', eq: ['db', 'bench'], k: 'c', r: '8–12', t: 'Upright torso = quads; lean forward = glutes.' },
    goblet: { n: 'Dumbbell goblet squat', eq: ['db'], k: 'c', r: '10–15', t: 'Sit between the heels.' },
    leg_ext: { n: 'Leg extension', eq: ['leg_ext'], k: 'i', r: '10–15', t: 'Lean back slightly to stretch the rectus femoris.' },

    seated_curl: { n: 'Seated leg curl', eq: ['seated_curl'], k: 'i', r: '8–12', t: 'Lean forward. Grew hamstrings more than lying curls in research.' },
    lying_curl: { n: 'Lying leg curl', eq: ['lying_curl'], k: 'i', r: '10–15', t: 'Hips stay down on the pad.' },
    db_rdl: { n: 'Dumbbell Romanian deadlift', eq: ['db'], k: 'c', r: '8–12', t: 'Push hips back to a deep hamstring stretch; neutral spine.' },
    smith_rdl: { n: 'Smith machine Romanian deadlift', eq: ['smith'], k: 'c', r: '8–10', t: 'Bar slides down the thighs; soft knees.' },
    back_ext_ham: { n: '45° back extension (hamstring bias)', eq: ['back_ext'], k: 'c', r: '10–15', t: 'Hinge at the hips, keep the back flat.' },

    hip_thrust_m: { n: 'Hip thrust machine', eq: ['hip_thrust'], k: 'c', r: '8–12', t: 'Chin tucked; pause 1 s at the top.' },
    smith_thrust: { n: 'Smith machine hip thrust', eq: ['smith', 'bench'], k: 'c', r: '8–12', t: 'Upper back on the bench; full lockout.' },
    db_thrust: { n: 'Dumbbell hip thrust', eq: ['db', 'bench'], k: 'c', r: '10–15', t: 'Heavy dumbbell on the hips; pause at the top.' },
    abductor: { n: 'Hip abductor (lean forward)', eq: ['abductor'], k: 'i', r: '12–20', t: 'Leaning forward hits the upper glutes.' },
    kickback_m: { n: 'Glute kickback machine', eq: ['glute_kickback'], k: 'i', r: '10–15', t: 'Drive through the heel; no lower-back arching.' },
    cable_kick: { n: 'Cable glute kickback', eq: ['cable'], k: 'i', r: '12–15', t: 'Slight forward lean; kick back and out.' },
    back_ext_glute: { n: '45° back extension (glute bias)', eq: ['back_ext'], k: 'c', r: '10–15', t: 'Toes out, round the upper back, squeeze glutes.' },

    stand_calf: { n: 'Standing calf raise', eq: ['standing_calf'], k: 'i', r: '8–15', t: 'Pause 2 s in the deepest stretch.' },
    lp_calf: { n: 'Leg press calf raise', eq: ['leg_press'], k: 'i', r: '10–15', t: 'Full stretch at the bottom.' },
    smith_calf: { n: 'Smith calf raise (toes on a plate)', eq: ['smith'], k: 'i', r: '10–15', t: 'Slow, full range.' },
    db_calf: { n: 'Single-leg dumbbell calf raise', eq: ['db'], k: 'i', r: '10–15', t: 'Stand on a step for full range.' },
    seated_calf: { n: 'Seated calf raise', eq: ['seated_calf'], k: 'i', r: '12–20', t: 'Targets the soleus.' },

    ab_mach: { n: 'Ab crunch machine', eq: ['ab_crunch'], k: 'i', r: '10–15', t: 'Curl the spine; exhale hard.' },
    cable_crunch: { n: 'Cable crunch', eq: ['cable'], k: 'i', r: '10–15', t: 'Hips stay still; ribs to pelvis.' },
    knee_raise: { n: "Captain's chair leg raise", eq: ['captains_chair'], k: 'i', r: '10–15', t: 'Curl the pelvis up, no swinging.' },
    db_crunch: { n: 'Weighted crunch (dumbbell)', eq: ['db'], k: 'i', r: '12–20', t: 'Hold the dumbbell on your chest.' },
  };

  // Ranked choices per muscle: p = main movement, s = second movement.
  const LISTS = {
    chest: { p: ['incline_mach', 'chest_press', 'db_incline', 'smith_incline', 'db_flat'], s: ['pec_fly', 'cable_fly', 'cable_fly_low', 'db_fly'] },
    lats: { p: ['lat_pd', 'assisted_pu', 'cable_1arm_pd', 'db_row_hip'], s: ['pullover_m', 'straight_arm', 'db_pullover'] },
    upperBack: { p: ['tbar', 'seated_row', 'cable_row', 'db_cs_row'], s: ['seated_row_wide', 'cable_row_wide', 'db_1arm_row'] },
    frontDelts: { p: ['sh_press', 'db_sh_press', 'smith_sh'], s: ['cable_front', 'db_front'] },
    sideDelts: { p: ['lat_raise_m', 'cable_lat', 'db_lat'], s: ['cable_y', 'db_lean', 'db_lat'] },
    rearDelts: { p: ['rev_pec', 'cable_rev', 'db_rear'], s: ['face_pull', 'db_rear'] },
    biceps: { p: ['preacher_m', 'incline_curl', 'bayesian'], s: ['hammer', 'cable_curl', 'incline_curl'] },
    triceps: { p: ['oh_cable', 'tri_mach', 'db_oh_ext', 'dip_assist'], s: ['pushdown', 'dip_assist', 'db_skull'] },
    quads: { p: ['hack', 'pendulum', 'leg_press', 'smith_squat', 'bss', 'goblet'], s: ['leg_ext', 'bss', 'leg_press'] },
    hamstrings: { p: ['seated_curl', 'lying_curl', 'db_rdl'], s: ['db_rdl', 'smith_rdl', 'back_ext_ham', 'lying_curl'] },
    glutes: { p: ['hip_thrust_m', 'smith_thrust', 'db_thrust', 'bss'], s: ['abductor', 'kickback_m', 'cable_kick', 'back_ext_glute'] },
    calves: { p: ['stand_calf', 'lp_calf', 'smith_calf', 'db_calf'], s: ['seated_calf', 'db_calf'] },
    abs: { p: ['ab_mach', 'cable_crunch', 'knee_raise', 'db_crunch'], s: ['knee_raise', 'cable_crunch', 'db_crunch'] },
  };

  // ---------------------------------------------------------------- Muscles & volume
  const MUSCLES = [
    ['chest', 'Chest'], ['lats', 'Lats (width)'], ['upperBack', 'Upper back'], ['quads', 'Quads'],
    ['hamstrings', 'Hamstrings'], ['glutes', 'Glutes'], ['frontDelts', 'Front delts'], ['sideDelts', 'Side delts'],
    ['rearDelts', 'Rear delts'], ['triceps', 'Triceps'], ['biceps', 'Biceps'], ['calves', 'Calves'], ['abs', 'Abs'],
  ];
  const MUSCLE_LABEL = Object.fromEntries(MUSCLES);
  const ORDER = Object.fromEntries(MUSCLES.map((m, i) => [m[0], i]));
  const WEAK_OPTIONS = [['chest', 'Chest'], ['upperChest', 'Upper chest'], ...MUSCLES.slice(1)];

  // Direct hard sets per week by experience [beginner, intermediate, advanced]
  const BASE_SETS = {
    chest: [10, 12, 14], lats: [8, 10, 12], upperBack: [8, 10, 12], quads: [10, 12, 14], hamstrings: [8, 10, 12],
    glutes: [4, 6, 8], frontDelts: [0, 0, 0], sideDelts: [8, 10, 14], rearDelts: [4, 6, 8], triceps: [6, 8, 10],
    biceps: [6, 8, 10], calves: [6, 8, 10], abs: [4, 6, 6],
  };
  const WEAK_FRONT = [6, 8, 10];
  const WEAK_BONUS = [4, 6, 6];
  const EXP_IDX = { beg: 0, int: 1, adv: 2 };

  const UP = ['chest', 'lats', 'upperBack', 'frontDelts', 'sideDelts', 'rearDelts', 'biceps', 'triceps'];
  const LOW = ['quads', 'hamstrings', 'glutes', 'calves', 'abs'];
  const PUSH = ['chest', 'frontDelts', 'sideDelts', 'triceps'];
  const PULL = ['lats', 'upperBack', 'rearDelts', 'biceps'];
  const FULL = [...UP, ...LOW];
  const SPLITS = {
    2: { name: 'Full body ×2', why: 'Every muscle 2× per week in two longer sessions.',
      days: [['Full body A', 'Mon', FULL], ['Full body B', 'Thu', FULL]] },
    3: { name: 'Full body ×3', why: 'Every muscle 3× per week — ideal when you can only train three days.',
      days: [['Full body A', 'Mon', FULL], ['Full body B', 'Wed', FULL], ['Full body C', 'Fri', FULL]] },
    4: { name: 'Upper / Lower', why: 'Every muscle 2× per week with short, focused sessions.',
      days: [['Upper A', 'Mon', UP], ['Lower A', 'Tue', LOW], ['Upper B', 'Thu', UP], ['Lower B', 'Fri', LOW]] },
    5: { name: 'Upper / Lower / Push / Pull / Legs', why: 'Every muscle 2× per week with more room for extra weak-point volume.',
      days: [['Upper', 'Mon', UP], ['Lower', 'Tue', LOW], ['Push', 'Thu', PUSH], ['Pull', 'Fri', PULL], ['Legs', 'Sat', LOW]] },
    6: { name: 'Push / Pull / Legs ×2', why: 'Every muscle 2× per week; highest volume capacity for advanced lifters.',
      days: [['Push A', 'Mon', PUSH], ['Pull A', 'Tue', [...PULL, 'abs']], ['Legs A', 'Wed', LOW], ['Push B', 'Thu', PUSH], ['Pull B', 'Fri', [...PULL, 'abs']], ['Legs B', 'Sat', LOW]] },
  };

  const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const DEFAULT_DAYS = { 2: ['Mon', 'Thu'], 3: ['Mon', 'Wed', 'Fri'], 4: ['Mon', 'Tue', 'Thu', 'Fri'], 5: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'], 6: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };

  // ---------------------------------------------------------------- Cardio
  // Treadmill uses the ACSM walking/running equations (speed + incline); other machines use Compendium METs.
  const CARDIO_TYPES = {
    treadmill: { n: 'Treadmill', tread: true },
    bike: { n: 'Stationary bike', met: [4.0, 6.8, 8.8] },
    elliptical: { n: 'Elliptical', met: [4.6, 5.5, 7.0] },
    stair: { n: 'Stair climber', met: [6.5, 8.8, 10.5] },
    rower: { n: 'Rowing machine', met: [4.8, 7.0, 8.5] },
  };
  const LEVELS = ['Easy', 'Moderate', 'Hard'];
  const KMH_PER_MPH = 1.609344;

  function cardioInfo(c, kg) {
    const t = CARDIO_TYPES[c.type] || CARDIO_TYPES.treadmill;
    let met, name;
    if (t.tread) {
      const S = c.speedKmh * 1000 / 60, G = (c.incline || 0) / 100; // metres per minute, grade
      const run = c.speedKmh > 6.5;
      const vo2 = run ? 0.2 * S + 0.9 * S * G + 3.5 : 0.1 * S + 1.8 * S * G + 3.5;
      met = vo2 / 3.5;
      name = run ? 'Treadmill run' : (c.incline >= 3 ? 'Incline walk' : 'Treadmill walk');
    } else {
      met = t.met[c.level ?? 1];
      name = `${t.n} (${LEVELS[c.level ?? 1].toLowerCase()})`;
    }
    const kcal = Math.max(0, (met - 1) * 3.5 * kg / 200 * c.min); // calories above resting
    return { met, kcal, name, vigorous: met >= 6 };
  }

  // ---------------------------------------------------------------- DOM helpers
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const r0 = n => Math.round(n);
  const r5 = n => Math.round(n / 5) * 5;
  const fmt = n => r0(n).toLocaleString('en-US');

  function toast(msg) {
    const t = $('toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 2200);
  }

  // ---------------------------------------------------------------- Build form pieces
  function buildWeakChips() {
    $('weak-list').innerHTML = WEAK_OPTIONS.map(([id, label]) =>
      `<label class="chip"><input type="checkbox" id="weak-${id}" value="${id}"><span>${esc(label)}</span></label>`).join('');
  }
  function buildDayChips() {
    $('day-list').innerHTML = WEEK.map(d =>
      `<label class="chip day"><input type="checkbox" id="day-${d}" value="${d}"${DEFAULT_DAYS[4].includes(d) ? ' checked' : ''}><span>${d}</span></label>`).join('');
  }
  function setTrainDays(list) {
    document.querySelectorAll('#day-list input').forEach(i => { i.checked = list.includes(i.value); });
  }

  function speedOut(kmh, units) { return units === 'imperial' ? (kmh / KMH_PER_MPH).toFixed(1) : kmh.toFixed(1); }
  function renderCardioRows(list, units) {
    const opt = (v, label, sel) => `<option value="${v}"${v === sel ? ' selected' : ''}>${esc(label)}</option>`;
    $('cardio-list').innerHTML = list.map((c, i) => {
      const t = CARDIO_TYPES[c.type] || CARDIO_TYPES.treadmill;
      const extra = t.tread
        ? `<div class="field"><label for="c-speed-${i}">Speed (${units === 'imperial' ? 'mph' : 'km/h'})</label><input id="c-speed-${i}" data-k="speed" type="number" min="1" max="25" step="0.1" value="${speedOut(c.speedKmh, units)}"></div>
           <div class="field"><label for="c-inc-${i}">Incline (%)</label><input id="c-inc-${i}" data-k="incline" type="number" min="0" max="15" step="0.5" value="${c.incline}"></div>`
        : `<div class="field span2c"><label for="c-lvl-${i}">Intensity</label><select id="c-lvl-${i}" data-k="level">${LEVELS.map((l, k) => opt(String(k), l, String(c.level ?? 1))).join('')}</select></div>`;
      return `<div class="cardio-row" data-i="${i}">
        <div class="field"><label for="c-day-${i}">Day</label><select id="c-day-${i}" data-k="day">${WEEK.map(d => opt(d, d, c.day)).join('')}</select></div>
        <div class="field span2c"><label for="c-type-${i}">Machine</label><select id="c-type-${i}" data-k="type">${Object.entries(CARDIO_TYPES).map(([k, v]) => opt(k, v.n, c.type)).join('')}</select></div>
        <div class="field"><label for="c-min-${i}">Minutes</label><input id="c-min-${i}" data-k="min" type="number" min="5" max="180" step="5" value="${c.min}"></div>
        ${extra}
        <div class="cardio-foot"><span class="c-est" id="c-est-${i}"></span><button type="button" class="btn small ghost c-del">Remove</button></div>
      </div>`;
    }).join('');
    $('cardio-empty').hidden = list.length > 0;
  }
  function readCardio(units) {
    return [...document.querySelectorAll('#cardio-list .cardio-row')].map(row => {
      const get = k => row.querySelector(`[data-k="${k}"]`);
      const f = (k, d) => { const el = get(k); const v = el ? parseFloat(el.value) : NaN; return Number.isFinite(v) ? v : d; };
      let speedKmh = f('speed', 5);
      if (get('speed') && units === 'imperial') speedKmh *= KMH_PER_MPH;
      return {
        day: get('day').value, type: get('type').value, min: Math.max(0, f('min', 30)),
        speedKmh: Math.min(30, Math.max(1, speedKmh)), incline: Math.min(20, Math.max(0, f('incline', 0))),
        level: get('level') ? +get('level').value : 1,
      };
    });
  }

  function buildEquipment() {
    $('equip-list').innerHTML = EQUIPMENT.map(g => `<div class="eq-group"><h4>${esc(g.group)}</h4>${
      g.items.map(([id, label]) => `<label class="eq-item"><input type="checkbox" id="eq-${id}" value="${id}" checked>${esc(label)}</label>`).join('')}</div>`).join('');
  }

  // ---------------------------------------------------------------- State
  function readState() {
    const units = $('units').value;
    const num = id => { const v = parseFloat($(id).value); return Number.isFinite(v) ? v : null; };
    let weightKg = num('weight') ?? 80;
    if (units === 'imperial') weightKg = weightKg * 0.45359237;
    const heightCm = units === 'imperial'
      ? ((num('height-ft') ?? 5) * 12 + (num('height-in') ?? 10)) * 2.54
      : (num('height-cm') ?? 178);
    const trainDays = WEEK.filter(d => $('day-' + d).checked);
    return {
      cardio: readCardio(units),
      name: $('name').value.trim(),
      sex: $('sex').value, age: num('age') ?? 25, units, weightKg, heightCm,
      weightRaw: num('weight'), heightCmRaw: num('height-cm'), heightFt: num('height-ft'), heightIn: num('height-in'),
      bf: num('bf'), exp: $('exp').value, style: $('style').value, trainDays, days: trainDays.length, session: +$('session').value,
      double: $('double').value, pmSession: +$('pm-session').value,
      trainMin: +$('session').value + ($('double').value !== 'off' ? +$('pm-session').value : 0),
      activity: +$('activity').value,
      goal: document.querySelector('input[name="goal"]:checked').value,
      rate: +$('rate').value, goalBf: num('goal-bf'),
      weak: [...document.querySelectorAll('#weak-list input:checked')].map(i => i.value),
      equip: [...document.querySelectorAll('#equip-list input:checked')].map(i => i.value),
    };
  }

  function writeState(s) {
    const set = (id, v) => { if (v !== undefined && v !== null && $(id)) $(id).value = v; };
    set('name', s.name || ''); set('sex', s.sex); set('age', s.age); set('units', s.units);
    set('weight', s.weightRaw); set('height-cm', s.heightCmRaw); set('height-ft', s.heightFt); set('height-in', s.heightIn);
    $('bf').value = s.bf ?? ''; set('exp', s.exp); set('style', s.style || 'std'); set('session', s.session);
    set('activity', s.activity); set('rate', s.rate); set('double', s.double || 'off'); set('pm-session', s.pmSession); $('goal-bf').value = s.goalBf ?? '';
    if (s.goal && $('goal-' + s.goal)) $('goal-' + s.goal).checked = true;
    document.querySelectorAll('#weak-list input').forEach(i => { i.checked = (s.weak || []).includes(i.value); });
    setTrainDays(Array.isArray(s.trainDays) && s.trainDays.length ? s.trainDays : (DEFAULT_DAYS[s.days] || DEFAULT_DAYS[4]));
    renderCardioRows(Array.isArray(s.cardio) ? s.cardio : [], s.units || 'metric');
    if (Array.isArray(s.equip)) document.querySelectorAll('#equip-list input').forEach(i => { i.checked = s.equip.includes(i.value); });
  }

  // ---------------------------------------------------------------- Nutrition
  function nutrition(p) {
    const kg = p.weightKg;
    const lbm = p.bf ? kg * (1 - p.bf / 100) : null;
    const mifflin = 10 * kg + 6.25 * p.heightCm - 5 * p.age + (p.sex === 'm' ? 5 : -161);
    const bmr = lbm ? 370 + 21.6 * lbm : mifflin;
    const method = lbm ? 'Katch–McArdle (uses your lean mass)' : 'Mifflin–St Jeor';
    const factor = p.activity + 0.03 * p.days * Math.min(1.6, Math.max(0.6, p.trainMin / 75));
    const cardioWeek = p.cardio.reduce((a, c) => a + cardioInfo(c, kg).kcal, 0);
    const cardioDay = cardioWeek / 7;
    const tdee = bmr * factor + cardioDay;
    const exKcalDay = p.days * p.trainMin * 5 / 7 + cardioDay; // ~5 kcal per minute of lifting + cardio, averaged over the week
    const e = EXP_IDX[p.exp];
    const highBf = p.bf && ((p.sex === 'm' && p.bf > 25) || (p.sex === 'f' && p.bf > 33));
    const warnings = [];
    let target, ratePct, weeklyKg, label;

    if (p.goal === 'cut') {
      ratePct = -p.rate;
      weeklyKg = kg * p.rate / 100;
      target = tdee - weeklyKg * 7700 / 7;
      label = `Lose about ${p.rate}% of body weight per week`;
      if (lbm) {
        const floor = 30 * lbm + exKcalDay;
        if (target < floor) {
          if (floor - target > 50) warnings.push({ bad: false, t: 'Calories raised to protect your hormones and muscle', d: `Eating ${fmt(target)} kcal would leave less than 30 kcal per kg of lean mass after training (low energy availability). The target was raised to ${fmt(floor)} kcal, so fat loss will be a little slower.` });
          target = floor;
          weeklyKg = (tdee - target) * 7 / 7700;
          ratePct = -(weeklyKg / kg * 100);
        }
      }
      if (p.rate >= 1 && p.bf && ((p.sex === 'm' && p.bf < 12) || (p.sex === 'f' && p.bf < 20))) {
        warnings.push({ bad: true, t: 'Fast cut at low body fat', d: 'When you are already lean, 1%/week risks losing muscle. 0.5–0.75%/week keeps more of it.' });
      }
    } else if (p.goal === 'bulk') {
      const surplus = [0.15, 0.10, 0.06][e];
      target = tdee * (1 + surplus);
      ratePct = [0.5, 0.35, 0.2][e];
      weeklyKg = kg * ratePct / 100;
      label = `Gain about ${ratePct}% of body weight per week`;
      if (highBf) warnings.push({ bad: true, t: 'Consider cutting or maingaining first', d: 'At your body-fat level, a bulk adds mostly fat and lowers insulin sensitivity. A cut or maingain will improve how you look and how you gain later.' });
    } else {
      target = tdee + [150, 100, 75][e];
      ratePct = [0.25, 0.15, 0.1][e];
      weeklyKg = kg * ratePct / 100;
      label = 'Slow gain — muscle with very little fat';
    }
    const absFloor = p.sex === 'm' ? 1500 : 1200;
    if (target < absFloor) { target = absFloor; warnings.push({ bad: true, t: 'Very low intake', d: `Calories were set to the minimum of ${absFloor} kcal. Talk to a doctor or dietitian before eating less.` }); }
    target = Math.round(target / 10) * 10;

    let protein;
    if (p.goal === 'cut') protein = lbm ? 2.6 * lbm : (highBf ? 1.8 : 2.2) * kg;
    else if (lbm && highBf) protein = 2.4 * lbm;
    else protein = (p.goal === 'bulk' ? 1.8 : 2.0) * kg;
    protein = r5(protein);

    const minFat = (p.goal === 'cut' ? 0.5 : 0.7) * kg;
    let fat = Math.max(minFat, (p.goal === 'cut' ? 0.22 : 0.27) * target / 9);
    let carbs = (target - protein * 4 - fat * 9) / 4;
    if (carbs < 1.5 * kg) { fat = minFat; carbs = (target - protein * 4 - fat * 9) / 4; }
    fat = r5(fat); carbs = Math.max(0, r5(carbs));

    const ea = lbm ? (target - exKcalDay) / lbm : null;
    let cutPlan = null;
    if (p.goal === 'cut' && lbm && p.goalBf && p.goalBf < p.bf) {
      const goalW = lbm / (1 - p.goalBf / 100);
      const toLose = kg - goalW;
      const weeks = toLose / Math.max(weeklyKg, 0.05);
      const breaks = Math.floor(weeks / 6);
      cutPlan = { goalW, toLose, weeks: Math.ceil(weeks), breaks, total: Math.ceil(weeks) + breaks };
      if (cutPlan.total > 20) warnings.push({ bad: false, t: 'Long cut ahead', d: 'Split it into blocks of 12–16 weeks with 4–8 weeks at maintenance in between.' });
    }
    const meals = 4;
    return { kg, lbm, bmr, method, factor, tdee, cardioDay, cardioWeek, target, protein, fat, carbs, ratePct, weeklyKg, label, warnings, ea,
      fibre: r0(target * 14 / 1000), perMeal: r5(Math.min(protein / meals, Math.max(0.4 * kg, 25))), meals, cutPlan,
      waterRest: 0.035 * kg, waterTrain: 0.035 * kg + 0.75 * p.trainMin / 60 };
  }

  // ---------------------------------------------------------------- Training plan
  function weeklySets(p) {
    const e = EXP_IDX[p.exp];
    const weak = new Set(p.weak.map(w => w === 'upperChest' ? 'chest' : w));
    const out = {};
    for (const [m] of MUSCLES) {
      let s = BASE_SETS[m][e];
      if (weak.has(m)) s = m === 'frontDelts' ? WEAK_FRONT[e] : s + WEAK_BONUS[e];
      else if (p.goal === 'cut' && s > 0) s = Math.max(2, Math.round(s * 0.85));
      out[m] = s;
    }
    return { sets: out, weak };
  }

  const SMALL = new Set(['frontDelts', 'sideDelts', 'rearDelts', 'biceps', 'triceps', 'calves', 'abs']);

  function buildPlan(p) {
    const { sets, weak } = weeklySets(p);
    const split = SPLITS[p.days];
    const mode = p.double || 'off'; // off | split | small
    const sb = p.style === 'sb'; // science-based: 2 all-out sets per exercise
    const setMin = sb ? 2.8 : 2.4; // minutes per set incl. rest
    const upperEmph = p.weak.includes('upperChest');
    const have = new Set(p.equip);
    const usable = id => EX[id].eq.every(q => have.has(q));
    const sessions = split.days.map(([name], i) => ({ name, day: p.trainDays[i], muscles: {} }));
    // useful hard sets per muscle per session; splitting a day in two allows a little more per day
    const cap = m => (weak.has(m) ? 8 : 6) + (mode === 'split' ? 3 : 0);
    // never trim a muscle below this many hard sets per week (maintenance-level volume)
    const WEEK_MIN = { chest: 6, lats: 6, upperBack: 6, quads: 6, hamstrings: 6, glutes: 4, frontDelts: 0, sideDelts: 6, rearDelts: 4, triceps: 4, biceps: 4, calves: 4, abs: 2 };
    const lost = [];

    // 1) spread each muscle's weekly sets across the days it appears
    for (const [m] of MUSCLES) {
      const total = sets[m];
      if (!total) continue;
      const where = split.days.map((d, i) => d[2].includes(m) ? i : -1).filter(i => i >= 0);
      if (!where.length) continue;
      const n = Math.min(where.length, Math.max(1, Math.floor(total / 2)));
      const chosen = [...new Set(Array.from({ length: n }, (_, i) => where[Math.round(i * where.length / n)] ?? where[where.length - 1]))];
      chosen.forEach((si, i) => {
        let s = Math.floor(total / chosen.length) + (i < total % chosen.length ? 1 : 0);
        if (s > cap(m)) { lost.push(m); s = cap(m); }
        sessions[si].muscles[m] = s;
      });
    }

    // 2) trim non-priority sets until every session fits its time limit
    //    off: one session per day · small: small muscles move to an evening session · split: the day's volume is shared by two sessions
    const partOf = m => (mode === 'small' && SMALL.has(m)) ? 'pm' : 'am';
    const units = [];
    for (const sess of sessions) {
      if (mode === 'split') units.push({ sess, part: 'all', limit: p.session + p.pmSession, warm: 16 });
      else {
        units.push({ sess, part: 'am', limit: p.session, warm: 8 });
        if (mode === 'small') units.push({ sess, part: 'pm', limit: p.pmSession, warm: 5 });
      }
    }
    const inUnit = (u, m) => u.part === 'all' || partOf(m) === u.part;
    const unitSets = u => Object.entries(u.sess.muscles).filter(([m]) => inUnit(u, m)).reduce((a, [, s]) => a + s, 0);
    const unitMin = u => unitSets(u) ? u.warm + unitSets(u) * setMin : 0;
    let trimmed = false;
    const weekTotal = m => sessions.reduce((a, s) => a + (s.muscles[m] || 0), 0);
    const stuck = new Set();
    for (let guard = 0; guard < 600; guard++) {
      // always work on the session that is furthest over its limit
      const u = units.filter(x => !stuck.has(x) && unitMin(x) > x.limit).sort((a, b) => (unitMin(b) - b.limit) - (unitMin(a) - a.limit))[0];
      if (!u) break;
      // drop one set (or a whole 2-set slot) from the non-priority muscle furthest above its weekly minimum
      const cands = Object.entries(u.sess.muscles)
        .filter(([m, s]) => inUnit(u, m) && !weak.has(m) && s > 0)
        .map(([m, s]) => ({ m, s, cut: s > 2 ? 1 : s, room: weekTotal(m) - WEEK_MIN[m] }))
        .filter(c => c.room >= c.cut)
        .sort((a, b) => b.room - a.room || b.s - a.s);
      if (!cands.length) { stuck.add(u); continue; }
      const c = cands[0];
      u.sess.muscles[c.m] -= c.cut;
      if (!u.sess.muscles[c.m]) delete u.sess.muscles[c.m];
      trimmed = true;
    }

    // 3) pick exercises
    const occ = {};
    const missing = new Set();
    const fewEx = new Set();
    for (const sess of sessions) {
      const used = new Set();
      const items = [];
      for (const [m, s] of Object.entries(sess.muscles)) {
        if (!s) continue;
        const o = occ[m] = (occ[m] ?? -1) + 1;
        let parts;
        if (sb) {
          // even number of sets, 2 per exercise (round priority muscles up, others down)
          const even = s % 2 ? (weak.has(m) ? s + 1 : Math.max(2, s - 1)) : s;
          parts = Array(even / 2).fill(2);
        } else {
          parts = s <= 4 ? [s] : s <= 8 ? [Math.ceil(s / 2), Math.floor(s / 2)] : [Math.ceil(s / 3), Math.ceil((s - Math.ceil(s / 3)) / 2), s - Math.ceil(s / 3) - Math.ceil((s - Math.ceil(s / 3)) / 2)];
        }
        const roles = ['p', 's', 'p2'];
        parts.forEach((ps, j) => {
          const L = LISTS[m];
          let list;
          if (sb) { const k = j >> 1; list = j % 2 === 0 ? [...L.p.slice(k), ...L.p, ...L.s] : [...L.s.slice(k), ...L.s, ...L.p]; }
          else list = roles[j] === 's' ? [...L.s, ...L.p] : roles[j] === 'p2' ? [...L.p.slice(1), ...L.s] : [...L.p, ...L.s];
          list = [...new Set(list)].filter(usable);
          if (m === 'chest' && upperEmph) list.sort((a, b) => (EX[b].up || 0) - (EX[a].up || 0));
          const free = list.filter(id => !used.has(id));
          if (!free.length) {
            if (!list.length) { missing.add(m); return; }
            if (sb) { fewEx.add(m); return; } // science-based keeps exactly 2 sets per exercise: drop the extra sets
            const last = [...items].reverse().find(x => x.m === m); // ran out of different exercises: add the sets to the last one
            if (last) last.sets += ps;
            return;
          }
          const pick = free[o % Math.min(2, free.length)];
          used.add(pick);
          items.push({ m, id: pick, sets: ps, weak: weak.has(m), j });
        });
      }
      items.sort((a, b) =>
        (b.weak - a.weak) || ((a.weak && b.weak) ? 0 : (EX[a.id].k === 'c' ? 0 : 1) - (EX[b.id].k === 'c' ? 0 : 1)) || (ORDER[a.m] - ORDER[b.m]) || (a.j - b.j));

      // 4) morning / evening
      sess.am = []; sess.pm = [];
      if (mode === 'small') items.forEach(it => sess[partOf(it.m)].push(it));
      else if (mode === 'split') {
        const total = items.reduce((a, b) => a + b.sets, 0);
        const target = total * p.session / (p.session + p.pmSession);
        let amSets = 0, toPm = false;
        for (const it of items) {
          if (!toPm && (amSets === 0 || amSets + it.sets <= target + 1)) { sess.am.push(it); amSets += it.sets; }
          else { toPm = true; sess.pm.push(it); }
        }
      } else sess.am = items;
      const setsOf = arr => arr.reduce((a, b) => a + b.sets, 0);
      sess.items = items;
      sess.amSets = setsOf(sess.am); sess.pmSets = setsOf(sess.pm);
      sess.amMin = sess.amSets ? Math.round(8 + sess.amSets * setMin) : 0;
      sess.pmMin = sess.pmSets ? Math.round((mode === 'small' ? 5 : 8) + sess.pmSets * setMin) : 0;
      sess.totalSets = sess.amSets + sess.pmSets;
      sess.minutes = sess.amMin + sess.pmMin;
    }
    const finalSets = {};
    for (const sess of sessions) for (const it of sess.items) finalSets[it.m] = (finalSets[it.m] || 0) + it.sets;
    const overTime = [];
    for (const sess of sessions) {
      if (mode === 'split') { if (sess.minutes > p.session + p.pmSession + 2) overTime.push(sess.name); }
      else {
        if (sess.amMin > p.session + 2) overTime.push(sess.name);
        if (sess.pmMin > p.pmSession + 2) overTime.push(sess.name + ' (evening)');
      }
    }
    return { split, mode, sessions, finalSets, weak, trimmed, overTime, fewEx: [...fewEx], lost: [...new Set(lost)], missing: [...missing] };
  }

  // ---------------------------------------------------------------- Render
  function wUnit(p, kg, digits = 1) {
    return p.units === 'imperial' ? `${(kg / 0.45359237).toFixed(digits)} lb` : `${kg.toFixed(digits)} kg`;
  }

  function renderNutrition(p, n) {
    const who = p.name ? `${esc(p.name)}'s` : 'Your';
    const goalName = { cut: 'Cut', main: 'Maingain', bulk: 'Bulk' }[p.goal];
    const pk = n.protein * 4, ck = n.carbs * 4, fk = n.fat * 9, tot = pk + ck + fk || 1;
    const sign = n.ratePct < 0 ? '−' : '+';
    const warn = n.warnings.map(w => `<div class="callout${w.bad ? ' bad' : ''}"><b>${esc(w.t)}</b>${esc(w.d)}</div>`).join('');
    const cut = n.cutPlan ? `
      <div class="callout"><b>How long to cut</b>
        Goal weight at ${p.goalBf}% body fat ≈ <b style="display:inline">${wUnit(p, n.cutPlan.goalW)}</b> (lose ≈ ${wUnit(p, n.cutPlan.toLose)}).
        At this rate that takes about <b style="display:inline">${n.cutPlan.weeks} weeks</b>${n.cutPlan.breaks ? `, plus ${n.cutPlan.breaks} one-week diet break${n.cutPlan.breaks > 1 ? 's' : ''} at maintenance = <b style="display:inline">${n.cutPlan.total} weeks</b> total` : ''}.
      </div>` : '';
    return `
      <div class="split-head"><h2>${who} ${goalName} targets</h2><p>${esc(n.label)}</p></div>
      <div class="kpis">
        <div class="kpi" style="--c:var(--ink)"><div class="k">Calories / day</div><div class="v">${fmt(n.target)}</div><div class="u">kcal · maintenance ≈ ${fmt(n.tdee)}</div></div>
        <div class="kpi" style="--c:var(--red)"><div class="k">Protein</div><div class="v">${n.protein}<span class="u"> g</span></div><div class="u">${(n.protein / n.kg).toFixed(1)} g/kg body weight</div></div>
        <div class="kpi" style="--c:var(--accent)"><div class="k">Carbs</div><div class="v">${n.carbs}<span class="u"> g</span></div><div class="u">${(n.carbs / n.kg).toFixed(1)} g/kg</div></div>
        <div class="kpi" style="--c:var(--yellow)"><div class="k">Fat</div><div class="v">${n.fat}<span class="u"> g</span></div><div class="u">${(n.fat / n.kg).toFixed(1)} g/kg</div></div>
      </div>
      <div>
        <div class="macrobar" role="img" aria-label="Calories from protein ${r0(pk / tot * 100)}%, carbs ${r0(ck / tot * 100)}%, fat ${r0(fk / tot * 100)}%">
          <div style="width:${pk / tot * 100}%;background:var(--red)"></div><div style="width:${ck / tot * 100}%;background:var(--accent)"></div><div style="width:${fk / tot * 100}%;background:var(--yellow)"></div>
        </div>
        <div class="legend" style="margin-top:6px"><span><i style="background:var(--red)"></i>Protein ${r0(pk / tot * 100)}%</span><span><i style="background:var(--accent)"></i>Carbs ${r0(ck / tot * 100)}%</span><span><i style="background:var(--yellow)"></i>Fat ${r0(fk / tot * 100)}%</span></div>
      </div>
      ${warn}${cut}
      <div class="cols">
        <div class="tbl-wrap"><table>
          <thead><tr><th>Daily target</th><th>Amount</th></tr></thead>
          <tbody>
            <tr><td>Expected change</td><td class="num">${sign}${wUnit(p, Math.abs(n.weeklyKg), 2)} / week (${sign}${Math.abs(n.ratePct).toFixed(2)}%)</td></tr>
            <tr><td>Protein per meal (${n.meals} meals)</td><td class="num">≈ ${n.perMeal} g</td></tr>
            <tr><td>Fibre</td><td class="num">${n.fibre} g</td></tr>
            <tr><td>Water — rest / training day</td><td class="num">${n.waterRest.toFixed(1)} / ${n.waterTrain.toFixed(1)} L</td></tr>
            <tr><td>Sodium</td><td class="num">≈ 2.3 g + 0.5–1 g per hour of heavy sweat</td></tr>
            <tr><td>Potassium</td><td class="num">${p.sex === 'm' ? '3.4' : '2.6'} g+ (fruit, veg, potatoes)</td></tr>
            <tr><td>Creatine monohydrate</td><td class="num">3–5 g every day</td></tr>
          </tbody></table></div>
        <div class="tbl-wrap"><table>
          <thead><tr><th>How it was calculated</th><th></th></tr></thead>
          <tbody>
            <tr><td>Resting burn (BMR)</td><td class="num">${fmt(n.bmr)} kcal</td></tr>
            <tr><td>Formula</td><td>${esc(n.method)}</td></tr>
            <tr><td>Activity multiplier</td><td class="num">× ${n.factor.toFixed(2)}</td></tr>
            ${n.cardioWeek ? `<tr><td>Cardio (${fmt(n.cardioWeek)} kcal/week)</td><td class="num">+ ${fmt(n.cardioDay)} kcal/day</td></tr>` : ''}
            <tr><td>Maintenance (TDEE)</td><td class="num">${fmt(n.tdee)} kcal</td></tr>
            ${n.lbm ? `<tr><td>Lean body mass</td><td class="num">${wUnit(p, n.lbm)}</td></tr>` : ''}
            ${n.ea ? `<tr><td>Energy availability</td><td class="num">${n.ea.toFixed(0)} kcal/kg lean${n.ea < 30 ? ' — low' : ''}</td></tr>` : ''}
          </tbody></table></div>
      </div>
      <div class="cols">
        <div><h3>Weekly check-in</h3><ul class="tight">
          <li>Weigh every morning after the toilet; compare <b>weekly averages</b>, not single days.</li>
          <li>${p.goal === 'cut' ? 'Losing slower than target for 2 weeks → cut 100–150 kcal (mostly carbs/fat) or add 2,000 steps.' : 'Gaining slower than target for 2–3 weeks → add 100–150 kcal.'}</li>
          <li>${p.goal === 'cut' ? 'Losing faster than target or strength dropping → add 100–150 kcal.' : 'Gaining faster than target or waist growing quickly → remove 100–150 kcal.'}</li>
          <li>Measure your waist at the navel weekly and take photos monthly.</li>
        </ul></div>
        <div><h3>Habits that matter</h3><ul class="tight">
          <li>Sleep 7–9 hours; no caffeine within ~9 h of bed (13 h for a big pre-workout).</li>
          <li>${p.goal === 'cut' ? '8,000–12,000 steps a day; take a 1-week diet break at maintenance every 6–8 weeks.' : '7,000–10,000 steps a day plus 1–2 short, easy cardio sessions per week.'}</li>
          <li>Eat protein and vegetables first in a meal; a 10-minute walk after big meals helps blood sugar.</li>
          <li>Keep alcohol low — it blunts muscle building and sleep.</li>
        </ul></div>
      </div>`;
  }

  function renderTraining(p, plan) {
    if (!plan) return `<div class="callout bad"><b>Pick at least 2 training days</b>Choose your lifting days in the Training section (2 to 6 days).</div>`;
    const e = EXP_IDX[p.exp];
    const sb = p.style === 'sb';
    const rir = sb ? { c: ['1–2', '0–1', '0–1'][e], i: ['0–1', '0', '0'][e] } : { c: ['2–3', '1–2', '1–2'][e], i: ['1–2', '0–1', '0–1'][e] };
    const rest = sb ? { c: '3–4 min', i: '2–3 min' } : { c: '2–3 min', i: '1–2 min' };
    const maxSets = Math.max(...Object.values(plan.finalSets), 1);
    const weakNames = p.weak.map(w => w === 'upperChest' ? 'Upper chest' : MUSCLE_LABEL[w]);
    const notes = [];
    if (plan.trimmed) notes.push({ soft: true, t: 'Some sets were trimmed to fit your session length', d: 'Non-priority muscles lost a few sets. Choose a longer session or more days to train everything at full volume.' });
    if (plan.overTime.length) notes.push({ soft: true, t: 'Some sessions run over your time limit', d: `${plan.overTime.join(', ')} keep minimum volume for every muscle, so they run a bit long. Pick fewer priorities, a longer session, or more days.` });
    if (plan.lost.length) notes.push({ t: 'Per-session cap reached', d: `${plan.lost.map(m => MUSCLE_LABEL[m]).join(', ')} hit the limit of about 8 useful sets per session, so the extra sets were dropped. More training days would spread them out.` });
    if (plan.fewEx.length) notes.push({ soft: true, t: 'Not enough different exercises', d: `${plan.fewEx.map(m => MUSCLE_LABEL[m]).join(', ')} ran out of different exercises with your ticked equipment, so a few sets were left out to keep 2 sets per exercise. Tick more machines or cables to get the full volume.` });
    if (plan.missing.length) notes.push({ t: 'Missing equipment', d: `No ticked equipment can train: ${plan.missing.map(m => MUSCLE_LABEL[m]).join(', ')}. Tick dumbbells/bench or a matching machine.` });

    const vol = MUSCLES.filter(([m]) => plan.finalSets[m]).map(([m, label]) => {
      const w = plan.weak.has(m);
      return `<div class="lab${w ? ' weak' : ''}">${esc(label)}</div><div class="bar"><div class="${w ? 'weak' : ''}" style="width:${plan.finalSets[m] / maxSets * 100}%"></div></div><div class="n">${plan.finalSets[m]}</div>`;
    }).join('');

    const rows = list => list.map(it => {
      const x = EX[it.id];
      return `<tr><td class="ex"><b><span class="tag m">${esc(MUSCLE_LABEL[it.m])}</span>${esc(x.n)}${it.weak ? '<span class="tag weak">Priority</span>' : ''}</b><span class="note">${esc(x.t)}</span></td>
        <td class="num">${it.sets}</td><td class="num">${x.r}</td><td class="num">${rir[x.k]}</td><td class="num">${rest[x.k]}</td></tr>`;
    }).join('');
    const subhead = (label, sets, min) => `<tr class="subhead"><td colspan="5"><span>${label}</span><span class="meta">${sets} sets · ~${min} min</span></td></tr>`;
    const cardioOn = d => p.cardio.filter(c => c.day === d && c.min > 0);
    const speedTxt = c => p.units === 'imperial' ? `${(c.speedKmh / KMH_PER_MPH).toFixed(1)} mph` : `${c.speedKmh.toFixed(1)} km/h`;
    const cardioBlock = (list, legDay) => !list.length ? '' : `<div class="cardio-block">
        <div class="cardio-title">Cardio${legDay ? '<span class="note"> · leg day: do it after lifting or 6+ h apart</span>' : ''}</div>
        ${list.map(c => {
          const info = cardioInfo(c, p.weightKg);
          const detail = CARDIO_TYPES[c.type]?.tread ? `${speedTxt(c)} · ${c.incline}% incline` : '';
          return `<div class="cardio-line"><b>${esc(info.name)}</b><span>${c.min} min${detail ? ' · ' + detail : ''}</span><span class="num">≈ ${fmt(info.kcal)} kcal · ${info.met.toFixed(1)} METs</span></div>`;
        }).join('')}</div>`;
    const isLegDay = s => s && s.items.some(it => it.m === 'quads' || it.m === 'hamstrings');
    const days = WEEK.map(d => {
      const s = plan.sessions.find(x => x.day === d);
      const cardio = cardioOn(d);
      if (!s && !cardio.length) return '';
      if (!s) {
        const mins = cardio.reduce((a, c) => a + c.min, 0);
        return `<article class="day cardio-day"><div class="day-head"><h3>${d} · Cardio</h3><span class="meta">~${mins} min</span></div>${cardioBlock(cardio, false)}</article>`;
      }
      const two = s.pm.length > 0;
      const body = two
        ? subhead('Morning', s.amSets, s.amMin) + rows(s.am) + subhead(plan.mode === 'small' ? 'Evening · small muscles' : 'Evening', s.pmSets, s.pmMin) + rows(s.pm)
        : rows(s.am);
      return `
      <article class="day">
        <div class="day-head"><h3>${esc(s.day)} · ${esc(s.name)}</h3><span class="meta">${two ? '2 sessions · ' : ''}${s.totalSets} sets · ~${s.minutes} min${cardio.length ? ' + cardio' : ''}</span></div>
        <div class="tbl-wrap"><table>
          <thead><tr><th>Exercise</th><th>Sets</th><th>Reps</th><th>RIR</th><th>Rest</th></tr></thead>
          <tbody>${body}</tbody></table></div>
        ${cardioBlock(cardio, isLegDay(s))}
      </article>`;
    }).join('');
    const weekStrip = `<div class="week">${WEEK.map(d => {
      const s = plan.sessions.find(x => x.day === d);
      const cmin = cardioOn(d).reduce((a, c) => a + c.min, 0);
      return `<div class="wk${s ? ' lift' : ''}${!s && !cmin ? ' rest' : ''}"><b>${d}</b><span>${s ? esc(s.name) : (cmin ? 'Cardio' : 'Rest')}</span>${cmin && s ? `<span class="wk-c">+ ${cmin} min cardio</span>` : (cmin ? `<span class="wk-c">${cmin} min</span>` : '')}</div>`;
    }).join('')}</div>`;
    const cardioMin = p.cardio.reduce((a, c) => a + c.min, 0);
    const vigMin = p.cardio.reduce((a, c) => a + (cardioInfo(c, p.weightKg).vigorous ? c.min : 0), 0);
    const cardioKcal = p.cardio.reduce((a, c) => a + cardioInfo(c, p.weightKg).kcal, 0);
    const cardioNote = cardioMin
      ? `<div class="callout"><b>Cardio: ${cardioMin} min/week (≈ ${fmt(cardioKcal)} kcal)</b>${cardioMin - vigMin} min moderate and ${vigMin} min vigorous. Health guidelines suggest 150–300 min of moderate or 75–150 min of vigorous activity per week. These calories are already added to your daily calorie target.</div>`
      : `<div class="callout"><b>No cardio added</b>Add sessions in the Cardio section of the form. Incline walking and cycling are the easiest to recover from alongside lifting.</div>`;
    const doubleTip = plan.mode === 'off' ? '' : `<div class="callout"><b>${plan.mode === 'small' ? 'Evening small-muscle sessions' : 'Two sessions on training days'}</b>${plan.mode === 'small'
      ? 'Delts, arms, calves and abs move to a short evening session, so the morning session has more time for the big lifts.'
      : "Each day's volume is shared between a morning and an evening session, so every set is done fresher."} Leave at least 6 hours between sessions and eat a protein meal (≈ ${r5(0.4 * p.weightKg)} g) in between.</div>`;

    return `
      <div class="split-head"><h2>${p.days}-day ${esc(plan.split.name)}</h2><p>${esc(plan.split.why)}</p></div>
      ${weakNames.length ? `<div class="callout"><b>Priority: ${esc(weakNames.join(', '))}</b>These get extra weekly sets and go first in each session while you're fresh.</div>`
        : '<div class="callout"><b>No weak points picked</b>Choose up to three in the form to add extra volume to those muscles.</div>'}
      ${sb ? `<div class="callout"><b>Science-based style: 2 hard sets per exercise</b>Fewer sets per exercise but every set close to failure, with longer rests and more exercise variety per muscle. Weekly sets per muscle stay in the 10–20 range that research links to the most growth.</div>` : ''}
      ${doubleTip}
      ${notes.map(x => `<div class="callout${x.soft ? '' : ' bad'}"><b>${esc(x.t)}</b>${esc(x.d)}</div>`).join('')}
      <div><h3>Hard sets per muscle per week</h3><p class="hint" style="margin:2px 0 10px">Direct sets only. Compound lifts add extra indirect work (pressing for triceps and front delts, rows for biceps, squats for glutes).</p>
        <div class="vol">${vol}</div></div>
      <div><h3>Your week</h3>${weekStrip}</div>
      ${cardioNote}
      <div class="days">${days}</div>
      <div><h3>6-week block</h3>
        <div class="meso">
          ${sb ? `<div><b>Week 1</b>1–2 RIR: find your weights</div><div><b>Week 2</b>${rir.i} RIR, beat last week</div><div><b>Week 3</b>${rir.i} RIR, beat last week</div>
          <div><b>Week 4</b>${rir.i} RIR, beat last week</div><div><b>Week 5</b>${rir.i} RIR, beat last week</div><div class="deload"><b>Week 6</b>Deload: 1 set per exercise, 3 RIR</div>`
          : `<div><b>Week 1</b>${['3', '3', '2–3'][e]} RIR</div><div><b>Week 2</b>2–3 RIR</div><div><b>Week 3</b>2 RIR</div>
          <div><b>Week 4</b>1–2 RIR</div><div><b>Week 5</b>${e ? '0–1' : '1'} RIR</div><div class="deload"><b>Week 6</b>Deload: half the sets, 3–4 RIR</div>`}
        </div></div>
      <div class="cols">
        <div><h3>How to progress</h3><ul class="tight">
          ${sb ? `<li>Set 1: take it to ${rir.i === '0' ? 'failure' : 'about 1 rep from failure'} in the rep range. Set 2: same weight (or about 10% lighter) to the same effort.</li>
          <li>When set 1 reaches the top of the rep range, add the smallest weight step next session.</li>
          <li>On isolation exercises you can add a few lengthened partials (bottom half of the rep) after the last full rep.</li>`
          : '<li>Double progression: hit the top of the rep range on every set, then add the smallest weight step (one pin or 2.5–5 kg plate).</li>'}
          <li>RIR = reps in reserve: how many more clean reps you could have done.</li>
          <li>Log every set. Keep the same exercises for the whole 6 weeks.</li>
          <li>Warm up with 2–3 lighter ramp-up sets on the first exercise for each muscle.</li>
        </ul></div>
        <div><h3>Machine tips</h3><ul class="tight">
          <li>Set the seat so the machine's pivot lines up with your joint (elbow, knee or shoulder).</li>
          <li>Plate-loaded machines: add plates evenly to both sides; note your settings in your log.</li>
          <li>Control the lowering for 2–3 s and use the full range, especially the stretched position.</li>
          <li>Swap any exercise that hurts a joint — untick that machine and the plan updates.</li>
        </ul></div>
      </div>`;
  }

  // ---------------------------------------------------------------- Main update
  function syncUi(p) {
    document.querySelectorAll('.metric-only').forEach(el => { el.hidden = p.units !== 'metric'; });
    document.querySelectorAll('.imperial-only').forEach(el => { el.hidden = p.units !== 'imperial'; });
    $('weight-label').textContent = `Body weight (${p.units === 'imperial' ? 'lb' : 'kg'})`;
    document.querySelectorAll('.cut-only').forEach(el => { el.hidden = p.goal !== 'cut'; });
    document.querySelectorAll('.double-only').forEach(el => { el.hidden = p.double === 'off'; });
    $('session-label').textContent = p.double === 'off' ? 'Session length' : 'Morning session';
    const hints = {
      cut: 'Lose fat while keeping muscle: moderate deficit, high protein, heavy training.',
      main: 'Build muscle slowly with almost no fat gain — good for most intermediates.',
      bulk: 'Maximise muscle gain with a controlled surplus. Best when you start reasonably lean.',
    };
    $('goal-hint').textContent = hints[p.goal];
    const n = p.weak.length;
    document.querySelectorAll('#weak-list input').forEach(i => { i.disabled = !i.checked && n >= 3; });
    $('equip-count').textContent = `${p.equip.length}/${ALL_EQUIP.length}`;
    document.querySelectorAll('#day-list input').forEach(i => { i.disabled = !i.checked && p.days >= 6; });
    $('days-count').textContent = `${p.days} day${p.days === 1 ? '' : 's'}`;
  }

  function update() {
    const p = readState();
    syncUi(p);
    $('panel-nutrition').innerHTML = renderNutrition(p, nutrition(p));
    $('panel-training').innerHTML = renderTraining(p, p.days >= 2 && p.days <= 6 ? buildPlan(p) : null);
    p.cardio.forEach((c, i) => { const el = $('c-est-' + i); if (el) el.textContent = `≈ ${fmt(cardioInfo(c, p.weightKg).kcal)} kcal`; });
    try { localStorage.setItem('pp_last', JSON.stringify(p)); } catch (_) { /* storage blocked */ }
  }

  // ---------------------------------------------------------------- Profiles & sharing
  function loadProfiles() { try { return JSON.parse(localStorage.getItem('pp_profiles') || '{}'); } catch (_) { return {}; } }
  function saveProfiles(o) { try { localStorage.setItem('pp_profiles', JSON.stringify(o)); return true; } catch (_) { return false; } }
  function refreshProfiles(selected) {
    const names = Object.keys(loadProfiles()).sort();
    $('profile-select').innerHTML = '<option value="">Saved lifters…</option>' + names.map(nm => `<option${nm === selected ? ' selected' : ''}>${esc(nm)}</option>`).join('');
  }

  function encodeState(p) { return btoa(unescape(encodeURIComponent(JSON.stringify(p)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function decodeState(str) {
    try { return JSON.parse(decodeURIComponent(escape(atob(str.replace(/-/g, '+').replace(/_/g, '/'))))); } catch (_) { return null; }
  }

  function selectTab(which) {
    const nut = which === 'nutrition';
    $('tab-nutrition').setAttribute('aria-selected', String(nut));
    $('tab-training').setAttribute('aria-selected', String(!nut));
    $('panel-nutrition').hidden = !nut;
    $('panel-training').hidden = nut;
  }

  // ---------------------------------------------------------------- Init
  function init() {
    buildWeakChips();
    buildDayChips();
    buildEquipment();
    renderCardioRows([], $('units').value);
    // example weak points so the first view shows a real plan
    ['upperChest', 'sideDelts', 'hamstrings'].forEach(id => { const el = $('weak-' + id); if (el) el.checked = true; });

    let restored = null;
    const m = location.hash.match(/p=([A-Za-z0-9_-]+)/);
    if (m) restored = decodeState(m[1]);
    if (!restored) { try { restored = JSON.parse(localStorage.getItem('pp_last') || 'null'); } catch (_) { restored = null; } }
    if (restored) writeState(restored);
    refreshProfiles(restored && restored.name);

    let lastUnits = $('units').value;
    $('units').addEventListener('change', () => {
      const u = $('units').value;
      if (u === lastUnits) return;
      const w = parseFloat($('weight').value);
      if (u === 'imperial') {
        if (Number.isFinite(w)) $('weight').value = (w / 0.45359237).toFixed(1);
        const cm = parseFloat($('height-cm').value);
        if (Number.isFinite(cm)) { const inches = Math.round(cm / 2.54); $('height-ft').value = Math.floor(inches / 12); $('height-in').value = inches % 12; }
      } else {
        if (Number.isFinite(w)) $('weight').value = (w * 0.45359237).toFixed(1);
        const ft = parseFloat($('height-ft').value) || 0, inch = parseFloat($('height-in').value) || 0;
        $('height-cm').value = Math.round((ft * 12 + inch) * 2.54);
      }
      renderCardioRows(readCardio(lastUnits), u); // convert treadmill speeds
      lastUnits = u;
    });
    $('btn-add-cardio').addEventListener('click', () => {
      const units = $('units').value;
      const list = readCardio(units);
      const train = WEEK.filter(d => $('day-' + d).checked);
      const used = new Set(list.map(c => c.day));
      const day = WEEK.find(d => !train.includes(d) && !used.has(d)) || WEEK.find(d => !used.has(d)) || 'Mon';
      list.push({ day, type: 'treadmill', min: 30, speedKmh: 5, incline: 8, level: 1 });
      renderCardioRows(list, units);
      update();
    });
    $('cardio-list').addEventListener('click', ev => {
      const btn = ev.target.closest('.c-del');
      if (!btn) return;
      const units = $('units').value;
      const i = +btn.closest('.cardio-row').dataset.i;
      const list = readCardio(units); list.splice(i, 1);
      renderCardioRows(list, units);
      update();
    });
    $('cardio-list').addEventListener('change', ev => {
      if (ev.target.dataset.k === 'type') renderCardioRows(readCardio($('units').value), $('units').value); // swap speed/incline vs intensity fields
    });
    $('form').addEventListener('input', update);
    $('form').addEventListener('change', update);
    $('form').addEventListener('submit', ev => ev.preventDefault());
    $('tab-nutrition').addEventListener('click', () => selectTab('nutrition'));
    $('tab-training').addEventListener('click', () => selectTab('training'));

    $('btn-save').addEventListener('click', () => {
      const p = readState();
      if (!p.name) { toast('Type a name first, then save.'); $('name').focus(); return; }
      const all = loadProfiles(); all[p.name] = p;
      toast(saveProfiles(all) ? `Saved ${p.name}` : 'Saving is blocked in this browser.');
      refreshProfiles(p.name);
    });
    $('btn-delete').addEventListener('click', () => {
      const nm = $('profile-select').value;
      if (!nm) { toast('Pick a saved lifter to delete.'); return; }
      const all = loadProfiles(); delete all[nm]; saveProfiles(all); refreshProfiles(''); toast(`Deleted ${nm}`);
    });
    $('profile-select').addEventListener('change', () => {
      const s = loadProfiles()[$('profile-select').value];
      if (s) { writeState(s); update(); toast(`Loaded ${s.name}`); }
    });
    $('btn-share').addEventListener('click', () => {
      const url = location.href.split('#')[0] + '#p=' + encodeState(readState());
      history.replaceState(null, '', url);
      const done = () => toast('Link copied — send it to a friend.');
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, () => toast('Copy the link from the address bar.'));
      else toast('Copy the link from the address bar.');
    });
    $('btn-print').addEventListener('click', () => window.print());

    update();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
