# HouseFlow v1, Tasks

**Spec:** [specs/v1-spec.md](v1-spec.md) | **User stories:** [specs/user-stories.md](user-stories.md)

Small, 10–30 minute implementation tasks used to build HouseFlow v1 in `app/`, each mapped to the story and acceptance criteria it satisfies.

---

### Task 1: Scaffold Next.js, TypeScript, Tailwind CSS & Vitest (20 min) — Done
- **Satisfies:** `v1-spec.md` Stack decision; `AGENTS.md` Definition of Done (`npm test` in `app/`).
- **Work:** Verified Node.js & npm, initialized Next.js (App Router, TypeScript, Tailwind CSS) in `app/`, and configured Vitest + React Testing Library with a smoke test.

### Task 2: Data Types, Seed Household & `localStorage` Store (20 min) — Done
- **Satisfies:** `v1-spec.md` Data schema (`Household`, `DishEntry`, `Chore`, `SupplyItem`, `RepairIssue`, `HouseRule`, `UiPreferences`); `US-2` AC 4 (persists across reload); `US-8` / `NFR-1` (display labels only—no real personal names, emails, or student IDs).
- **Work:** Created `src/lib/types.ts`, `src/lib/logic.ts`, and `src/lib/storage.ts` (`loadState`, `saveState`, `resetState`, and realistic `Maple St. House` seed data).

### Task 3: Calm Mobile App Shell, Light/Dark Mode & 4-Tab Bar (20 min) — Done
- **Satisfies:** `NFR-2` (mobile-first `< 3` taps); `US-8` / `NFR-1` (privacy-safe active housemate label switcher); [design/mockups/mockup-4-mobile-room-hubs.html](../design/mockups/mockup-4-mobile-room-hubs.html).
- **Work:** Built `src/components/HouseFlowApp.tsx` with the `390px` mobile frame, Light/Dark Mode toggle, housemate switcher, and 4 bottom tabs (**Today**, **Supplies**, **Chores**, **Repairs**).

### Task 4: Dirty Dishes Log, Elapsed Timer & Daytime Reminder (`Today` Tab) (25 min) — Done
- **Satisfies:** `US-0` AC 1 (**WHEN** someone marks dirty dishes, remind them during the day if uncleaned); `US-1` AC 1–4 (log in `< 3` taps, display label + elapsed time, trigger 2-hour daytime reminder, clear in 1 tap & cancel reminder); `NFR-2`.
- **Work:** Built the **Dirty Dishes in Sink** card and daytime reminder banner in `src/components/TodayTab.tsx` plus the quick-log form in `src/components/QuickAddModal.tsx`.

### Task 5: Garbage Day Configuration & Night-Before Reminder (`Today` Tab) (20 min) — Done
- **Satisfies:** `US-0` AC 2 (**WHEN** it is garbage day, night-before reminder to take trash out); `US-3` AC 1–3 (configure pickup day, display night-before reminder, mark `Done` to record who took bins out & clear reminder).
- **Work:** Added **Trash Tonight** banner + 1-tap `Done` in `TodayTab.tsx` and the **Garbage Pickup Day** selector in `src/components/ChoresTab.tsx`.

### Task 6: Quick Chore Status Switcher & Add-Chore Form (`Today` + `Chores` Tabs) (20 min) — Done
- **Satisfies:** `US-2` AC 1–4 (status badges `open`, `in_progress`, `completed`; add chore with title, area, assignee; switch status in `< 3` taps; persists across reloads); `NFR-2`.
- **Work:** Created `src/components/StatusPill.tsx` and the **New Chore** flow in `QuickAddModal.tsx`.

### Task 7: Weekly Rotating House & Exterior Cleaning Schedule (`Chores` Tab) (25 min) — Done
- **Satisfies:** `US-0` AC 3 (weekly reminder cycled fairly through everyone in the house); `US-4` AC 1–4 (indoor + outdoor areas: Kitchen & Fridge, Bathroom Scrub, Living Room, Porch/Yard/Leaves; advance weekly rotation); `Today` **Your Weekly Area** card.
- **Work:** Wired `advanceWeeklyRotation` and `getNextAssigneeLabel` into `HouseFlowApp.tsx`, `TodayTab.tsx`, and `ChoresTab.tsx` with an **Advance Week** control.

### Task 8: Shared Supplies & Restock Tracker (`Supplies` Tab) (20 min) — Done
- **Satisfies:** `US-5` AC 1–3 (`dish soap`, `trash bags`, `toilet paper`, `paper towels` with `stocked`, `low`, `out` statuses; flag low/out in `< 3` taps; 1-tap `Restocked` records who restocked); `NFR-2`.
- **Work:** Built `src/components/SuppliesTab.tsx` with status badges, 1-tap `Flag Low` / `Restocked` actions, and `+ Flag Low Supply`.

### Task 9: Repairs & Landlord Maintenance Log with Timestamps & History (`Repairs` Tab) (20 min) — Done
- **Satisfies:** `US-6` AC 1–3 (log repair with description, room/location, reported date/time, and explicit **Reported** / **Fixed** status options); keeps resolved repairs in **Issue History** with reported and fixed timestamps.
- **Work:** Built `src/components/RepairsTab.tsx` as its own dedicated 4th tab after usability feedback moved daily rules to `Today`.

### Task 10: Daily House Rules Checklist & Reminder Preview Controls (`Today` + `Repairs` Tabs) (15 min) — Done
- **Satisfies:** `US-7` AC 1–2 (view, add, and check off rules like *"Hallway lights off by 11:00 PM"*, *"Dishes cleared within 2 hours"*, *"Fridge cleanout before trash night"* in `< 3` taps); `v1-spec.md` Open Question #4.
- **Work:** Placed **House Rules & Night Check** on `TodayTab.tsx` (since rules are daily habits) and added **Reminder Preview Controls** (`+3h` dish timer, Trash Night preview, Reset Sample Data) on `RepairsTab.tsx`.

### Task 11: Vitest Unit Tests & Final Production Build Check (20 min) — Done
- **Satisfies:** `AGENTS.md` Definition of Done (`npm test` and `npm run build` pass).
- **Work:** Added unit and component tests across `src/__tests__/smoke.test.tsx`, `storage.test.ts`, `tasks4to7.test.tsx`, and `tasks8to10.test.tsx` (13/13 passing) and verified `tsc --noEmit` and `npm run build`.
