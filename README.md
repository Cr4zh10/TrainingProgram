# Plate Planner

A free, single-page website that builds a personal plan for you and your friends:

- **Calories and macros** for a cut, maingain or bulk, from body weight, body fat %, age, height, activity and training experience.
- **A weak-point training programme** (3–6 days per week) built from the gym's Realleader machines, cables, Smith machine and dumbbells.
- **Saved lifters** (stored in your own browser) and **share links** so each friend can open their own plan.

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
