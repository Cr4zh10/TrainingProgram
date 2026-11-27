# Plate Planner

A free, single-page website that builds a personal plan for you and your friends:

- **Calories and macros** for a cut, maingain or bulk, from body weight, body fat %, age, height, activity and training experience.
- **A weak-point training programme** (3–6 days per week) built from the gym's Realleader machines, cables, Smith machine and dumbbells.
- **Pick your own lifting days** (2–6, any weekdays), **twice-a-day** options, and a **science-based** 2-sets-per-exercise style.
- **Cardio sessions** on any day: treadmill with your own speed and incline (ACSM walking/running equations), or bike, elliptical, stair climber and rower by intensity. Cardio calories are added to the daily target.
- **Saved lifters** (stored in your own browser) and **share links** so each friend can open their own plan.

- **Macro styles** (balanced, high protein, high carb, low carb, keto), an optional **lifting-day vs rest-day calorie split**, and a **steps** box instead of fixed activity levels.
- **Cut speeds** up to 1.25%/week and an **After the cut** plan (maintain, maingain or lean bulk).
- **Up to 6 priority muscles** (including traps), a **Swap** button on every exercise, and a **joint-friendly mode** (knees, shoulders, lower back, elbows).
- **Progress tab**: log weigh-ins, see the trend and apply a suggested calorie change.
- **Light/dark theme** toggle and a **Vietnamese** translation (exercise names, coaching tips and equipment names stay in English). Add another language by writing a dictionary like `VI` in `app.js`.

No sign-up, no server, no build step — just `index.html`, `styles.css` and `app.js`.

## Put it online with GitHub Pages

1. Create a new **public** repository on GitHub (for example `plate-planner`).
2. Click **Add file → Upload files** and drag in `index.html`, `styles.css`, `app.js` and this `README.md`. Click **Commit changes**.
3. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose **main** and **/ (root)**, then **Save**.
4. Wait 1–2 minutes. Your site will be live at `https://<your-username>.github.io/plate-planner/`.

## Editing the gym's equipment or exercises

- Equipment list: `EQUIPMENT` at the top of `app.js`.
- Exercises: `EX` (name, equipment needed, rep range, coaching tip).
- Exercise ranking per muscle: `LISTS` (first = most preferred).
- Weekly set targets: `BASE_SETS`, `WEAK_BONUS`.

The targets follow published sports-science guidance (ISSN protein and nutrient-timing position stands, ACSM, and hypertrophy meta-analyses on volume, proximity to failure and training at long muscle lengths). They are starting points, not medical advice.
