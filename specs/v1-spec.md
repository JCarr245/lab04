# HouseFlow v1, spec

## Intent
HouseFlow is a mobile-first household coordination app for undergraduate college students living together in off-campus shared rental houses. Because roommates have desynchronized class schedules, dirty dishes pile up in the sink, garbage night gets forgotten, shared supplies run out unnoticed, and routine indoor/outdoor chores fall onto whichever frustrated housemate steps in first. HouseFlow gives roommates a calm, shared mobile hub to track dirty dishes (with daytime reminders), rotate weekly cleaning areas, get night-before garbage reminders, flag low household supplies, log repairs, and check off nightly house rules without nagging. See [discovery/requirements.md](../discovery/requirements.md) for full discovery context and requirements.

## Stories and acceptance criteria
Full story list: [specs/user-stories.md](user-stories.md)

### US-0: Track Household Chores and Reminders (`FR-1`, `FR-2`, `FR-3`, `FR-4`)
> **As a** college student living off campus,  
> **I want** a way to track the chores that need to get done around the house,  
> **so that** we can keep everything clean and in order.

- [ ] **WHEN** someone marks that they left dirty dishes, they are reminded about it at some point during the day if the dishes remain uncleaned (and no reminder is sent if they have already been marked cleaned).
- [ ] **WHEN** it is garbage day, the assigned housemate (or household) is reminded the night before to take the trash out.
- [ ] Housemates are reminded weekly to clean specific parts of the house, with assignments cycled fairly through everyone in the house on a rotating schedule.

### US-1: Log and Track Dirty Dishes in the Sink (`FR-1`)
> **As an** off-campus student housemate,  
> **I want to** log dirty dishes left in the sink (showing who left them and how long they have been there), receive a daytime reminder if they remain uncleaned, and mark them cleared when washed,  
> **so that** the kitchen sink stays usable for cooking without passive-aggressive group texts or one roommate washing everyone else's dishes.

- [ ] A verified housemate can log a dirty-dish entry in **under 3 taps** on their phone (`NFR-2`).
- [ ] Each active dish entry displays the housemate identifier (no personal email/student ID), an optional short note, and the timestamp or live elapsed duration since it was logged.
- [ ] **WHEN** a housemate marks that they left dirty dishes, the system triggers/schedules a daytime reminder to that housemate if the entry still remains uncleaned (`US-0`).
- [ ] A housemate can mark a dish entry as cleared/washed in **1 tap**, removing it from the active sink list and canceling any pending reminder for that entry.

### US-2: Quick Chore Status Switcher (`FR-2`)
> **As an** off-campus student housemate,  
> **I want to** switch any shared household chore between `open`, `in_progress`, and `completed` with clear visual indicators,  
> **so that** everyone can see at a glance what still needs to be done and what a roommate is already handling.

- [ ] The mobile hub lists shared household tasks grouped by room/area with a clear status badge for `open`, `in_progress`, and `completed`.
- [ ] A verified housemate can add a new chore with a title, room/category, and optional assignee or due note.
- [ ] A verified housemate can switch a chore's status (`open` → `in_progress` → `completed`) in **under 3 taps** on mobile (`NFR-2`).
- [ ] Reloading the app preserves all chores and their current statuses.

### US-3: Garbage Day Night-Before Reminder (`FR-4`)
> **As an** off-campus student housemate,  
> **I want** the household (or assigned roommate) to be reminded the night before garbage day to take the trash out,  
> **so that** trash pickup is never missed and bags do not pile up for another week.

- [ ] A verified housemate can configure the household's weekly garbage/recycling pickup day (e.g., Tuesday morning pickup → reminder Monday evening).
- [ ] **WHEN** it is garbage day, the system sends/displays a night-before reminder to take the trash bins out (`US-0`).
- [ ] Once the trash chore is marked `completed`, it records who took the bins out and clears the active reminder.

*(Additional stories `US-4` through `US-8`—weekly indoor/exterior rotation, shared supplies restocking, repairs/landlord log, house rules checklist, and household access/privacy—are documented in [specs/user-stories.md](user-stories.md).)*

## Screens and flow
- **User flow diagram:** [design/flow.md](../design/flow.md)
- **Chosen mockup:** [design/mockups/mockup-4-mobile-room-hubs.html](../design/mockups/mockup-4-mobile-room-hubs.html)
- **Design rationale:** [design/decision.md](../design/decision.md)

The main mobile screen uses a 4-tab bottom navigation bar (**Today**, **Supplies**, **Chores**, **Repairs**) and a top **Light / Dark Mode** toggle:
1. **Today:** Garbage night reminder notice, active dirty dishes in the sink (`Clear` in 1 tap), your weekly assigned area, daily **House Rules & Night Check**, and `+ Log Dirty Dishes or Chore`.
2. **Supplies:** Shared consumables (`Trash Bags`, `Toilet Paper`, `Dish Soap`, `Paper Towels`) with `Stocked` / `Low` / `Out` status and 1-tap `Restocked` / `Flag Low`.
3. **Chores:** Weekly indoor and exterior rotating areas (`Kitchen & Fridge`, `Bathroom Scrub`, `Living Room`, `Porch, Yard & Leaves`), garbage pickup day setting, and added chores.
4. **Repairs:** **Repairs & Landlord Log** with reported date/time, explicit **Reported** / **Fixed** options, and **Issue History** for fixed items.

## Data
For v1, data lives in browser `localStorage` (using a simulated housemate switcher for testing); a shared Supabase database with authentication and real-time sync comes in Lab 6.

- **`Household`**: `id`, `name`, `invite_code`, `garbage_day` (day of week), `member_labels` (`string[]` — display labels/initials only, no real names/emails/IDs)
- **`DishEntry`**: `id`, `household_id`, `logged_by_label`, `description`, `created_at`, `cleared_at` (`timestamp | null`)
- **`Chore`**: `id`, `household_id`, `title`, `area` (`kitchen` | `bathroom` | `living` | `exterior` | `trash`), `status` (`open` | `in_progress` | `completed`), `assigned_to_label`, `is_weekly_rotation` (`boolean`), `rotation_index`, `completed_at`
- **`SupplyItem`**: `id`, `household_id`, `name`, `status` (`stocked` | `low` | `out`), `note`, `updated_by_label`, `updated_at`
- **`RepairIssue`**: `id`, `household_id`, `title`, `location`, `status` (`reported` | `fixed`), `logged_by_label`, `created_at`, `reported_at`, `fixed_at`
- **`HouseRule`**: `id`, `household_id`, `title`, `subtitle`, `checked` (`boolean`), `last_checked_at`
- **`UiPreferences` (local)**: `theme` (`light` | `dark`), `active_tab` (`today` | `supplies` | `chores` | `repairs`), `active_member_label`, `simulated_hours_offset`, `force_garbage_eve`

## Decisions already made
- Stack: Next.js (TypeScript) with Tailwind, deployed to Vercel.
- Persistence for v1: Store state in browser `localStorage` first to validate the mobile UX and core flows quickly; add Supabase database, Auth, and `< 1s` real-time sync in Lab 6.
- Calm 4-tab mobile layout (`Today`, `Supplies`, `Chores`, `Rules`): Chosen over stacking every section on one screen so the phone UI stays uncluttered and core actions stay under 3 taps (`NFR-2`).
- Built-in Light / Dark Mode toggle: Supports comfortable use both during the day and at night when checking closing house rules.
- Privacy by design (`NFR-1`): Represent roommates using household display labels/initials only—never store or display real personal emails, phone numbers, or student IDs publicly.

## Considered and rejected
- **Morning bathroom occupancy / shower queue:** Evaluated in early mockups (`mockup-1`, `mockup-2`) and rejected because live shower check-ins felt unnecessary and unlikely to be adopted; bathroom cleaning remains part of the weekly rotation.
- **Desktop-first multi-column room grid (`mockup-2-room-hubs.html`):** Rejected as the main layout because housemates will use HouseFlow on their phones, though its room/category clarity carried into the mobile tabs.
- **Urgency-only single stream (`mockup-1-triage-feed.html`) and personal-only filter (`mockup-3-tabbed-stepper.html`):** Rejected because the urgent stream lacked clear homes for supplies/repairs, while hiding other roommates' tasks reduced shared household visibility.
- **All-sections-on-one-screen dense mobile hub (early `mockup-4`):** Condensed and then replaced with tabs after browser testing showed it felt visually overstimulating.

## Out of scope for v1
- **Multi-device real-time sync, Supabase Auth, and live push/SMS notifications:** Deferred to Lab 6+ (v1 displays in-app reminder states/banners locally rather than external push/SMS).
- **Financial split payments or rent/utility collection (`FR-8`):** Permanently excluded because roommates already use Venmo and Splitwise.
- **Morning bathroom occupancy / shower queue:** Removed from scope.

## Open questions
- What exact trigger rule should fire the daytime dirty-dishes reminder in v1 (e.g., 2 hours after logging vs. a set afternoon window)?
- Should the night-before garbage reminder appear for the entire household or only the housemate assigned to trash that week?
- When weekly chores rotate on Sunday, should an uncompleted chore reset cleanly for the next person or carry over as overdue?
- How should v1 let a user preview or test time-based reminders (dishes daytime check, garbage night-before, weekly rotation) in the browser without waiting days?
