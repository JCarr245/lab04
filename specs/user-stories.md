# User Stories: HouseFlow

**Source of truth:** [discovery/requirements.md](../discovery/requirements.md)  
**Target persona:** Off-campus student housemate using a mobile phone app (e.g., Alex, living in a shared 4-bedroom rental)

This document captures the user stories and testable acceptance criteria for **HouseFlow**, aligned with the updated mobile-app scope (no morning bathroom check-in queue; expanded household maintenance covering supplies, kitchen/fridge upkeep, exterior/seasonal chores, and repair tracking).

---

## Core Household Chore & Reminder Story

### US-0: Track Household Chores and Reminders (`FR-1`, `FR-2`, `FR-3`, `FR-4`)
**Priority:** Must Have

> **As a** college student living off campus,  
> **I want** a way to track the chores that need to get done around the house,  
> **so that** we can keep everything clean and in order.

**Acceptance Criteria:**
- [ ] **Dirty dishes reminder (`FR-1`):** **WHEN** someone marks that they left dirty dishes, they are reminded about it at some point during the day if the dishes remain uncleaned (and no reminder is sent if they have already been marked cleaned).
- [ ] **Garbage day night-before reminder (`FR-4`):** **WHEN** it is garbage day, the assigned housemate (or household) is reminded the night before to take the trash out.
- [ ] **Weekly rotating cleaning reminder (`FR-3`):** Housemates are reminded weekly to clean specific parts of the house, with assignments cycled fairly through everyone in the house on a rotating schedule.

---

## Detailed Feature User Stories

### US-1: Log and Track Dirty Dishes in the Sink (`FR-1`)
**Priority:** Must Have

> **As an** off-campus student housemate,  
> **I want to** log dirty dishes left in the sink (showing who left them and how long they have been there), receive a daytime reminder if they remain uncleaned, and mark them cleared when washed,  
> **so that** the kitchen sink stays usable for cooking without passive-aggressive group texts or one roommate washing everyone else's dishes.

**Acceptance Criteria:**
- [ ] A verified housemate can log a dirty-dish entry in **under 3 taps** on their phone (`NFR-2`).
- [ ] Each active dish entry displays the housemate identifier (no personal email/student ID), an optional short note, and the timestamp or live elapsed duration since it was logged.
- [ ] **WHEN** a housemate marks that they left dirty dishes, the system triggers/schedules a daytime reminder to that housemate if the entry still remains uncleaned (`US-0`).
- [ ] A housemate can mark a dish entry as cleared/washed in **1 tap**, removing it from the active sink list and canceling any pending reminder for that entry.
- [ ] Changes sync to other household members' phones in **under 1 second** via real-time updates (`NFR-3`).

---

### US-2: Quick Chore Status Switcher (`FR-2`)
**Priority:** Must Have

> **As an** off-campus student housemate,  
> **I want to** switch any shared household chore between `open`, `in_progress`, and `completed` with clear visual indicators,  
> **so that** everyone can see at a glance what still needs to be done and what a roommate is already handling.

**Acceptance Criteria:**
- [ ] The mobile hub lists shared household tasks grouped by room/area with a clear status badge for `open`, `in_progress`, and `completed`.
- [ ] A verified housemate can add a new chore with a title, room/category, and optional assignee or due note.
- [ ] A verified housemate can switch a chore's status (`open` → `in_progress` → `completed`) in **under 3 taps** on mobile (`NFR-2`).
- [ ] Updating a chore status persists to the database and reflects across connected household phones in **under 1 second** (`NFR-3`).
- [ ] Reloading the app preserves all chores and their current statuses.

---

### US-3: Garbage Day Night-Before Reminder (`FR-4`)
**Priority:** Must Have

> **As an** off-campus student housemate,  
> **I want** the household (or assigned roommate) to be reminded the night before garbage day to take the trash out,  
> **so that** trash pickup is never missed and bags do not pile up for another week.

**Acceptance Criteria:**
- [ ] A verified housemate can configure the household's weekly garbage/recycling pickup day (e.g., Tuesday morning pickup → reminder Monday evening).
- [ ] **WHEN** it is garbage day, the system sends/displays a night-before reminder to take the trash bins out (`US-0`).
- [ ] Once the trash chore is marked `completed`, it records who took the bins out and clears the active reminder.

---

### US-4: Weekly Rotating House-Cleaning Schedule (`FR-3`)
**Priority:** Must Have

> **As an** off-campus student housemate,  
> **I want** weekly reminders to clean specific parts of the house—including kitchen/fridge upkeep, bathroom cleaning, living areas, and exterior/seasonal tasks—cycled automatically through everyone in the house,  
> **so that** indoor and outdoor maintenance responsibilities are distributed fairly without anyone manually reassigning chores every week.

**Acceptance Criteria:**
- [ ] A household can define recurring weekly cleaning areas covering indoor and outdoor maintenance (e.g., *Kitchen, Microwave & Fridge Cleanout*, *Bathroom Scrub & Vanity*, *Living Room & Hallway Vacuum*, *Porch, Yard & Seasonal Snow/Leaves*).
- [ ] Each week, area assignments automatically cycle to the next housemate in the rotation.
- [ ] **WHEN** the weekly cleaning cycle triggers, each housemate receives a weekly reminder for their currently assigned part of the house (`US-0`).
- [ ] Marking a weekly area chore `completed` updates the household hub in **under 1 second** (`NFR-3`).

---

### US-5: Shared Household Supplies & Restock Tracker (`FR-5`)
**Priority:** Must Have

> **As an** off-campus student housemate,  
> **I want to** see which shared household consumables are stocked, running low, or out (such as dish soap, trash bags, toilet paper, and paper towels) and flag items with one tap,  
> **so that** we don't run out of essentials mid-week or end up buying duplicates.

**Acceptance Criteria:**
- [ ] The mobile hub includes a **Supplies & Restock** section showing essential shared items (`dish soap`, `trash bags`, `toilet paper`, `paper towels`, cleaning spray) with a status of `stocked`, `low`, or `out`.
- [ ] Any housemate can flag an item as `low` or `out` in **under 3 taps** on mobile (`NFR-2`).
- [ ] A housemate who picks up an item can tap **Restocked** (1 tap) to reset its status to `stocked` and record who restocked it.
- [ ] Supply status changes sync across all housemates' phones in **under 1 second** (`NFR-3`).

---

### US-6: Repairs & Landlord Maintenance Issue Log (`FR-6`)
**Priority:** Should Have

> **As an** off-campus student housemate,  
> **I want to** log broken fixtures or minor house repair needs (such as a leaky sink, broken appliance, or burned-out porch bulb) and track whether they have been reported to the landlord or fixed,  
> **so that** maintenance issues don't get forgotten or reported twice by different roommates.

**Acceptance Criteria:**
- [ ] A housemate can log a repair issue with a short description, room/location, and status (`open`, `reported_to_landlord`, or `fixed`).
- [ ] Housemates can see all open/reported issues at a glance so no one duplicates a text or email to the landlord.
- [ ] Any housemate can update an issue's status (e.g., `open` → `reported_to_landlord` → `fixed`) in **under 3 taps** (`NFR-2`).

---

### US-7: House Rules & Nightly Checklist (`FR-7`)
**Priority:** Must Have

> **As an** off-campus student housemate,  
> **I want to** maintain a shared checklist of simple house rules (such as hallway lights off by 11:00 PM, dishes cleared within 2 hours, and weekly fridge cleanouts),  
> **so that** all roommates share clear expectations around nighttime lighting, kitchen upkeep, and house security without repeating reminders in person.

**Acceptance Criteria:**
- [ ] Housemates can view the shared list of active house rules (including *"Hallway lights off by 11 PM"*, *"Dishes cleared within 2 hours"*, and *"Fridge cleanout before trash night"*).
- [ ] Verified housemates can add, edit, or check off nightly/daily confirmations in **under 3 taps** (`NFR-2`).
- [ ] Rule updates and check-offs persist in the database and sync to all household members in **under 1 second** (`NFR-3`).

---

### US-8: Verified Household Access and Privacy (`NFR-1`, `NFR-4`)
**Priority:** Must Have (Prerequisite)

> **As an** off-campus student housemate,  
> **I want** access to our household board restricted to verified roommates via sign-in and a household invite code or link,  
> **so that** strangers cannot view or modify our home's routines and no personal contact details are exposed publicly.

**Acceptance Criteria:**
- [ ] Unauthenticated visitors cannot read or write any household dishes, chores, supplies, repairs, reminders, or house rules (`NFR-4`).
- [ ] An authenticated user can create a household or join an existing one using a household invite code / authenticated invite link.
- [ ] Database row-level security enforces that users only see and edit records belonging to their own household.
- [ ] The UI displays only household display labels/initials/roles and never exposes real personal emails, phone numbers, or student IDs publicly (`NFR-1`).

---

## Out of Scope (`FR-8`)

- **Morning Bathroom Check-In / Shower Queue:** Intentionally omitted as unnecessary overhead; bathroom cleaning remains tracked in the weekly rotation (`US-4`).
- **Financial Split Payments / Rent & Utility Collections (`Won't Have`):** HouseFlow will **not** process rent, utility bills, or split payments. Roommates already handle financial splits through dedicated tools such as Venmo and Splitwise.

---

## Cross-Cutting Non-Functional Requirements Checklist

| ID | Category | Acceptance Target |
|---|---|---|
| `NFR-1` | Privacy | Never expose real personal names, emails, phone numbers, or student IDs publicly. |
| `NFR-2` | Usability | Mobile-first layout where core daily actions require **under 3 taps** on a phone. |
| `NFR-3` | Performance | Page loads and state updates sync in **under 1 second** via Supabase real-time updates. |
| `NFR-4` | Security | All household data is gated behind authentication and household membership (invite code / link). |
| `NFR-5` | Cost | Runs entirely on free tiers of Vercel and Supabase ($0 hosting cost). |
