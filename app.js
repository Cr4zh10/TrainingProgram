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

    db_shrug: { n: 'Dumbbell shrug', eq: ['db'], k: 'i', r: '10–15', t: 'Shrug straight up, pause 1 s at the top; full stretch at the bottom.' },
    smith_shrug: { n: 'Smith machine shrug', eq: ['smith'], k: 'i', r: '10–15', t: 'Bar in front of the thighs; lift the shoulders to the ears, no neck roll.' },
    cable_shrug: { n: 'Cable shrug', eq: ['cable'], k: 'i', r: '12–15', t: 'Constant tension; squeeze at the top, slow lowering.' },

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
    traps: { p: ['db_shrug', 'smith_shrug', 'cable_shrug'], s: ['cable_shrug', 'db_shrug', 'smith_shrug'] },
    quads: { p: ['hack', 'pendulum', 'leg_press', 'smith_squat', 'bss', 'goblet'], s: ['leg_ext', 'bss', 'leg_press'] },
    hamstrings: { p: ['seated_curl', 'lying_curl', 'db_rdl'], s: ['db_rdl', 'smith_rdl', 'back_ext_ham', 'lying_curl'] },
    glutes: { p: ['hip_thrust_m', 'smith_thrust', 'db_thrust', 'bss'], s: ['abductor', 'kickback_m', 'cable_kick', 'back_ext_glute'] },
    calves: { p: ['stand_calf', 'lp_calf', 'smith_calf', 'db_calf'], s: ['seated_calf', 'db_calf'] },
    abs: { p: ['ab_mach', 'cable_crunch', 'knee_raise', 'db_crunch'], s: ['knee_raise', 'cable_crunch', 'db_crunch'] },
  };

  // Joint-friendly mode: exercises that commonly aggravate a joint (a convenience filter, not medical advice).
  const JOINTS = [['knee', 'Knees'], ['shoulder', 'Shoulders'], ['back', 'Lower back'], ['elbow', 'Elbows']];
  const JOINT_NAME = Object.fromEntries(JOINTS);
  const JOINT_TAGS = {
    knee: ['hack', 'smith_squat', 'bss', 'goblet'],
    shoulder: ['sh_press', 'db_sh_press', 'smith_sh', 'dip_assist', 'db_pullover', 'pullover_m', 'oh_cable', 'db_oh_ext', 'cable_y', 'db_fly'],
    back: ['db_rdl', 'smith_rdl', 'back_ext_ham', 'back_ext_glute'],
    elbow: ['db_skull', 'db_oh_ext', 'oh_cable', 'dip_assist'],
  };
  Object.entries(JOINT_TAGS).forEach(([t, ids]) => ids.forEach(id => { (EX[id].j = EX[id].j || []).push(t); }));

  // ---------------------------------------------------------------- Muscles & volume
  const MUSCLES = [
    ['chest', 'Chest'], ['lats', 'Lats (width)'], ['upperBack', 'Upper back'], ['traps', 'Traps'], ['quads', 'Quads'],
    ['hamstrings', 'Hamstrings'], ['glutes', 'Glutes'], ['frontDelts', 'Front delts'], ['sideDelts', 'Side delts'],
    ['rearDelts', 'Rear delts'], ['triceps', 'Triceps'], ['biceps', 'Biceps'], ['calves', 'Calves'], ['abs', 'Abs'],
  ];
  const MUSCLE_LABEL = Object.fromEntries(MUSCLES);
  const ORDER = Object.fromEntries(MUSCLES.map((m, i) => [m[0], i]));
  const WEAK_OPTIONS = [['chest', 'Chest'], ['upperChest', 'Upper chest'], ...MUSCLES.slice(1)];

  // Direct hard sets per week by experience [beginner, intermediate, advanced]
  const BASE_SETS = {
    chest: [10, 12, 14], lats: [8, 10, 12], upperBack: [8, 10, 12], quads: [10, 12, 14], hamstrings: [8, 10, 12],
    glutes: [4, 6, 8], frontDelts: [0, 0, 0], traps: [0, 0, 0], sideDelts: [8, 10, 14], rearDelts: [4, 6, 8], triceps: [6, 8, 10],
    biceps: [6, 8, 10], calves: [6, 8, 10], abs: [4, 6, 6],
  };
  // muscles with no base volume (they get indirect work) start at this many direct sets when picked as a priority
  const WEAK_FLOOR = { frontDelts: [6, 8, 10], traps: [6, 8, 10] };
  const MAX_WEAK = 6;
  const WEAK_BONUS = [4, 6, 6];
  const EXP_IDX = { beg: 0, int: 1, adv: 2 };

  // Daily steps -> activity multiplier on BMR (before lifting and cardio). The anchors reproduce the old four
  // presets (4,000 = 1.35, 6,500 = 1.45, 10,000 = 1.55, 14,000 = 1.70); anything in between is interpolated.
  const STEP_ANCHORS = [[1000, 1.22], [2500, 1.30], [4000, 1.35], [6500, 1.45], [10000, 1.55], [14000, 1.70], [20000, 1.85], [30000, 2.0]];
  const OLD_ACTIVITY_STEPS = { '1.35': 4000, '1.45': 6500, '1.55': 10000, '1.7': 14000 };
  function stepFactor(steps) {
    const A = STEP_ANCHORS;
    if (steps <= A[0][0]) return A[0][1];
    for (let i = 1; i < A.length; i++) {
      if (steps <= A[i][0]) { const [x0, y0] = A[i - 1], [x1, y1] = A[i]; return y0 + (y1 - y0) * (steps - x0) / (x1 - x0); }
    }
    return A[A.length - 1][1];
  }

  // Macro styles: protein multiplier, and how fat and carbs are set once protein is fixed.
  const MACRO_STYLES = {
    bal: { n: 'Balanced', prot: 1, d: 'Moderate fat, carbs fill the rest. A good default for most lifters.' },
    hp: { n: 'High protein', prot: 1.2, d: 'About 20% more protein than the default, with carbs lowered to match. Helps with hunger on a cut; muscle gain levels off above roughly 2.2 g per kg of body weight.' },
    hc: { n: 'High carb', prot: 1, d: 'Fat kept low and carbs high. Suits heavy volume, long sessions or a lot of daily activity.' },
    lc: { n: 'Low carb', prot: 1.1, d: 'Carbs about 1.5 g per kg, the extra calories go to fat. Fine if you prefer eating this way; hard sessions can feel flatter.' },
    keto: { n: 'Keto', prot: 1.1, d: 'Carbs fixed at 30 g. Not ideal for high-volume lifting; read the note in the results.' },
  };

  const UP = ['chest', 'lats', 'upperBack', 'traps', 'frontDelts', 'sideDelts', 'rearDelts', 'biceps', 'triceps'];
  const LOW = ['quads', 'hamstrings', 'glutes', 'calves', 'abs'];
  const PUSH = ['chest', 'frontDelts', 'sideDelts', 'triceps'];
  const PULL = ['lats', 'upperBack', 'traps', 'rearDelts', 'biceps'];
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

  // ---------------------------------------------------------------- Languages
  // The page is written in English. Another language is a dictionary of exact phrases plus patterns for sentences
  // that contain numbers or names; the screen text is translated after it is drawn, and anything without a
  // translation (exercise names and coaching tips, equipment names) stays in English.
  // ---------------------------------------------------------------- Vietnamese
  const wkVi = s => s.replace(/ \/ week/g, ' / tuần');
  const SESS_VI = { 'Full body': 'Toàn thân', Upper: 'Thân trên', Lower: 'Thân dưới', Push: 'Đẩy', Pull: 'Kéo', Legs: 'Chân' };
  const DAY_VI = { Mon: 'T2', Tue: 'T3', Wed: 'T4', Thu: 'T5', Fri: 'T6', Sat: 'T7', Sun: 'CN' };
  const VI = {
    exact: {
      'Calories, macros and a weak-point training plan built around our gym\'s machines.': 'Calo, macro và giáo án tập trung vào điểm yếu, xây dựng theo máy móc của phòng tập.',
      'Copy share link': 'Sao chép liên kết chia sẻ', 'Print plan': 'In giáo án', 'Language': 'Ngôn ngữ',
      'Theme: Auto': 'Giao diện: Tự động', 'Theme: Light': 'Giao diện: Sáng', 'Theme: Dark': 'Giao diện: Tối',
      // lifter
      'Lifter': 'Người tập', 'Saved lifters': 'Người tập đã lưu', 'Saved lifters…': 'Người tập đã lưu…', 'Save': 'Lưu', 'Delete': 'Xóa', 'Remove': 'Xóa',
      'Name': 'Tên', 'e.g. Alex': 'ví dụ: Alex', 'Sex': 'Giới tính', 'Male': 'Nam', 'Female': 'Nữ', 'Age': 'Tuổi', 'Units': 'Đơn vị',
      'Height (cm)': 'Chiều cao (cm)', 'Height (ft, in)': 'Chiều cao (ft, in)', 'Body weight (kg)': 'Cân nặng (kg)', 'Body weight (lb)': 'Cân nặng (lb)',
      'Body fat %': 'Tỉ lệ mỡ cơ thể %', 'optional': 'không bắt buộc', 'e.g. 16': 'ví dụ: 16', 'e.g. 12': 'ví dụ: 12',
      // training
      'Training': 'Tập luyện', 'Training experience': 'Kinh nghiệm tập',
      'Beginner — under 1 year of consistent lifting': 'Người mới — dưới 1 năm tập đều đặn',
      'Intermediate — 1 to 3 years': 'Trung bình — 1 đến 3 năm',
      'Advanced — 3+ years, close to your potential': 'Nâng cao — trên 3 năm, gần chạm tiềm năng',
      'Training style': 'Phong cách tập',
      'Standard — 2–4 sets per exercise, effort builds over the block': 'Tiêu chuẩn — 2–4 set mỗi bài, cường độ tăng dần theo chu kỳ',
      'Science-based — 2 all-out sets per exercise, more variety': 'Theo khoa học — 2 set hết sức mỗi bài, nhiều bài đa dạng hơn',
      'Lifting days': 'Ngày tập tạ', 'tap to switch on/off ·': 'chạm để bật/tắt ·',
      'Session length': 'Thời lượng buổi tập', 'Morning session': 'Buổi sáng', 'Evening session': 'Buổi tối', 'No limit': 'Không giới hạn',
      'Train twice a day?': 'Tập hai buổi mỗi ngày?', 'No — one session per day': 'Không — mỗi ngày một buổi',
      'Yes — split each day\'s volume into morning + evening': 'Có — chia khối lượng mỗi ngày thành buổi sáng + buổi tối',
      'Yes — short evening session for delts, arms, calves & abs': 'Có — buổi tối ngắn cho vai, tay, bắp chân & bụng',
      'Daily steps outside the gym': 'Số bước chân mỗi ngày (ngoài phòng tập)', 'Quick pick': 'Chọn nhanh', 'Quick pick…': 'Chọn nhanh…',
      '2,500 · mostly sitting': '2,500 · chủ yếu ngồi', '4,000 · desk job': '4,000 · làm văn phòng', '6,500 · light': '6,500 · nhẹ',
      '8,000 · average': '8,000 · trung bình', '10,000 · active': '10,000 · năng động', '12,500 · very active': '12,500 · rất năng động',
      '15,000 · on your feet all day': '15,000 · đứng/đi cả ngày', '20,000 · labour job': '20,000 · lao động chân tay',
      'Weak points to bring up': 'Nhóm cơ cần cải thiện', 'pick up to 6': 'chọn tối đa 6',
      'Joint-friendly mode': 'Chế độ thân thiện với khớp', 'skip exercises that bother…': 'bỏ các bài gây khó chịu cho…',
      'Knees': 'Đầu gối', 'Shoulders': 'Vai', 'Lower back': 'Lưng dưới', 'Elbows': 'Khuỷu tay',
      // muscles
      'Chest': 'Ngực', 'Upper chest': 'Ngực trên', 'Lats (width)': 'Xô (độ rộng lưng)', 'Upper back': 'Lưng trên', 'Traps': 'Cầu vai',
      'Quads': 'Đùi trước', 'Hamstrings': 'Đùi sau', 'Glutes': 'Mông', 'Front delts': 'Vai trước', 'Side delts': 'Vai giữa', 'Rear delts': 'Vai sau',
      'Triceps': 'Tay sau', 'Biceps': 'Tay trước', 'Calves': 'Bắp chân', 'Abs': 'Bụng',
      // cardio
      'Cardio': 'Cardio', 'Add session': 'Thêm buổi', 'Day': 'Ngày', 'Machine': 'Máy', 'Minutes': 'Số phút', 'Intensity': 'Cường độ', 'Incline (%)': 'Độ dốc (%)',
      'No cardio yet. Add a session, choose the day and machine, and set speed and incline for the treadmill. The calories are added to your daily target.': 'Chưa có cardio. Hãy thêm một buổi, chọn ngày và máy, rồi đặt tốc độ và độ dốc cho máy chạy bộ. Calo tiêu hao được cộng vào mục tiêu hằng ngày.',
      'Easy': 'Nhẹ', 'Moderate': 'Vừa', 'Hard': 'Nặng',
      'Treadmill': 'Máy chạy bộ', 'Stationary bike': 'Xe đạp tập', 'Elliptical': 'Máy elliptical', 'Stair climber': 'Máy leo cầu thang', 'Rowing machine': 'Máy chèo thuyền',
      'Incline walk': 'Đi bộ lên dốc', 'Treadmill walk': 'Đi bộ trên máy', 'Treadmill run': 'Chạy trên máy',
      // goal
      'Goal': 'Mục tiêu', 'Cut speed': 'Tốc độ giảm mỡ',
      'Gentle — 0.5% of body weight/week': 'Nhẹ — 0.5% cân nặng/tuần', 'Standard — 0.75%/week': 'Tiêu chuẩn — 0.75%/tuần', 'Fast — 1%/week': 'Nhanh — 1%/tuần',
      'Aggressive — 1.25%/week (4–6 weeks at a time)': 'Quyết liệt — 1.25%/tuần (mỗi đợt 4–6 tuần)', 'Target body fat %': 'Tỉ lệ mỡ mục tiêu %',
      'Lose fat while keeping muscle: moderate deficit, high protein, heavy training.': 'Giảm mỡ mà vẫn giữ cơ: thâm hụt vừa phải, nhiều đạm, tập nặng.',
      'Build muscle slowly with almost no fat gain — good for most intermediates.': 'Tăng cơ từ từ, gần như không tăng mỡ — phù hợp với đa số người tập trung bình.',
      'Maximise muscle gain with a controlled surplus. Best when you start reasonably lean.': 'Tăng cơ tối đa với mức dư calo có kiểm soát. Tốt nhất khi bạn bắt đầu ở mức khá gọn.',
      'Macro style': 'Kiểu macro', 'Balanced': 'Cân bằng', 'High protein': 'Nhiều đạm', 'High carb': 'Nhiều carb', 'Low carb': 'Ít carb', 'Keto': 'Keto',
      'Moderate fat, carbs fill the rest. A good default for most lifters.': 'Chất béo vừa phải, phần còn lại là carb. Mặc định phù hợp với đa số người tập.',
      'About 20% more protein than the default, with carbs lowered to match. Helps with hunger on a cut; muscle gain levels off above roughly 2.2 g per kg of body weight.': 'Nhiều đạm hơn mặc định khoảng 20%, carb giảm tương ứng. Giúp đỡ đói khi giảm mỡ; lợi ích tăng cơ chững lại trên khoảng 2.2 g mỗi kg cân nặng.',
      'Fat kept low and carbs high. Suits heavy volume, long sessions or a lot of daily activity.': 'Chất béo thấp, carb cao. Phù hợp khi tập khối lượng lớn, buổi tập dài hoặc vận động nhiều trong ngày.',
      'Carbs about 1.5 g per kg, the extra calories go to fat. Fine if you prefer eating this way; hard sessions can feel flatter.': 'Carb khoảng 1.5 g mỗi kg, phần calo còn lại dồn vào chất béo. Ổn nếu bạn thích ăn kiểu này; buổi tập nặng có thể kém hứng.',
      'Carbs fixed at 30 g. Not ideal for high-volume lifting; read the note in the results.': 'Carb cố định 30 g. Không lý tưởng cho tập khối lượng lớn; xem ghi chú trong phần kết quả.',
      'Calories by day type': 'Calo theo loại ngày', 'Same every day': 'Như nhau mỗi ngày', 'Higher on lifting days, lower on rest days': 'Cao hơn ngày tập tạ, thấp hơn ngày nghỉ',
      'Equipment': 'Thiết bị', 'Untick anything your gym doesn\'t have. The plan only uses ticked equipment.': 'Bỏ chọn những thứ phòng tập của bạn không có. Giáo án chỉ dùng thiết bị đã chọn.',
      'Realleader machines — upper body': 'Máy Realleader — thân trên', 'Realleader machines — lower body': 'Máy Realleader — thân dưới', 'Cables and free weights': 'Cáp và tạ tự do',
      'Calories & macros': 'Calo & macro', 'Training plan': 'Giáo án tập', 'Progress': 'Tiến độ',
      'Targets come from published sports-science guidelines (ISSN, ACSM and hypertrophy meta-analyses). They are starting points: check your weekly average weight and adjust. Not medical advice — talk to a doctor if you have kidney, liver, heart or blood-sugar conditions.': 'Các mục tiêu dựa trên hướng dẫn khoa học thể thao đã công bố (ISSN, ACSM và các phân tích tổng hợp về phì đại cơ). Đây chỉ là điểm xuất phát: hãy theo dõi cân nặng trung bình mỗi tuần và điều chỉnh. Không phải lời khuyên y tế — hãy hỏi bác sĩ nếu bạn có bệnh về thận, gan, tim hoặc đường huyết.',
      // nutrition results
      'Calories / day': 'Calo / ngày', 'Protein': 'Protein', 'Carbs': 'Carb', 'Fat': 'Chất béo', 'Calories': 'Calo',
      'Daily target': 'Mục tiêu hằng ngày', 'Amount': 'Số lượng', 'Expected change': 'Thay đổi dự kiến', 'Fibre': 'Chất xơ',
      'Water — rest / training day': 'Nước — ngày nghỉ / ngày tập', 'Sodium': 'Natri', '≈ 2.3 g + 0.5–1 g per hour of heavy sweat': '≈ 2.3 g + 0.5–1 g mỗi giờ ra nhiều mồ hôi',
      'Potassium': 'Kali', 'Creatine monohydrate': 'Creatine monohydrate', '3–5 g every day': '3–5 g mỗi ngày',
      'How it was calculated': 'Cách tính', 'Resting burn (BMR)': 'Năng lượng nghỉ (BMR)', 'Formula': 'Công thức', 'Daily steps': 'Bước chân mỗi ngày',
      'Activity multiplier': 'Hệ số vận động', 'Maintenance (TDEE)': 'Duy trì (TDEE)', 'Lean body mass': 'Khối lượng nạc', 'Energy availability': 'Năng lượng khả dụng',
      'Katch–McArdle (uses your lean mass)': 'Katch–McArdle (dùng khối lượng nạc của bạn)',
      'Slow gain — muscle with very little fat': 'Tăng chậm — tăng cơ, rất ít mỡ',
      'How long to cut': 'Cần cắt bao lâu', 'total.': 'tổng cộng.',
      'Calories raised to protect your hormones and muscle': 'Đã tăng calo để bảo vệ nội tiết và cơ bắp',
      'Aggressive cut: keep it short': 'Cắt quyết liệt: nên giữ ngắn',
      'Losing 1.25% of body weight a week works best for 4 to 6 weeks at a time and when you have body fat to spare. Expect more hunger, flatter workouts and a higher risk of losing muscle. Keep protein high, keep lifting heavy, and take a 1-week break at maintenance after each block.': 'Giảm 1.25% cân nặng mỗi tuần hiệu quả nhất trong 4–6 tuần mỗi đợt và khi bạn còn mỡ để giảm. Hãy chuẩn bị tinh thần đói hơn, buổi tập kém hứng hơn và nguy cơ mất cơ cao hơn. Giữ protein cao, tiếp tục tập nặng và nghỉ 1 tuần ở mức duy trì sau mỗi đợt.',
      'Aggressive cut at low body fat': 'Cắt quyết liệt khi mỡ đã thấp',
      'At your body fat this speed puts muscle at real risk. Use Standard (0.75%) or Fast (1%) instead.': 'Với tỉ lệ mỡ của bạn, tốc độ này đe dọa cơ bắp thật sự. Hãy dùng Tiêu chuẩn (0.75%) hoặc Nhanh (1%).',
      'Add your body fat %': 'Hãy nhập tỉ lệ mỡ cơ thể',
      'Without it the app cannot protect a minimum energy intake, so check that the calories above are not too low for you.': 'Thiếu thông tin này, ứng dụng không thể bảo vệ mức năng lượng tối thiểu, nên hãy tự kiểm tra xem calo ở trên có quá thấp với bạn không.',
      'Fast cut at low body fat': 'Cắt nhanh khi mỡ đã thấp',
      'When you are already lean, 1%/week risks losing muscle. 0.5–0.75%/week keeps more of it.': 'Khi đã gọn, 1%/tuần có nguy cơ mất cơ. 0.5–0.75%/tuần giữ được nhiều cơ hơn.',
      'Very low intake': 'Mức ăn quá thấp', 'Long cut ahead': 'Đợt cắt còn dài',
      'Split it into blocks of 12–16 weeks with 4–8 weeks at maintenance in between.': 'Hãy chia thành các đợt 12–16 tuần, xen kẽ 4–8 tuần ở mức duy trì.',
      'Consider cutting or maingaining first': 'Nên cắt hoặc maingain trước',
      'At your body-fat level, a bulk adds mostly fat and lowers insulin sensitivity. A cut or maingain will improve how you look and how you gain later.': 'Với mức mỡ hiện tại, bulk chủ yếu tăng mỡ và làm giảm độ nhạy insulin. Cắt hoặc maingain sẽ giúp bạn đẹp hơn và tăng cơ tốt hơn về sau.',
      'Progress adjustment': 'Điều chỉnh theo tiến độ', 'Keto and heavy lifting': 'Keto và tập nặng',
      'Evidence for muscle gain on very low carbs is limited, and high-volume sessions often feel flat for the first 2 to 4 weeks. Keep sodium, potassium and magnesium up. If training suffers, switch to Low carb and eat some carbs around your session.': 'Bằng chứng về tăng cơ khi ăn rất ít carb còn hạn chế, và các buổi tập khối lượng lớn thường kém hứng trong 2–4 tuần đầu. Hãy bổ sung đủ natri, kali và magie. Nếu buổi tập bị ảnh hưởng, hãy chuyển sang Ít carb và ăn một ít carb quanh buổi tập.',
      'Calorie cycling is off for this plan': 'Giáo án này không dùng calo thay đổi theo ngày',
      'Keto, or too little room above the minimum safe intake, means every day uses the same calories.': 'Do chọn Keto, hoặc do không còn đủ khoảng trống trên mức nạp an toàn tối thiểu, nên mọi ngày dùng cùng một mức calo.',
      'Lifting days vs rest days': 'Ngày tập tạ so với ngày nghỉ', 'Day type': 'Loại ngày',
      'Weekly check-in': 'Kiểm tra hằng tuần',
      'Weigh every morning after the toilet; compare': 'Cân mỗi sáng sau khi đi vệ sinh; so sánh', 'weekly averages': 'trung bình theo tuần', ', not single days.': ', không so từng ngày riêng lẻ.',
      'Losing slower than target for 2 weeks → cut 100–150 kcal (mostly carbs/fat) or add 2,000 steps.': 'Giảm chậm hơn mục tiêu 2 tuần → giảm 100–150 kcal (chủ yếu carb/chất béo) hoặc thêm 2,000 bước.',
      'Gaining slower than target for 2–3 weeks → add 100–150 kcal.': 'Tăng chậm hơn mục tiêu 2–3 tuần → thêm 100–150 kcal.',
      'Losing faster than target or strength dropping → add 100–150 kcal.': 'Giảm nhanh hơn mục tiêu hoặc sức mạnh đi xuống → thêm 100–150 kcal.',
      'Gaining faster than target or waist growing quickly → remove 100–150 kcal.': 'Tăng nhanh hơn mục tiêu hoặc vòng eo tăng nhanh → bớt 100–150 kcal.',
      'Measure your waist at the navel weekly and take photos monthly.': 'Đo vòng eo ngang rốn mỗi tuần và chụp ảnh mỗi tháng.',
      'Habits that matter': 'Thói quen quan trọng',
      'Sleep 7–9 hours; no caffeine within ~9 h of bed (13 h for a big pre-workout).': 'Ngủ 7–9 tiếng; không dùng caffeine trong khoảng 9 tiếng trước khi ngủ (13 tiếng với pre-workout mạnh).',
      '8,000–12,000 steps a day; take a 1-week diet break at maintenance every 6–8 weeks.': '8,000–12,000 bước mỗi ngày; nghỉ diet 1 tuần ở mức duy trì mỗi 6–8 tuần.',
      '8,000–12,000 steps a day; take a 1-week diet break at maintenance every 4 weeks.': '8,000–12,000 bước mỗi ngày; nghỉ diet 1 tuần ở mức duy trì mỗi 4 tuần.',
      '7,000–10,000 steps a day plus 1–2 short, easy cardio sessions per week.': '7,000–10,000 bước mỗi ngày cùng 1–2 buổi cardio nhẹ, ngắn mỗi tuần.',
      'Eat protein and vegetables first in a meal; a 10-minute walk after big meals helps blood sugar.': 'Ăn đạm và rau trước trong bữa; đi bộ 10 phút sau bữa lớn giúp ổn định đường huyết.',
      'Keep alcohol low — it blunts muscle building and sleep.': 'Hạn chế rượu bia — nó làm giảm khả năng tăng cơ và chất lượng giấc ngủ.',
      'After the cut': 'Sau giai đoạn cắt',
      'Calories below assume the same training and activity as now. Your lean mass should be about the same, so maintenance stays close to today\'s number; re-check it with your weekly average weight.': 'Số calo bên dưới giả định bạn tập và vận động như hiện tại. Khối lượng nạc gần như giữ nguyên nên mức duy trì sẽ gần với con số hôm nay; hãy kiểm tra lại bằng cân nặng trung bình mỗi tuần.',
      'Next phase': 'Giai đoạn tiếp theo', 'Weight / week': 'Cân nặng / tuần', 'Maintain': 'Duy trì', 'Maingain': 'Maingain', 'Lean bulk': 'Lean bulk (tăng nạc)', 'steady': 'giữ nguyên', 'Use this': 'Dùng mục này',
      'Step calories up over 1 to 2 weeks (about 100–200 kcal a week, mostly carbs) instead of jumping straight to the new number.': 'Tăng calo dần trong 1–2 tuần (khoảng 100–200 kcal mỗi tuần, chủ yếu carb) thay vì nhảy thẳng lên con số mới.',
      'Hold maintenance for 2 to 4 weeks first if you feel run down, then move to Maingain or a Lean bulk.': 'Nếu thấy mệt mỏi, hãy giữ mức duy trì 2–4 tuần trước, rồi chuyển sang Maingain hoặc Lean bulk.',
      'Keep training: switch the goal above and the plan gives every muscle its full weekly sets back (cut plans trim non-priority muscles by about 15%). Start a fresh 6-week block at about 3 RIR with last block\'s weights, then keep using double progression and add weight whenever you reach the top of the rep range.': 'Tiếp tục tập: đổi mục tiêu ở trên và giáo án sẽ trả lại đủ số set mỗi tuần cho mọi nhóm cơ (giáo án cắt giảm khoảng 15% set của các nhóm không ưu tiên). Bắt đầu chu kỳ 6 tuần mới ở mức khoảng 3 RIR với mức tạ của chu kỳ trước, rồi tiếp tục tăng tiến kép và tăng tạ mỗi khi bạn đạt số lần lặp cao nhất trong khoảng.',
      'Strength should climb as calories return. If weight rises faster than the rate above, remove 100–150 kcal.': 'Sức mạnh sẽ tăng khi calo quay lại. Nếu cân nặng tăng nhanh hơn tốc độ ở trên, hãy bớt 100–150 kcal.',
      // training
      'Every muscle 2× per week in two longer sessions.': 'Mỗi nhóm cơ tập 2 lần mỗi tuần trong hai buổi dài hơn.',
      'Every muscle 3× per week — ideal when you can only train three days.': 'Mỗi nhóm cơ tập 3 lần mỗi tuần — lý tưởng khi bạn chỉ tập được ba ngày.',
      'Every muscle 2× per week with short, focused sessions.': 'Mỗi nhóm cơ tập 2 lần mỗi tuần với các buổi ngắn, tập trung.',
      'Every muscle 2× per week with more room for extra weak-point volume.': 'Mỗi nhóm cơ tập 2 lần mỗi tuần, còn nhiều chỗ cho khối lượng bổ sung ở điểm yếu.',
      'Every muscle 2× per week; highest volume capacity for advanced lifters.': 'Mỗi nhóm cơ tập 2 lần mỗi tuần; khả năng chịu khối lượng cao nhất cho người tập nâng cao.',
      'Full body ×2': 'Toàn thân ×2', 'Full body ×3': 'Toàn thân ×3', 'Upper / Lower': 'Thân trên / Thân dưới',
      'Upper / Lower / Push / Pull / Legs': 'Trên / Dưới / Đẩy / Kéo / Chân', 'Push / Pull / Legs ×2': 'Đẩy / Kéo / Chân ×2',
      'Pick at least 2 training days': 'Hãy chọn ít nhất 2 ngày tập', 'Choose your lifting days in the Training section (2 to 6 days).': 'Chọn ngày tập tạ trong mục Tập luyện (từ 2 đến 6 ngày).',
      'These get extra weekly sets and go first in each session while you\'re fresh.': 'Các nhóm này được thêm set mỗi tuần và tập đầu buổi khi bạn còn khỏe.',
      'No weak points picked': 'Chưa chọn nhóm cơ cần cải thiện', 'Choose up to six in the form to add extra volume to those muscles.': 'Hãy chọn tối đa sáu nhóm trong biểu mẫu để thêm khối lượng cho các nhóm đó.',
      'Science-based style: 2 hard sets per exercise': 'Phong cách theo khoa học: 2 set nặng mỗi bài',
      'Fewer sets per exercise but every set close to failure, with longer rests and more exercise variety per muscle. Weekly sets per muscle stay in the 10–20 range that research links to the most growth.': 'Ít set hơn mỗi bài nhưng mọi set đều gần mức thất bại, nghỉ lâu hơn và nhiều bài đa dạng hơn cho mỗi nhóm cơ. Số set mỗi tuần của mỗi nhóm cơ vẫn nằm trong khoảng 10–20 mà nghiên cứu cho là tăng cơ tốt nhất.',
      'Two sessions on training days': 'Hai buổi vào ngày tập', 'Evening small-muscle sessions': 'Buổi tối cho nhóm cơ nhỏ',
      'No time limit': 'Không giới hạn thời gian', 'Lots of priorities': 'Quá nhiều nhóm ưu tiên',
      'Priority muscles are never trimmed and each gets extra sets, so sessions get long and recovery gets harder. If it feels like too much, keep 3 to 4 priorities or add a training day.': 'Các nhóm ưu tiên không bao giờ bị cắt bớt và mỗi nhóm được thêm set, nên buổi tập dài ra và phục hồi khó hơn. Nếu thấy quá tải, hãy giữ 3–4 nhóm ưu tiên hoặc thêm một ngày tập.',
      'Cut volume': 'Khối lượng khi cắt', 'While you cut, muscles that are not priorities get about 15% fewer weekly sets. Priority muscles keep full volume. Switch the goal to Maingain or Bulk to get full volume back.': 'Khi đang cắt, các nhóm cơ không ưu tiên có ít hơn khoảng 15% số set mỗi tuần. Nhóm ưu tiên giữ nguyên khối lượng. Chuyển mục tiêu sang Maingain hoặc Bulk để lấy lại đủ khối lượng.',
      'Some sets were trimmed to fit your session length': 'Một số set đã được cắt để vừa thời lượng buổi tập',
      'Non-priority muscles lost a few sets. Choose a longer session or more days to train everything at full volume.': 'Các nhóm không ưu tiên bị mất vài set. Hãy chọn buổi tập dài hơn hoặc nhiều ngày hơn để tập đủ khối lượng cho mọi nhóm.',
      'Some sessions run over your time limit': 'Một số buổi vượt quá giới hạn thời gian', 'Per-session cap reached': 'Đã chạm giới hạn mỗi buổi',
      'Not enough different exercises': 'Không đủ bài tập khác nhau', 'Missing equipment': 'Thiếu thiết bị',
      'Exercises that commonly aggravate these joints were skipped. This is a convenience filter, not medical advice: use a pain-free range, stop anything that hurts, and see a physio or doctor if pain persists.': 'Các bài thường gây khó chịu cho những khớp này đã được bỏ qua. Đây chỉ là bộ lọc tiện lợi, không phải lời khuyên y tế: hãy tập trong biên độ không đau, dừng bất cứ bài nào gây đau, và gặp bác sĩ hoặc chuyên gia vật lý trị liệu nếu còn đau.',
      'Swapped exercises': 'Bài đã đổi', 'You changed some exercises. Swaps only apply while the same slot exists in the plan.': 'Bạn đã đổi một số bài. Việc đổi chỉ áp dụng khi vị trí đó vẫn còn trong giáo án.', 'Reset swaps': 'Đặt lại bài đã đổi',
      'Swap': 'Đổi bài', 'Swap exercise': 'Đổi bài tập', 'Priority': 'Ưu tiên',
      'Hard sets per muscle per week': 'Số set nặng mỗi nhóm cơ mỗi tuần',
      'Direct sets only. Compound lifts add extra indirect work (pressing for triceps and front delts, rows for biceps, squats for glutes).': 'Chỉ tính set trực tiếp. Các bài compound còn cộng thêm tác động gián tiếp (đẩy cho tay sau và vai trước, kéo cho tay trước, squat cho mông).',
      'Your week': 'Tuần của bạn', 'Rest': 'Nghỉ', 'No cardio added': 'Chưa thêm cardio',
      'Add sessions in the Cardio section of the form. Incline walking and cycling are the easiest to recover from alongside lifting.': 'Hãy thêm buổi tập trong mục Cardio của biểu mẫu. Đi bộ lên dốc và đạp xe là hai loại dễ phục hồi nhất khi tập kèm tạ.',
      ' · leg day: do it after lifting or 6+ h apart': ' · ngày tập chân: làm sau khi tập tạ hoặc cách ít nhất 6 giờ',
      'Morning': 'Buổi sáng', 'Evening': 'Buổi tối', 'Evening · small muscles': 'Buổi tối · nhóm cơ nhỏ',
      'Exercise': 'Bài tập', 'Sets': 'Set', 'Reps': 'Số lần', 'RIR': 'RIR',
      '6-week block': 'Chu kỳ 6 tuần', 'Deload: half the sets, 3–4 RIR': 'Giảm tải: một nửa số set, 3–4 RIR', 'Deload: 1 set per exercise, 3 RIR': 'Giảm tải: 1 set mỗi bài, 3 RIR', '1–2 RIR: find your weights': '1–2 RIR: tìm mức tạ phù hợp',
      'How to progress': 'Cách tăng tiến', 'Machine tips': 'Mẹo dùng máy',
      'Double progression: hit the top of the rep range on every set, then add the smallest weight step (one pin or 2.5–5 kg plate).': 'Tăng tiến kép: đạt số lần lặp cao nhất của khoảng ở mọi set, rồi thêm mức tạ nhỏ nhất (một chốt hoặc đĩa 2.5–5 kg).',
      'When set 1 reaches the top of the rep range, add the smallest weight step next session.': 'Khi set 1 đạt số lần lặp cao nhất của khoảng, hãy thêm mức tạ nhỏ nhất ở buổi sau.',
      'On isolation exercises you can add a few lengthened partials (bottom half of the rep) after the last full rep.': 'Ở các bài isolation, bạn có thể thêm vài lần lặp một phần ở vị trí cơ giãn dài (nửa dưới của động tác) sau lần lặp đầy đủ cuối cùng.',
      'RIR = reps in reserve: how many more clean reps you could have done.': 'RIR = số lần còn dư: bạn còn làm được thêm bao nhiêu lần đúng kỹ thuật.',
      'Log every set. Keep the same exercises for the whole 6 weeks.': 'Ghi lại mọi set. Giữ nguyên các bài trong cả 6 tuần.',
      'Warm up with 2–3 lighter ramp-up sets on the first exercise for each muscle.': 'Khởi động bằng 2–3 set nhẹ dần ở bài đầu tiên của mỗi nhóm cơ.',
      'Set the seat so the machine\'s pivot lines up with your joint (elbow, knee or shoulder).': 'Chỉnh ghế để trục xoay của máy thẳng hàng với khớp của bạn (khuỷu tay, đầu gối hoặc vai).',
      'Plate-loaded machines: add plates evenly to both sides; note your settings in your log.': 'Máy gắn đĩa: lắp đĩa đều hai bên; ghi lại cài đặt máy trong nhật ký.',
      'Control the lowering for 2–3 s and use the full range, especially the stretched position.': 'Kiểm soát nhịp hạ trong 2–3 giây và dùng hết biên độ, nhất là ở vị trí cơ giãn.',
      'Swap any exercise that hurts a joint — untick that machine and the plan updates.': 'Đổi bất kỳ bài nào gây đau khớp — bỏ chọn máy đó và giáo án sẽ tự cập nhật.',
      // progress
      'Progress tracker': 'Theo dõi tiến độ', 'Weigh in each morning; the app compares your trend with your target.': 'Cân mỗi sáng; ứng dụng so sánh xu hướng của bạn với mục tiêu.',
      'Date': 'Ngày', 'Weight': 'Cân nặng', 'Add weigh-in': 'Thêm lần cân', 'Latest': 'Gần nhất', '7-day average': 'Trung bình 7 ngày', 'Change since first': 'Thay đổi từ lần đầu', 'Trend (4 weeks)': 'Xu hướng (4 tuần)',
      'Add your first weigh-in': 'Hãy thêm lần cân đầu tiên',
      'Weigh yourself every morning after the toilet, before eating. After two weeks the app can check your progress against your target and suggest a calorie change.': 'Hãy cân mỗi sáng sau khi đi vệ sinh, trước khi ăn. Sau hai tuần, ứng dụng có thể so tiến độ của bạn với mục tiêu và gợi ý điều chỉnh calo.',
      'Keep logging': 'Tiếp tục ghi chép', 'Eat a little more': 'Ăn nhiều hơn một chút', 'Eat a little less': 'Ăn ít hơn một chút', 'Apply this change': 'Áp dụng thay đổi này', 'On track': 'Đúng tiến độ',
      'It is already included in your targets.': 'Mức này đã được tính trong mục tiêu của bạn.', 'Reset to plan': 'Đặt lại theo giáo án',
      'Entries are saved in this browser under the selected lifter. Single days jump around by 1 to 2 kg from water and food, so the trend matters more than any one weigh-in.': 'Dữ liệu được lưu trong trình duyệt này theo người tập đang chọn. Cân nặng từng ngày dao động 1–2 kg do nước và thức ăn, nên xu hướng quan trọng hơn bất kỳ lần cân nào.',
      'Weight over time': 'Cân nặng theo thời gian',
      // toasts
      'Type a name first, then save.': 'Hãy nhập tên trước rồi lưu.', 'Saving is blocked in this browser.': 'Trình duyệt này đang chặn việc lưu.', 'Pick a saved lifter to delete.': 'Hãy chọn một người tập đã lưu để xóa.',
      'Copy the link from the address bar.': 'Hãy sao chép liên kết từ thanh địa chỉ.', 'Link copied — send it to a friend.': 'Đã sao chép liên kết — hãy gửi cho bạn bè.',
      'Enter a date and a weight.': 'Hãy nhập ngày và cân nặng.', 'That weight does not look right.': 'Cân nặng này có vẻ chưa đúng.', 'Weigh-in added': 'Đã thêm lần cân',
      'Calories adjusted': 'Đã điều chỉnh calo', 'Adjustment reset': 'Đã đặt lại điều chỉnh', 'Swaps reset': 'Đã đặt lại bài đã đổi',
    },
    patterns: [
      [/^(\d+) days?$/, '$1 ngày'], [/^(\d+) min$/, '$1 phút'], [/^~(\d+) min$/, '~$1 phút'], [/^([\d–]+) min$/, '$1 phút'], [/^(\d+) weeks$/, '$1 tuần'], [/^Week (\d)$/, 'Tuần $1'],
      [/^Speed \((km\/h|mph)\)$/, 'Tốc độ ($1)'], [/^Weight \((kg|lb)\)$/, 'Cân nặng ($1)'], [/^Body weight \((kg|lb)\)$/, 'Cân nặng ($1)'],
      [/^(Stationary bike|Elliptical|Stair climber|Rowing machine) \((easy|moderate|hard)\)$/, (m, n, l) => `${trStr(n)} (${{ easy: 'nhẹ', moderate: 'vừa', hard: 'nặng' }[l]})`],
      [/^\+ (\d+) min cardio$/, '+ $1 phút cardio'], [/^\+ ([\d,]+) kcal\/day$/, '+ $1 kcal/ngày'], [/^Cardio \(([\d,]+) kcal\/week\)$/, 'Cardio ($1 kcal/tuần)'],
      [/^(\d+) min · ([\d.]+) (mph|km\/h) · ([\d.]+)% incline$/, '$1 phút · $2 $3 · dốc $4%'],
      [/^(\d+) min moderate and (\d+) min vigorous\. Health guidelines suggest 150–300 min of moderate or 75–150 min of vigorous activity per week\. These calories are already added to your daily calorie target\.$/, '$1 phút vừa và $2 phút nặng. Khuyến nghị sức khỏe là 150–300 phút vận động vừa hoặc 75–150 phút vận động nặng mỗi tuần. Số calo này đã được cộng vào mục tiêu calo hằng ngày.'],
      [/^Cardio: (\d+) min\/week \(≈ ([\d,]+) kcal\)$/, 'Cardio: $1 phút/tuần (≈ $2 kcal)'],
      [/^Counts as × ([\d.]+) on your resting burn, before lifting and cardio\. Use your weekly average and leave out the treadmill sessions you add below\.$/, 'Tính là × $1 trên năng lượng nghỉ, chưa tính tập tạ và cardio. Hãy dùng số trung bình mỗi tuần và không tính các buổi chạy bộ bạn thêm ở bên dưới.'],
      [/^Your (Cut|Maingain|Bulk) targets$/, 'Mục tiêu $1 của bạn'], [/^(.+)'s (Cut|Maingain|Bulk) targets$/, 'Mục tiêu $2 của $1'],
      [/^Lose about ([\d.]+)% of body weight per week \(held back by the minimum-intake floor\)$/, 'Giảm khoảng $1% cân nặng mỗi tuần (bị giới hạn bởi mức nạp tối thiểu)'],
      [/^Lose about ([\d.]+)% of body weight per week$/, 'Giảm khoảng $1% cân nặng mỗi tuần'], [/^Gain about ([\d.]+)% of body weight per week$/, 'Tăng khoảng $1% cân nặng mỗi tuần'],
      [/^kcal · maintenance ≈ ([\d,]+)$/, 'kcal · duy trì ≈ $1'], [/^([\d.]+) g\/kg body weight$/, '$1 g/kg cân nặng'],
      [/^Calories from protein (\d+)%, carbs (\d+)%, fat (\d+)%$/, 'Calo từ protein $1%, carb $2%, chất béo $3%'],
      [/^Protein (\d+)%$/, 'Protein $1%'], [/^Carbs (\d+)%$/, 'Carb $1%'], [/^Fat (\d+)%$/, 'Chất béo $1%'],
      [/^([+−])([\d.]+) (kg|lb) \/ week \(([+−][\d.]+%)\)$/, '$1$2 $3 / tuần ($4)'], [/^Protein per meal \((\d+) meals\)$/, 'Protein mỗi bữa ($1 bữa)'],
      [/^([\d.]+) g\+ \(fruit, veg, potatoes\)$/, '$1 g+ (trái cây, rau, khoai tây)'], [/^(\d+) kcal\/kg lean( — low)?$/, (m, n, low) => `${n} kcal/kg nạc${low ? ' — thấp' : ''}`],
      [/^Goal weight at (\d+)% body fat ≈$/, 'Cân nặng mục tiêu ở mức $1% mỡ ≈'], [/^\(lose ≈ ([\d.]+ (?:kg|lb))\)\.\s+At this rate that takes about$/, '(giảm ≈ $1). Với tốc độ này mất khoảng'],
      [/^, plus (\d+) one-week diet breaks? at maintenance =$/, ', cộng $1 tuần nghỉ diet ở mức duy trì ='],
      [/^Eating ([\d,]+) kcal would leave less than 30 kcal per kg of lean mass after training \(low energy availability\)\. The target was raised to ([\d,]+) kcal, so fat loss will be a little slower\.$/, 'Ăn $1 kcal sẽ khiến năng lượng còn lại sau tập dưới 30 kcal mỗi kg khối lượng nạc (thiếu năng lượng khả dụng). Mục tiêu được nâng lên $2 kcal, nên giảm mỡ sẽ chậm hơn một chút.'],
      [/^Calories were set to the minimum of (\d+) kcal\. Talk to a doctor or dietitian before eating less\.$/, 'Calo được đặt ở mức tối thiểu $1 kcal. Hãy hỏi bác sĩ hoặc chuyên gia dinh dưỡng trước khi ăn ít hơn.'],
      [/^Your target includes ([+−]\d+) kcal a day from your weight log\. Reset it on the Progress tab\.$/, 'Mục tiêu của bạn đã gồm $1 kcal mỗi ngày từ nhật ký cân nặng. Hãy đặt lại ở tab Tiến độ.'],
      [/^Protein and fat stay the same every day; carbs move with training\. Your weekly average is still ([\d,]+) kcal a day\. Cardio-only days count as rest days\.$/, 'Protein và chất béo giữ nguyên mỗi ngày; carb thay đổi theo buổi tập. Trung bình mỗi tuần của bạn vẫn là $1 kcal mỗi ngày. Ngày chỉ tập cardio được tính là ngày nghỉ.'],
      [/^Lifting day \((\d+) per week\)$/, 'Ngày tập tạ ($1 ngày/tuần)'], [/^Rest day \((\d+) per week\)$/, 'Ngày nghỉ ($1 ngày/tuần)'],
      [/^(\d)-day (.+)$/, (m, n, name) => `${n} ngày · ${trStr(name)}`],
      [/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) · (.+)$/, (m, d, name) => `${DAY_VI[d]} · ${trStr(name)}`],
      [/^(2 sessions · )?(\d+) sets · ~(\d+) min( \+ cardio)?$/, (m, two, s, mins, c) => `${two ? '2 buổi · ' : ''}${s} set · ~${mins} phút${c ? ' + cardio' : ''}`],
      [/^Priority: (.+)$/, (m, l) => `Ưu tiên: ${trList(l)}`], [/^Joint-friendly mode: (.+)$/, (m, l) => `Chế độ thân thiện với khớp: ${trList(l)}`],
      [/^Delts, arms, calves and abs move to a short evening session, so the morning session has more time for the big lifts\. Leave at least 6 hours between sessions and eat a protein meal \(≈ (\d+) g\) in between\.$/, 'Vai, tay, bắp chân và bụng chuyển sang buổi tối ngắn, nhờ đó buổi sáng có nhiều thời gian hơn cho các bài nặng. Cách nhau ít nhất 6 tiếng giữa hai buổi và ăn một bữa có protein (≈ $1 g) ở giữa.'],
      [/^Each day's volume is shared between a morning and an evening session, so every set is done fresher\. Leave at least 6 hours between sessions and eat a protein meal \(≈ (\d+) g\) in between\.$/, 'Khối lượng mỗi ngày được chia cho buổi sáng và buổi tối, nên mọi set đều tập khi còn khỏe hơn. Cách nhau ít nhất 6 tiếng giữa hai buổi và ăn một bữa có protein (≈ $1 g) ở giữa.'],
      [/^Nothing is trimmed for time\. Sessions average about (\d+) min, the longest about (\d+) min\.( Sessions over about 2 hours usually mean the late sets are done tired; consider another training day, fewer priorities, or splitting the day into two sessions\.)?$/, (m, a, l, long) => `Không có set nào bị cắt vì thời gian. Buổi tập trung bình khoảng ${a} phút, buổi dài nhất khoảng ${l} phút.${long ? ' Buổi tập trên khoảng 2 tiếng thường khiến các set cuối làm trong lúc mệt; hãy cân nhắc thêm một ngày tập, bớt nhóm ưu tiên hoặc chia ngày đó thành hai buổi.' : ''}`],
      [/^(.+) keep minimum volume for every muscle, so they run a bit long\. Pick fewer priorities, a longer session, or more days\.$/, (m, l) => `${l.split(', ').map(x => trStr(x.replace(' (evening)', '')) + (x.includes('(evening)') ? ' (buổi tối)' : '')).join(', ')} giữ khối lượng tối thiểu cho mọi nhóm cơ nên hơi dài. Hãy chọn ít nhóm ưu tiên hơn, buổi tập dài hơn hoặc thêm ngày tập.`],
      [/^(.+) hit the limit of about 8 useful sets per session, so the extra sets were dropped\. More training days would spread them out\.$/, (m, l) => `${trList(l)} đã chạm giới hạn khoảng 8 set hữu ích mỗi buổi nên các set thừa bị bỏ. Thêm ngày tập sẽ giúp dàn đều chúng.`],
      [/^(.+) ran out of different exercises with your ticked equipment, so a few sets were left out to keep 2 sets per exercise\. Tick more machines or cables to get the full volume\.$/, (m, l) => `${trList(l)} hết bài tập khác nhau với thiết bị bạn đã chọn, nên một vài set bị bỏ để giữ 2 set mỗi bài. Hãy chọn thêm máy hoặc cáp để có đủ khối lượng.`],
      [/^No exercise is left for: (.+)\. Tick dumbbells\/bench or a matching machine, or switch off a joint filter\.$/, (m, l) => `Không còn bài tập nào cho: ${trList(l)}. Hãy chọn tạ đơn/ghế hoặc một máy phù hợp, hoặc tắt bộ lọc khớp.`],
      [/^Set 1: take it to (failure|about 1 rep from failure) in the rep range\. Set 2: same weight \(or about 10% lighter\) to the same effort\.$/, (m, f) => `Set 1: tập tới ${f === 'failure' ? 'mức thất bại' : 'cách thất bại khoảng 1 lần'} trong khoảng số lần lặp. Set 2: cùng mức tạ (hoặc nhẹ hơn khoảng 10%) với cùng nỗ lực.`],
      [/^([\d–]+) RIR, beat last week$/, '$1 RIR, vượt tuần trước'],
      [/^(kg|lb) · (\d+) weigh-ins$/, '$1 · $2 lần cân'], [/^target ([+−][\d.]+ (?:kg|lb)) \/ week$/, 'mục tiêu $1 / tuần'], [/^([+−][\d.]+ (?:kg|lb)) \/ week$/, '$1 / tuần'],
      [/^The app needs at least 6 weigh-ins spread over 14 days( since your last adjustment)? to judge your trend \((\d+) so far\)\.$/, (m, s, n) => `Ứng dụng cần ít nhất 6 lần cân trải đều trong 14 ngày${s ? ' kể từ lần điều chỉnh gần nhất' : ''} để đánh giá xu hướng của bạn (hiện có ${n}).`],
      [/^Your trend is (.+) but your target is (.+)\. Change your calories by ([+−]\d+) kcal a day \(about ([\d,]+) kcal\)\.$/, (m, a, b, c, d) => `Xu hướng của bạn là ${wkVi(a)} nhưng mục tiêu là ${wkVi(b)}. Hãy đổi calo ${c} kcal mỗi ngày (khoảng ${d} kcal).`],
      [/^Your trend is (.+) against a target of (.+)\. Keep your calories where they are\.$/, (m, a, b) => `Xu hướng của bạn là ${wkVi(a)} so với mục tiêu ${wkVi(b)}. Hãy giữ nguyên calo.`],
      [/^Current adjustment: ([+−]\d+) kcal a day$/, 'Điều chỉnh hiện tại: $1 kcal mỗi ngày'],
      [/^Saved (.+)$/, 'Đã lưu $1'], [/^Loaded (.+)$/, 'Đã tải $1'], [/^Deleted (.+)$/, 'Đã xóa $1'], [/^Switched to (Bulk|Maingain) targets$/, 'Đã chuyển sang mục tiêu $1'],
    ],
    units: s => s.replace(/\bmin\b/g, 'phút').replace(/\bsets\b/g, 'set').replace(/\bweeks\b/g, 'tuần').replace(/\bweek\b/g, 'tuần').replace(/\bdays\b/g, 'ngày').replace(/\bday\b/g, 'ngày').replace(/\bper\b/g, 'mỗi'),
  };
  Object.keys(SESS_VI).forEach(b => ['', ' A', ' B', ' C'].forEach(sx => { VI.exact[b + sx] = SESS_VI[b] + sx; }));
  Object.entries(DAY_VI).forEach(([k, v]) => { VI.exact[k] = v; });

  const LANGS = { en: null, vi: VI };
  let LANG = 'en';
  const EN_TITLE = document.title;
  function trStr(s) {
    const L = LANGS[LANG];
    if (!L) return s;
    const m = s.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const core = m[2];
    if (!core) return s;
    let out = L.exact[core];
    if (out === undefined) for (const [re, rep] of L.patterns) { if (re.test(core)) { out = core.replace(re, rep); break; } }
    if (out === undefined && L.units && core.length <= 48 && /\d/.test(core)) { const u = L.units(core); if (u !== core) out = u; }
    return out === undefined ? s : m[1] + out + m[3];
  }
  const trList = (s, sep = ', ') => s.split(sep).map(x => trStr(x)).join(sep);
  function applyLang(root) {
    root = root || document.body;
    const L = LANGS[LANG];
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = w.nextNode())) {
      if (/^(SCRIPT|STYLE)$/.test(node.parentNode.nodeName)) continue;
      if (node.__en === undefined) node.__en = node.nodeValue;
      const out = L ? trStr(node.__en) : node.__en;
      if (node.nodeValue !== out) node.nodeValue = out;
    }
    root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el => {
      for (const at of ['placeholder', 'aria-label', 'title']) {
        if (!el.hasAttribute(at)) continue;
        const k = { placeholder: 'enPlaceholder', 'aria-label': 'enAria', title: 'enTitle' }[at];
        if (el.dataset[k] === undefined) el.dataset[k] = el.getAttribute(at);
        const out = L ? trStr(el.dataset[k]) : el.dataset[k];
        if (el.getAttribute(at) !== out) el.setAttribute(at, out);
      }
    });
  }
  function setLang(l) {
    LANG = LANGS[l] !== undefined ? l : 'en';
    document.documentElement.lang = LANG;
    document.title = LANG === 'en' ? EN_TITLE : trStr(EN_TITLE);
    applyLang(document.body);
    if ($('lang')) $('lang').value = LANG;
  }

  // ---------------------------------------------------------------- DOM helpers
  const $ = id => document.getElementById(id);
  const parseJson = (s, d) => { try { const v = JSON.parse(s); return v && typeof v === 'object' ? v : d; } catch (_) { return d; } };
  let lastPlan = null;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const r0 = n => Math.round(n);
  const r5 = n => Math.round(n / 5) * 5;
  const fmt = n => r0(n).toLocaleString('en-US');

  function toast(msg) {
    const t = $('toast'); t.textContent = LANG === 'en' ? msg : trStr(msg); t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 2200);
  }

  // ---------------------------------------------------------------- Build form pieces
  function buildWeakChips() {
    $('weak-list').innerHTML = WEAK_OPTIONS.map(([id, label]) =>
      `<label class="chip"><input type="checkbox" id="weak-${id}" value="${id}"><span>${esc(label)}</span></label>`).join('');
  }
  function buildJointChips() {
    $('joint-list').innerHTML = JOINTS.map(([id, label]) =>
      `<label class="chip"><input type="checkbox" value="${id}"><span>${esc(label)}</span></label>`).join('');
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
    const steps = Math.min(30000, Math.max(500, num('steps') ?? 6500));
    return {
      cardio: readCardio(units),
      name: $('name').value.trim(),
      sex: $('sex').value, age: num('age') ?? 25, units, weightKg, heightCm,
      weightRaw: num('weight'), heightCmRaw: num('height-cm'), heightFt: num('height-ft'), heightIn: num('height-in'),
      bf: num('bf'), exp: $('exp').value, style: $('style').value, trainDays, days: trainDays.length, session: +$('session').value,
      double: $('double').value, pmSession: +$('pm-session').value,
      trainMin: (+$('session').value || 75) + ($('double').value !== 'off' ? (+$('pm-session').value || 45) : 0),
      steps, activity: stepFactor(steps),
      joints: [...document.querySelectorAll('#joint-list input:checked')].map(i => i.value),
      swaps: parseJson($('swaps').value, {}),
      cycle: $('cycle').value,
      adjust: Math.max(-500, Math.min(500, num('adjust') ?? 0)), adjustDate: $('adjust-date').value,
      goal: document.querySelector('input[name="goal"]:checked').value,
      rate: +$('rate').value, goalBf: num('goal-bf'),
      macro: (document.querySelector('input[name="macro"]:checked') || {}).value || 'bal',
      weak: [...document.querySelectorAll('#weak-list input:checked')].map(i => i.value),
      equip: [...document.querySelectorAll('#equip-list input:checked')].map(i => i.value),
    };
  }

  function writeState(s) {
    const set = (id, v) => { if (v !== undefined && v !== null && $(id)) $(id).value = v; };
    set('name', s.name || ''); set('sex', s.sex); set('age', s.age); set('units', s.units);
    set('weight', s.weightRaw); set('height-cm', s.heightCmRaw); set('height-ft', s.heightFt); set('height-in', s.heightIn);
    $('bf').value = s.bf ?? ''; set('exp', s.exp); set('style', s.style || 'std'); set('session', s.session);
    $('steps').value = s.steps ?? OLD_ACTIVITY_STEPS[String(s.activity)] ?? 6500; set('rate', s.rate); set('double', s.double || 'off'); set('pm-session', s.pmSession); $('goal-bf').value = s.goalBf ?? '';
    if (s.goal && $('goal-' + s.goal)) $('goal-' + s.goal).checked = true;
    document.querySelectorAll('#joint-list input').forEach(i => { i.checked = (s.joints || []).includes(i.value); });
    $('swaps').value = JSON.stringify(s.swaps || {});
    $('cycle').value = s.cycle === 'on' ? 'on' : 'off';
    $('adjust').value = s.adjust ?? 0; $('adjust-date').value = s.adjustDate || '';
    const mc = $('macro-' + (s.macro || 'bal')); if (mc) mc.checked = true;
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
          label = `Lose about ${(weeklyKg / kg * 100).toFixed(2)}% of body weight per week (held back by the minimum-intake floor)`;
        }
      }
      if (p.rate >= 1.25) {
        warnings.push({ bad: false, t: 'Aggressive cut: keep it short', d: 'Losing 1.25% of body weight a week works best for 4 to 6 weeks at a time and when you have body fat to spare. Expect more hunger, flatter workouts and a higher risk of losing muscle. Keep protein high, keep lifting heavy, and take a 1-week break at maintenance after each block.' });
        if (p.bf && ((p.sex === 'm' && p.bf < 15) || (p.sex === 'f' && p.bf < 24))) warnings.push({ bad: true, t: 'Aggressive cut at low body fat', d: 'At your body fat this speed puts muscle at real risk. Use Standard (0.75%) or Fast (1%) instead.' });
        if (!lbm) warnings.push({ bad: false, t: 'Add your body fat %', d: 'Without it the app cannot protect a minimum energy intake, so check that the calories above are not too low for you.' });
      } else if (p.rate >= 1 && p.bf && ((p.sex === 'm' && p.bf < 12) || (p.sex === 'f' && p.bf < 20))) {
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
    const adj = Math.max(-500, Math.min(500, p.adjust || 0));
    if (adj) {
      target += adj;
      warnings.push({ bad: false, t: 'Progress adjustment', d: `Your target includes ${adj > 0 ? '+' : '−'}${Math.abs(adj)} kcal a day from your weight log. Reset it on the Progress tab.` });
    }
    const absFloor = p.sex === 'm' ? 1500 : 1200;
    if (target < absFloor) { target = absFloor; warnings.push({ bad: true, t: 'Very low intake', d: `Calories were set to the minimum of ${absFloor} kcal. Talk to a doctor or dietitian before eating less.` }); }
    target = Math.round(target / 10) * 10;

    const style = MACRO_STYLES[p.macro] ? p.macro : 'bal';
    let protein;
    if (p.goal === 'cut') protein = lbm ? 2.6 * lbm : (highBf ? 1.8 : 2.2) * kg;
    else if (lbm && highBf) protein = 2.4 * lbm;
    else protein = (p.goal === 'bulk' ? 1.8 : 2.0) * kg;
    protein = r5(Math.min(protein * MACRO_STYLES[style].prot, 3.0 * kg));

    const minFat = (p.goal === 'cut' ? 0.5 : 0.7) * kg;
    let fat, carbs;
    if (style === 'lc' || style === 'keto') {
      carbs = style === 'keto' ? 30 : 1.5 * kg;
      fat = (target - protein * 4 - carbs * 4) / 9;
      if (fat < minFat) { fat = minFat; carbs = (target - protein * 4 - fat * 9) / 4; }
    } else {
      const fatCal = style === 'hc' ? 0.15 : (p.goal === 'cut' ? 0.22 : 0.27);
      fat = Math.max(minFat, fatCal * target / 9);
      carbs = (target - protein * 4 - fat * 9) / 4;
      if (carbs < 1.5 * kg) { fat = minFat; carbs = (target - protein * 4 - fat * 9) / 4; }
    }
    fat = r5(fat); carbs = Math.max(0, r5(carbs));
    if (style === 'keto') warnings.push({ bad: false, t: 'Keto and heavy lifting', d: 'Evidence for muscle gain on very low carbs is limited, and high-volume sessions often feel flat for the first 2 to 4 weeks. Keep sodium, potassium and magnesium up. If training suffers, switch to Low carb and eat some carbs around your session.' });

    const ea = lbm ? (target - exKcalDay) / lbm : null;
    let cutPlan = null;
    if (p.goal === 'cut' && lbm && p.goalBf && p.goalBf < p.bf) {
      const goalW = lbm / (1 - p.goalBf / 100);
      const toLose = kg - goalW;
      const weeks = toLose / Math.max(weeklyKg, 0.05);
      const breaks = Math.floor(weeks / (p.rate >= 1.25 ? 4 : 6));
      cutPlan = { goalW, toLose, weeks: Math.ceil(weeks), breaks, total: Math.ceil(weeks) + breaks };
      if (cutPlan.total > 20) warnings.push({ bad: false, t: 'Long cut ahead', d: 'Split it into blocks of 12–16 weeks with 4–8 weeks at maintenance in between.' });
    }
    let after = null;
    if (p.goal === 'cut') {
      const wAfter = cutPlan ? cutPlan.goalW : kg;
      const r10 = x => Math.round(x / 10) * 10;
      after = { wAfter, rows: [
        { name: 'Maintain', kcal: r10(tdee), rate: 0, protein: r5(2.0 * wAfter) },
        { name: 'Maingain', kcal: r10(tdee + [150, 100, 75][e]), rate: [0.25, 0.15, 0.1][e], protein: r5(2.0 * wAfter), goal: 'main' },
        { name: 'Lean bulk', kcal: r10(tdee * (1 + [0.15, 0.10, 0.06][e])), rate: [0.5, 0.35, 0.2][e], protein: r5(1.8 * wAfter), goal: 'bulk' },
      ] };
    }
    let cycle = null;
    if (p.cycle === 'on' && style !== 'keto' && p.days >= 1 && p.days <= 6) {
      const minRest = Math.max(absFloor, protein * 4 + fat * 9);
      const X = Math.min(Math.max(150, Math.min(450, 0.15 * target)), (target - minRest) * 7 / p.days); // extra kcal on a lifting day vs a rest day
      if (X >= 50) {
        const trainK = target + X * (7 - p.days) / 7, restK = target - X * p.days / 7;
        const carbsOf = k => Math.max(0, r5((k - protein * 4 - fat * 9) / 4));
        cycle = { days: p.days, train: { kcal: Math.round(trainK / 10) * 10, carbs: carbsOf(trainK) }, rest: { kcal: Math.round(restK / 10) * 10, carbs: carbsOf(restK) } };
      }
    }
    const meals = 4;
    return { kg, lbm, bmr, method, factor, tdee, cardioDay, cardioWeek, target, protein, fat, carbs, ratePct, weeklyKg, label, warnings, ea,
      styleName: MACRO_STYLES[style].n, after, cycle, fibre: r0(target * 14 / 1000), perMeal: r5(Math.min(protein / meals, Math.max(0.4 * kg, 25))), meals, cutPlan,
      waterRest: 0.035 * kg, waterTrain: 0.035 * kg + 0.75 * p.trainMin / 60 };
  }

  // ---------------------------------------------------------------- Training plan
  function weeklySets(p) {
    const e = EXP_IDX[p.exp];
    const weak = new Set(p.weak.map(w => w === 'upperChest' ? 'chest' : w));
    const out = {};
    for (const [m] of MUSCLES) {
      let s = BASE_SETS[m][e];
      if (weak.has(m)) s = WEAK_FLOOR[m] ? WEAK_FLOOR[m][e] : s + WEAK_BONUS[e];
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
    // a session length of 0 means "no limit": nothing is trimmed for time
    const amLim = p.session > 0 ? p.session : Infinity, pmLim = p.pmSession > 0 ? p.pmSession : Infinity;
    const sb = p.style === 'sb'; // science-based: 2 all-out sets per exercise
    const setMin = sb ? 2.8 : 2.4; // minutes per set incl. rest
    const upperEmph = p.weak.includes('upperChest');
    const have = new Set(p.equip);
    const joints = new Set(p.joints || []);
    const swaps = p.swaps || {};
    const usable = id => EX[id].eq.every(q => have.has(q)) && !(EX[id].j || []).some(t => joints.has(t));
    const sessions = split.days.map(([name], i) => ({ name, day: p.trainDays[i], muscles: {} }));
    // useful hard sets per muscle per session; splitting a day in two allows a little more per day
    const cap = m => (weak.has(m) ? 8 : 6) + (mode === 'split' ? 3 : 0);
    // never trim a muscle below this many hard sets per week (maintenance-level volume)
    const WEEK_MIN = { chest: 6, lats: 6, upperBack: 6, traps: 0, quads: 6, hamstrings: 6, glutes: 4, frontDelts: 0, sideDelts: 6, rearDelts: 4, triceps: 4, biceps: 4, calves: 4, abs: 2 };
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
      if (mode === 'split') units.push({ sess, part: 'all', limit: amLim + pmLim, warm: 16 });
      else {
        units.push({ sess, part: 'am', limit: amLim, warm: 8 });
        if (mode === 'small') units.push({ sess, part: 'pm', limit: pmLim, warm: 5 });
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
    for (const [si, sess] of sessions.entries()) {
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
          const key = `${si}|${m}|${j}`;
          let pick = free[o % Math.min(2, free.length)];
          if (swaps[key] && free.includes(swaps[key])) pick = swaps[key]; // the lifter swapped this exercise
          used.add(pick);
          items.push({ m, id: pick, sets: ps, weak: weak.has(m), j, key });
        });
      }
      items.sort((a, b) =>
        (b.weak - a.weak) || ((a.weak && b.weak) ? 0 : (EX[a.id].k === 'c' ? 0 : 1) - (EX[b.id].k === 'c' ? 0 : 1)) || (ORDER[a.m] - ORDER[b.m]) || (a.j - b.j));

      // other exercises this slot could be swapped for, starting with the next one in the ranking
      for (const it of items) {
        const L = LISTS[it.m];
        const full = [...new Set([...L.p, ...L.s])].filter(usable);
        const others = new Set(items.filter(x => x !== it).map(x => x.id));
        const cand = full.filter(id => id !== it.id && !others.has(id));
        const at = full.indexOf(it.id);
        it.alts = [...cand.filter(id => full.indexOf(id) > at), ...cand.filter(id => full.indexOf(id) < at)];
      }

      // 4) morning / evening
      sess.am = []; sess.pm = [];
      if (mode === 'small') items.forEach(it => sess[partOf(it.m)].push(it));
      else if (mode === 'split') {
        const total = items.reduce((a, b) => a + b.sets, 0);
        const target = total * (isFinite(amLim) && isFinite(pmLim) ? amLim / (amLim + pmLim) : 0.5);
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
      if (mode === 'split') { if (sess.minutes > amLim + pmLim + 2) overTime.push(sess.name); }
      else {
        if (sess.amMin > amLim + 2) overTime.push(sess.name);
        if (sess.pmMin > pmLim + 2) overTime.push(sess.name + ' (evening)');
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
    const cycleBlock = n.cycle ? `
      <div>
        <h3>Lifting days vs rest days</h3>
        <p class="hint" style="margin:2px 0 10px">Protein and fat stay the same every day; carbs move with training. Your weekly average is still ${fmt(n.target)} kcal a day. Cardio-only days count as rest days.</p>
        <div class="tbl-wrap"><table>
          <thead><tr><th>Day type</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr></thead>
          <tbody>
            <tr><td>Lifting day (${n.cycle.days} per week)</td><td class="num">${fmt(n.cycle.train.kcal)} kcal</td><td class="num">${n.protein} g</td><td class="num">${n.cycle.train.carbs} g</td><td class="num">${n.fat} g</td></tr>
            <tr><td>Rest day (${7 - n.cycle.days} per week)</td><td class="num">${fmt(n.cycle.rest.kcal)} kcal</td><td class="num">${n.protein} g</td><td class="num">${n.cycle.rest.carbs} g</td><td class="num">${n.fat} g</td></tr>
          </tbody></table></div>
      </div>` : (p.cycle === 'on' ? '<div class="callout"><b>Calorie cycling is off for this plan</b>Keto, or too little room above the minimum safe intake, means every day uses the same calories.</div>' : '');
    const afterBlock = n.after ? `
      <div>
        <h3>After the cut</h3>
        <p class="hint" style="margin:2px 0 10px">Calories below assume the same training and activity as now. Your lean mass should be about the same, so maintenance stays close to today's number; re-check it with your weekly average weight.</p>
        <div class="tbl-wrap"><table>
          <thead><tr><th>Next phase</th><th>Calories</th><th>Weight / week</th><th>Protein</th><th></th></tr></thead>
          <tbody>${n.after.rows.map(r => `<tr><td>${r.name}</td><td class="num">${fmt(r.kcal)} kcal</td><td class="num">${r.rate ? '+' + wUnit(p, n.after.wAfter * r.rate / 100, 2) : 'steady'}</td><td class="num">≈ ${r.protein} g</td><td>${r.goal ? `<button type="button" class="btn small ghost" data-set-goal="${r.goal}">Use this</button>` : ''}</td></tr>`).join('')}</tbody></table></div>
        <ul class="tight">
          <li>Step calories up over 1 to 2 weeks (about 100–200 kcal a week, mostly carbs) instead of jumping straight to the new number.</li>
          <li>Hold maintenance for 2 to 4 weeks first if you feel run down, then move to Maingain or a Lean bulk.</li>
          <li>Keep training: switch the goal above and the plan gives every muscle its full weekly sets back (cut plans trim non-priority muscles by about 15%). Start a fresh 6-week block at about 3 RIR with last block's weights, then keep using double progression and add weight whenever you reach the top of the rep range.</li>
          <li>Strength should climb as calories return. If weight rises faster than the rate above, remove 100–150 kcal.</li>
        </ul>
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
      ${warn}${cut}${cycleBlock}
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
            <tr><td>Macro style</td><td>${esc(n.styleName)}</td></tr>
            <tr><td>Daily steps</td><td class="num">${fmt(p.steps)}</td></tr>
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
          <li>${p.goal === 'cut' ? `8,000–12,000 steps a day; take a 1-week diet break at maintenance every ${p.rate >= 1.25 ? '4' : '6–8'} weeks.` : '7,000–10,000 steps a day plus 1–2 short, easy cardio sessions per week.'}</li>
          <li>Eat protein and vegetables first in a meal; a 10-minute walk after big meals helps blood sugar.</li>
          <li>Keep alcohol low — it blunts muscle building and sleep.</li>
        </ul></div>
      </div>
      ${afterBlock}`;
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
    if (p.session === 0 || (p.double !== 'off' && p.pmSession === 0)) {
      const mins = plan.sessions.map(s => s.minutes);
      const longest = Math.max(...mins), avg = Math.round(mins.reduce((x, y) => x + y, 0) / mins.length);
      notes.push({ soft: true, t: 'No time limit', d: `Nothing is trimmed for time. Sessions average about ${avg} min, the longest about ${longest} min.${longest > 120 ? ' Sessions over about 2 hours usually mean the late sets are done tired; consider another training day, fewer priorities, or splitting the day into two sessions.' : ''}` });
    }
    if (p.weak.length > 4) notes.push({ soft: true, t: 'Lots of priorities', d: 'Priority muscles are never trimmed and each gets extra sets, so sessions get long and recovery gets harder. If it feels like too much, keep 3 to 4 priorities or add a training day.' });
    if (p.goal === 'cut') notes.push({ soft: true, t: 'Cut volume', d: 'While you cut, muscles that are not priorities get about 15% fewer weekly sets. Priority muscles keep full volume. Switch the goal to Maingain or Bulk to get full volume back.' });
    if (plan.trimmed) notes.push({ soft: true, t: 'Some sets were trimmed to fit your session length', d: 'Non-priority muscles lost a few sets. Choose a longer session or more days to train everything at full volume.' });
    if (plan.overTime.length) notes.push({ soft: true, t: 'Some sessions run over your time limit', d: `${plan.overTime.join(', ')} keep minimum volume for every muscle, so they run a bit long. Pick fewer priorities, a longer session, or more days.` });
    if (plan.lost.length) notes.push({ t: 'Per-session cap reached', d: `${plan.lost.map(m => MUSCLE_LABEL[m]).join(', ')} hit the limit of about 8 useful sets per session, so the extra sets were dropped. More training days would spread them out.` });
    if (plan.fewEx.length) notes.push({ soft: true, t: 'Not enough different exercises', d: `${plan.fewEx.map(m => MUSCLE_LABEL[m]).join(', ')} ran out of different exercises with your ticked equipment, so a few sets were left out to keep 2 sets per exercise. Tick more machines or cables to get the full volume.` });
    if (plan.missing.length) notes.push({ t: 'Missing equipment', d: `No exercise is left for: ${plan.missing.map(m => MUSCLE_LABEL[m]).join(', ')}. Tick dumbbells/bench or a matching machine, or switch off a joint filter.` });
    if (p.joints && p.joints.length) notes.push({ soft: true, t: `Joint-friendly mode: ${p.joints.map(j => JOINT_NAME[j]).join(', ')}`, d: 'Exercises that commonly aggravate these joints were skipped. This is a convenience filter, not medical advice: use a pain-free range, stop anything that hurts, and see a physio or doctor if pain persists.' });

    const vol = MUSCLES.filter(([m]) => plan.finalSets[m]).map(([m, label]) => {
      const w = plan.weak.has(m);
      return `<div class="lab${w ? ' weak' : ''}">${esc(label)}</div><div class="bar"><div class="${w ? 'weak' : ''}" style="width:${plan.finalSets[m] / maxSets * 100}%"></div></div><div class="n">${plan.finalSets[m]}</div>`;
    }).join('');

    const rows = list => list.map(it => {
      const x = EX[it.id];
      return `<tr><td class="ex"><b><span class="tag m">${esc(MUSCLE_LABEL[it.m])}</span>${esc(x.n)}${it.weak ? '<span class="tag weak">Priority</span>' : ''}${it.alts && it.alts.length ? `<button type="button" class="swap" data-swap="${esc(it.key)}" title="Swap exercise">Swap</button>` : ''}</b><span class="note">${esc(x.t)}</span></td>
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
        : '<div class="callout"><b>No weak points picked</b>Choose up to six in the form to add extra volume to those muscles.</div>'}
      ${sb ? `<div class="callout"><b>Science-based style: 2 hard sets per exercise</b>Fewer sets per exercise but every set close to failure, with longer rests and more exercise variety per muscle. Weekly sets per muscle stay in the 10–20 range that research links to the most growth.</div>` : ''}
      ${doubleTip}
      ${notes.map(x => `<div class="callout${x.soft ? '' : ' bad'}"><b>${esc(x.t)}</b>${esc(x.d)}</div>`).join('')}
      ${Object.keys(p.swaps || {}).length ? '<div class="callout"><b>Swapped exercises</b>You changed some exercises. Swaps only apply while the same slot exists in the plan. <button type="button" class="btn small ghost" data-reset-swaps>Reset swaps</button></div>' : ''}
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

  // ---------------------------------------------------------------- Progress tracker
  const WLOG_KEY = 'pp_weights';
  const logKey = () => $('profile-select').value || '_';
  function loadLog() {
    try { const all = JSON.parse(localStorage.getItem(WLOG_KEY) || '{}'); return Array.isArray(all[logKey()]) ? all[logKey()] : []; } catch (_) { return []; }
  }
  function saveLog(list) {
    try { const all = JSON.parse(localStorage.getItem(WLOG_KEY) || '{}'); all[logKey()] = list; localStorage.setItem(WLOG_KEY, JSON.stringify(all)); return true; } catch (_) { return false; }
  }
  const pad2 = x => String(x).padStart(2, '0');
  function todayStr() { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
  const dayNum = s => { const [y, m, d] = s.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 86400000); };
  const sum = arr => arr.reduce((x, y) => x + y, 0);

  // Least-squares weight trend over the last 4 weeks (only entries after the last applied adjustment).
  function analyseLog(log, p, n) {
    const all = [...log].sort((x, y) => (x.d < y.d ? -1 : 1));
    const out = { all, ready: false, win: 0, expected: p.goal === 'cut' ? -n.weeklyKg : n.weeklyKg };
    if (!all.length) return out;
    const last = dayNum(all[all.length - 1].d);
    const win = all.filter(e => dayNum(e.d) > last - 28 && (!p.adjustDate || e.d > p.adjustDate));
    out.win = win.length;
    if (win.length < 6 || dayNum(win[win.length - 1].d) - dayNum(win[0].d) < 14) return out;
    const x0 = dayNum(win[0].d);
    const xs = win.map(e => dayNum(e.d) - x0), ys = win.map(e => e.w);
    const mx = sum(xs) / xs.length, my = sum(ys) / ys.length;
    let sxx = 0, sxy = 0;
    xs.forEach((x, i) => { sxx += (x - mx) ** 2; sxy += (x - mx) * (ys[i] - my); });
    out.rate = sxx ? sxy / sxx * 7 : 0; // kg per week
    out.ready = true;
    out.diff = out.rate - out.expected;
    const tol = Math.max(0.1, Math.abs(out.expected) * 0.25);
    if (Math.abs(out.diff) > tol) {
      const corr = Math.round(Math.max(-300, Math.min(300, -out.diff * 1100)) / 25) * 25; // 7700 kcal per kg, per day
      const next = Math.max(-500, Math.min(500, (p.adjust || 0) + corr));
      out.corr = next - (p.adjust || 0);
      if (Math.abs(out.corr) >= 50) out.suggest = next;
    }
    return out;
  }

  function chartSvg(all, p) {
    const pts = all.slice(-60);
    if (pts.length < 2) return '';
    const W = 640, H = 190, L = 46, R = 12, T = 12, B = 24;
    const disp = kg => p.units === 'imperial' ? kg / 0.45359237 : kg;
    const x0 = dayNum(pts[0].d), span = Math.max(1, dayNum(pts[pts.length - 1].d) - x0);
    const vals = pts.map(e => disp(e.w));
    let lo = Math.min(...vals), hi = Math.max(...vals);
    const pv = Math.max(0.5, (hi - lo) * 0.15); lo -= pv; hi += pv;
    const X = d => L + (dayNum(d) - x0) / span * (W - L - R);
    const Y = v => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
    const avg = pts.map(e => { const near = pts.filter(q => dayNum(q.d) <= dayNum(e.d) && dayNum(q.d) > dayNum(e.d) - 7); return disp(sum(near.map(q => q.w)) / near.length); });
    const line = pts.map((e, i) => `${X(e.d).toFixed(1)},${Y(avg[i]).toFixed(1)}`).join(' ');
    const dots = pts.map((e, i) => `<circle cx="${X(e.d).toFixed(1)}" cy="${Y(vals[i]).toFixed(1)}" r="3" fill="var(--accent)" fill-opacity=".45"/>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Weight over time" style="width:100%;height:auto;display:block">
      <line x1="${L}" y1="${T}" x2="${L}" y2="${H - B}" stroke="var(--line)"/><line x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}" stroke="var(--line)"/>
      <text x="${L - 6}" y="${T + 9}" text-anchor="end">${hi.toFixed(1)}</text><text x="${L - 6}" y="${H - B}" text-anchor="end">${lo.toFixed(1)}</text>
      <text x="${L}" y="${H - 6}">${pts[0].d}</text><text x="${W - R}" y="${H - 6}" text-anchor="end">${pts[pts.length - 1].d}</text>
      ${dots}<polyline points="${line}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
  }

  function renderProgress(p, n) {
    const log = loadLog();
    const an = analyseLog(log, p, n);
    const all = an.all;
    const unit = p.units === 'imperial' ? 'lb' : 'kg';
    const sr = kg => `${kg >= 0 ? '+' : '−'}${wUnit(p, Math.abs(kg), 2)} / week`;
    let kpis = '';
    if (all.length) {
      const lastD = dayNum(all[all.length - 1].d);
      const recent = all.filter(e => dayNum(e.d) > lastD - 7);
      const avg7 = sum(recent.map(e => e.w)) / recent.length;
      const ch = all[all.length - 1].w - all[0].w;
      kpis = `<div class="kpis">
        <div class="kpi" style="--c:var(--ink)"><div class="k">Latest</div><div class="v">${wUnit(p, all[all.length - 1].w).replace(/ (kg|lb)$/, '')}</div><div class="u">${unit} · ${all[all.length - 1].d}</div></div>
        <div class="kpi" style="--c:var(--accent)"><div class="k">7-day average</div><div class="v">${wUnit(p, avg7).replace(/ (kg|lb)$/, '')}</div><div class="u">${unit}</div></div>
        <div class="kpi" style="--c:var(--yellow)"><div class="k">Change since first</div><div class="v">${ch >= 0 ? '+' : '−'}${wUnit(p, Math.abs(ch)).replace(/ (kg|lb)$/, '')}</div><div class="u">${unit} · ${all.length} weigh-ins</div></div>
        <div class="kpi" style="--c:var(--green)"><div class="k">Trend (4 weeks)</div><div class="v" style="font-size:1.1rem">${an.ready ? sr(an.rate) : '—'}</div><div class="u">target ${sr(an.expected)}</div></div>
      </div>`;
    }
    let verdict;
    if (!all.length) verdict = '<div class="callout"><b>Add your first weigh-in</b>Weigh yourself every morning after the toilet, before eating. After two weeks the app can check your progress against your target and suggest a calorie change.</div>';
    else if (!an.ready) verdict = `<div class="callout"><b>Keep logging</b>The app needs at least 6 weigh-ins spread over 14 days${p.adjustDate ? ' since your last adjustment' : ''} to judge your trend (${an.win} so far).</div>`;
    else if (an.suggest !== undefined) verdict = `<div class="callout"><b>${an.corr > 0 ? 'Eat a little more' : 'Eat a little less'}</b>Your trend is ${sr(an.rate)} but your target is ${sr(an.expected)}. Change your calories by ${an.corr > 0 ? '+' : '−'}${Math.abs(an.corr)} kcal a day (about ${fmt(n.target + an.corr)} kcal). <button type="button" class="btn small" data-apply-adj="${an.suggest}">Apply this change</button></div>`;
    else verdict = `<div class="callout"><b>On track</b>Your trend is ${sr(an.rate)} against a target of ${sr(an.expected)}. Keep your calories where they are.</div>`;
    const adjNote = p.adjust ? `<div class="callout"><b>Current adjustment: ${p.adjust > 0 ? '+' : '−'}${Math.abs(p.adjust)} kcal a day</b>It is already included in your targets. <button type="button" class="btn small ghost" data-reset-adj>Reset to plan</button></div>` : '';
    const rows = [...all].reverse().slice(0, 14).map(e => `<tr><td class="num">${e.d}</td><td class="num">${wUnit(p, e.w)}</td><td><button type="button" class="btn small ghost" data-del="${e.d}">Delete</button></td></tr>`).join('');
    return `
      <div class="split-head"><h2>Progress tracker</h2><p>Weigh in each morning; the app compares your trend with your target.</p></div>
      <div class="pg-add">
        <div class="field"><label for="pg-date">Date</label><input id="pg-date" type="date" value="${todayStr()}"></div>
        <div class="field"><label for="pg-weight">Weight (${unit})</label><input id="pg-weight" type="number" step="0.1" min="30" max="900" inputmode="decimal"></div>
        <button type="button" class="btn" id="pg-add">Add weigh-in</button>
      </div>
      ${kpis}
      ${chartSvg(all, p)}
      ${verdict}${adjNote}
      ${rows ? `<div class="tbl-wrap"><table><thead><tr><th>Date</th><th>Weight</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>` : ''}
      <p class="hint">Entries are saved in this browser under the selected lifter. Single days jump around by 1 to 2 kg from water and food, so the trend matters more than any one weigh-in.</p>`;
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
    const pre = $('steps-preset'); pre.value = [...pre.options].some(o => o.value === String(p.steps)) ? String(p.steps) : '';
    $('steps-hint').textContent = `Counts as × ${p.activity.toFixed(2)} on your resting burn, before lifting and cardio. Use your weekly average and leave out the treadmill sessions you add below.`;
    $('macro-hint').textContent = (MACRO_STYLES[p.macro] || MACRO_STYLES.bal).d;
    const n = p.weak.length;
    document.querySelectorAll('#weak-list input').forEach(i => { i.disabled = !i.checked && n >= MAX_WEAK; });
    $('equip-count').textContent = `${p.equip.length}/${ALL_EQUIP.length}`;
    document.querySelectorAll('#day-list input').forEach(i => { i.disabled = !i.checked && p.days >= 6; });
    $('days-count').textContent = `${p.days} day${p.days === 1 ? '' : 's'}`;
  }

  function update() {
    const p = readState();
    syncUi(p);
    const plan = p.days >= 2 && p.days <= 6 ? buildPlan(p) : null;
    if (plan && (p.session === 0 || (p.double !== 'off' && p.pmSession === 0))) {
      const mins = plan.sessions.map(s => s.minutes).filter(Boolean); // no time limit: use the planned session length for calories
      if (mins.length) p.trainMin = Math.round(mins.reduce((x, y) => x + y, 0) / mins.length);
    }
    const nut = nutrition(p);
    $('panel-nutrition').innerHTML = renderNutrition(p, nut);
    $('panel-progress').innerHTML = renderProgress(p, nut);
    lastPlan = plan;
    $('panel-training').innerHTML = renderTraining(p, plan);
    p.cardio.forEach((c, i) => { const el = $('c-est-' + i); if (el) el.textContent = `≈ ${fmt(cardioInfo(c, p.weightKg).kcal)} kcal`; });
    try { localStorage.setItem('pp_last', JSON.stringify(p)); } catch (_) { /* storage blocked */ }
    if (LANG !== 'en') applyLang(document.body);
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

  function applyTheme(t) {
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme');
    const b = $('btn-theme');
    if (b) { b.textContent = { auto: 'Theme: Auto', light: 'Theme: Light', dark: 'Theme: Dark' }[t] || 'Theme: Auto'; if (LANG !== 'en') applyLang(b); }
  }
  function selectTab(which) {
    ['nutrition', 'training', 'progress'].forEach(t => {
      $('tab-' + t).setAttribute('aria-selected', String(t === which));
      $('panel-' + t).hidden = t !== which;
    });
  }

  // ---------------------------------------------------------------- Init
  function init() {
    buildWeakChips();
    buildJointChips();
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
    $('panel-nutrition').addEventListener('click', ev => {
      const b = ev.target.closest('[data-set-goal]');
      if (!b) return;
      const g = $('goal-' + b.dataset.setGoal);
      if (g) { g.checked = true; update(); toast(`Switched to ${b.dataset.setGoal === 'bulk' ? 'Bulk' : 'Maingain'} targets`); }
    });
    $('steps-preset').addEventListener('change', () => { if ($('steps-preset').value) $('steps').value = $('steps-preset').value; });
    $('panel-training').addEventListener('click', ev => {
      const sw = ev.target.closest('[data-swap]');
      if (sw && lastPlan) {
        const it = lastPlan.sessions.flatMap(s => s.items).find(x => x.key === sw.dataset.swap);
        if (it && it.alts.length) {
          const swaps = parseJson($('swaps').value, {}); swaps[it.key] = it.alts[0];
          $('swaps').value = JSON.stringify(swaps); update();
        }
        return;
      }
      if (ev.target.closest('[data-reset-swaps]')) { $('swaps').value = '{}'; update(); toast('Swaps reset'); }
    });
    function addWeighIn() {
      const date = $('pg-date').value, raw = parseFloat($('pg-weight').value);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(raw)) { toast('Enter a date and a weight.'); return; }
      const kg = $('units').value === 'imperial' ? raw * 0.45359237 : raw;
      if (kg < 30 || kg > 400) { toast('That weight does not look right.'); return; }
      const log = loadLog().filter(e => e.d !== date);
      log.push({ d: date, w: +kg.toFixed(2) });
      log.sort((x, y) => (x.d < y.d ? -1 : 1));
      if (!saveLog(log.slice(-400))) { toast('Saving is blocked in this browser.'); return; }
      update(); toast('Weigh-in added');
    }
    $('panel-progress').addEventListener('click', ev => {
      const t = ev.target;
      if (t.closest('#pg-add')) { addWeighIn(); return; }
      const del = t.closest('[data-del]');
      if (del) { saveLog(loadLog().filter(e => e.d !== del.dataset.del)); update(); return; }
      const ap = t.closest('[data-apply-adj]');
      if (ap) { $('adjust').value = ap.dataset.applyAdj; $('adjust-date').value = todayStr(); update(); toast('Calories adjusted'); return; }
      if (t.closest('[data-reset-adj]')) { $('adjust').value = '0'; $('adjust-date').value = ''; update(); toast('Adjustment reset'); }
    });
    $('panel-progress').addEventListener('keydown', ev => { if (ev.key === 'Enter' && ev.target.id === 'pg-weight') { ev.preventDefault(); addWeighIn(); } });
    // a new goal or cut speed starts a fresh calorie adjustment
    document.querySelectorAll('input[name="goal"], #rate').forEach(el => el.addEventListener('change', () => { $('adjust').value = '0'; $('adjust-date').value = ''; }));

    let theme = 'auto';
    try { theme = localStorage.getItem('pp_theme') || 'auto'; } catch (_) { /* storage blocked */ }
    applyTheme(theme);
    $('btn-theme').addEventListener('click', () => {
      const order = ['auto', 'light', 'dark'];
      theme = order[(order.indexOf(theme) + 1) % 3];
      applyTheme(theme);
      try { localStorage.setItem('pp_theme', theme); } catch (_) { /* storage blocked */ }
    });
    $('tab-nutrition').addEventListener('click', () => selectTab('nutrition'));
    $('tab-training').addEventListener('click', () => selectTab('training'));
    $('tab-progress').addEventListener('click', () => selectTab('progress'));

    $('btn-save').addEventListener('click', () => {
      const p = readState();
      if (!p.name) { toast('Type a name first, then save.'); $('name').focus(); return; }
      const all = loadProfiles(); all[p.name] = p;
      toast(saveProfiles(all) ? `Saved ${p.name}` : 'Saving is blocked in this browser.');
      try { // an unsaved weight log moves to the new lifter
        const logs = JSON.parse(localStorage.getItem(WLOG_KEY) || '{}');
        if (logs._ && !logs[p.name]) { logs[p.name] = logs._; delete logs._; localStorage.setItem(WLOG_KEY, JSON.stringify(logs)); }
      } catch (_) { /* storage blocked */ }
      refreshProfiles(p.name);
      update();
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

    $('lang').addEventListener('change', () => { try { localStorage.setItem('pp_lang', $('lang').value); } catch (_) { /* storage blocked */ } setLang($('lang').value); });
    let lang = 'en';
    try { lang = localStorage.getItem('pp_lang') || ((navigator.language || '').toLowerCase().startsWith('vi') ? 'vi' : 'en'); } catch (_) { /* storage blocked */ }
    update();
    setLang(lang);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
