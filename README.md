# Planner Dashboard (iOS-style, pink accent)

A mobile-first visual dashboard for:
- Class schedule
- Work shifts
- Appointments and plans
- School/work deadlines
- Chores + self-care countdown trackers
- Multiple checking accounts + money items
- Calendar-centric daily view
- Smart `Now / Next / Due Soon` focus cards
- Natural-language quick capture
- Installable PWA with offline support
- Recurring events (daily/weekly/monthly)
- Optional event reminders (timed or morning)

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

- Use bottom nav: `Today`, `Calendar`, `Trackers`, `Money`, `Inbox`.
- `Today` tab surfaces smart cards (`Now`, `Next`, `Due Soon`) plus your daily agenda.
- `Calendar` tab gives month view and day list with quick add/edit/delete.
- `Trackers` tab handles chores/self-care countdowns and weekly/monthly check-off.
- `Money` tab manages multiple checking accounts and money-related events.
- `Inbox` tab has natural-language quick capture.

### Quick capture examples

- `work shift tue 4-9pm`
- `yoga tomorrow 7am`
- `dentist 10/15 3pm`
- `assignment due friday 11pm`

The app auto-detects category/date/time and creates the event.

### Recurrence + reminders

- In event form, set `Repeat` to daily/weekly/monthly and optionally add `Repeat until`.
- Set `Reminder` to:
	- `Before start time` (5–60 minutes before)
	- `Morning reminder (8:00 AM)`
- In `Inbox`, tap `Enable Alerts` to allow browser notifications.
- Reminder notifications fire while the app is open on your device.

## PWA on iPhone

- Open the app URL in Safari.
- Tap Share → `Add to Home Screen`.
- Launch from home screen for app-like experience and offline caching.

## Notes

- Money items are created as events in category `Money` and can be linked to an account.
- If you want cloud sync and reminders next, a backend + notifications can be added.
