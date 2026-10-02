# Planner Dashboard (iOS-style, pink accent)

A mobile-first visual dashboard for:
- Class schedule
- Work shifts
- Appointments and plans
- School/work deadlines
- Chores + self-care countdown trackers
- Multiple checking accounts + money items
- Calendar-centric daily view

Data is saved automatically in `localStorage`.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

Do not open `index.html` directly in Finder/browser file mode; run through Vite so module imports load correctly.

## Build check

```bash
npm run build
npm run preview
```

## How to use

- Tap `＋` for quick add presets (class, shift, appointment, plan, deadlines, money item, tracker).
- Use calendar cells to switch day context.
- Use tabs:
  - `Schedule`: day event list with edit/delete.
  - `Trackers`: chores/self-care countdowns, weekly/monthly check-off, mark-done.
  - `Money`: checking account cards and money-related upcoming items.
- `Today` jumps back to current date.

## Notes

- Money items are created as events in category `Money` and can be linked to an account.
- If you want cloud sync and reminders next, a backend + notifications can be added.
