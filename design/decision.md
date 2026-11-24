# Design Decision Log: HouseFlow

**Related artifacts:** [discovery/requirements.md](../discovery/requirements.md) | [specs/user-stories.md](../specs/user-stories.md) | [design/flow.md](flow.md) | [design/mockups/](mockups/)

This document summarizes how our design evolved during Lab 04 through browser testing, critique, and iterative refinement before writing any application code.

---

## 1. Starting Point: Three Throwaway Mockups

After translating [discovery/requirements.md](../discovery/requirements.md) and the core chore/reminder requirements into [specs/user-stories.md](../specs/user-stories.md) and [design/flow.md](flow.md), we created three static HTML throwaway mockups in [design/mockups/](mockups/) with distinct layouts and flows:

1. **[mockup-1-triage-feed.html](mockups/mockup-1-triage-feed.html):** Single-column, urgent-first mobile stream sorted by immediate blockers.
2. **[mockup-2-room-hubs.html](mockups/mockup-2-room-hubs.html):** Multi-column spatial room-by-room dashboard showing the whole house side by side with a top quick-action bar.
3. **[mockup-3-tabbed-stepper.html](mockups/mockup-3-tabbed-stepper.html):** Guided personal check-in filtering down to only the signed-in user's tasks with a bottom tab bar.

---

## 2. Browser Review & Key Feedback

After opening and reviewing all three mockups in the browser, we identified three major changes needed before moving forward:

- **Drop the bathroom check-in queue:** Tracking live morning bathroom occupancy (`in_use` / shower queue) felt unnecessary and added friction housemates wouldn't bother using. Bathroom *cleaning* stays in the weekly rotation, while live shower check-ins were removed from scope.
- **Expand missing house-maintenance areas:** Keeping a shared off-campus house running involves more than sink dishes and sweeping. We added four missing areas across requirements, user stories, flow, and mockups:
  1. **Shared supplies & restocking** (dish soap, trash bags, toilet paper, paper towels).
  2. **Exterior & seasonal upkeep** (porch, yard, leaves/snow, rolling bins out).
  3. **Repairs & landlord issue log** (leaky sink, broken appliance, burned-out bulbs).
  4. **Fridge cleanout & shared kitchen upkeep** (expired food, wiping microwave/stove).
- **Adapt Mockup 2 for mobile:** Mockup 2's clear room/category structure and transparency across the house worked best, but HouseFlow is meant to be used on a **phone** rather than a wide desktop dashboard.

---

## 3. Iterative Testing & Refinement (`mockup-4-mobile-room-hubs.html`)

We created [mockup-4-mobile-room-hubs.html](mockups/mockup-4-mobile-room-hubs.html) and tested it in the browser across three rounds:

1. **Round 1 — Mobile House Hub:** Rebuilt Mockup 2 inside a mobile phone frame with stacked hubs for Kitchen/Sink/Fridge, Weekly House & Exterior Rotation, Shared Supplies, Repairs & Landlord Log, and House Rules, plus a bottom quick-action bar.
   - *Feedback:* Better fit for mobile, but still felt tall/wordy and needed a Dark Mode option.
2. **Round 2 — Condensed Layout + Dark Mode:** Tightened cards and spacing into compact summary strips and 2×2 grids, and added a **`Mode: Dark` / `Mode: Light`** toggle in the header so roommates can check the app comfortably day or night.
   - *Feedback:* Seeing every house section stacked on one screen at once still felt visually overstimulating and busy.
3. **Round 3 — Calmer Design + Tab Switching:** Simplified the visual hierarchy (removed the noisy top stat strip and competing multi-color borders, softened spacing, and focused on one accent color) and introduced a **4-tab bottom bar**:
   - **`Today`:** Tonight's trash reminder, active sink dishes, your weekly assigned area, and `+ Log Dirty Dishes or Chore`.
   - **`Supplies`:** Shared household supplies (`Trash Bags`, `Toilet Paper`, `Dish Soap`, `Paper Towels`) with restock status.
   - **`Chores`:** Weekly indoor/exterior rotation and the Repairs & Landlord Log.
   - **`Rules`:** Nightly and weekly house habits (`Lights off 11 PM`, `Dishes < 2h`, `Doors locked`, `Fridge cleanout`).

---

## 4. Final Decision (Current Direction)

We chose the **calm, tabbed mobile-first interface with Light/Dark mode** ([mockup-4-mobile-room-hubs.html](mockups/mockup-4-mobile-room-hubs.html)) as our design direction going into implementation:

- Keeps Mockup 2's clarity and full-house scope (including supplies, exterior tasks, fridge upkeep, and repairs) while eliminating the unnecessary bathroom check-in queue.
- Prevents screen overload on a phone by keeping `Today` focused on immediate tasks and placing `Supplies`, `Chores`, and `Rules` one tap away in the bottom tab bar.
- Supports both Light and Dark mode cleanly across all tabs.
