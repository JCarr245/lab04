# User Flow: HouseFlow

**Related specs:** [specs/user-stories.md](../specs/user-stories.md) | [discovery/requirements.md](../discovery/requirements.md)

This flowchart shows how an off-campus student housemate uses **HouseFlow** as a mobile phone app, organized around room/maintenance hubs with real-time updates (`< 1s` sync) and automated reminders.

## End-to-End Mobile User Flow

```mermaid
flowchart TD
    Start(["Open HouseFlow Mobile App"]) --> AuthCheck{"Signed in?"}
    AuthCheck -- No --> SignIn["Sign in (Supabase Auth)"]
    SignIn --> HouseholdCheck{"Member of a household?"}
    AuthCheck -- Yes --> HouseholdCheck

    HouseholdCheck -- No --> JoinOrCreate["Create household or enter invite code"]
    JoinOrCreate --> Hub["Mobile House Hub (All areas at a glance, < 1s sync)"]
    HouseholdCheck -- Yes --> Hub

    Hub --> Area{"Select hub or quick-log bar"}

    %% 1. Kitchen, Sink & Fridge Flow (US-0, US-1, US-4)
    Area -- "Kitchen & Fridge Hub" --> KitchenChoice{"Dishes or kitchen upkeep?"}
    KitchenChoice -- "Log dirty dishes (< 3 taps)" --> LogDish["Save dish entry with label & timestamp"]
    LogDish --> DishTimer{"Still uncleaned during day?"}
    DishTimer -- Yes --> DishRemind["Send daytime reminder to housemate"]
    DishRemind --> ClearDish["Mark dishes cleared (1 tap)"]
    DishTimer -- No --> ClearDish
    KitchenChoice -- "Clear dishes / fridge cleanout" --> ClearDish
    ClearDish --> SyncHub["Cancel reminder & sync hub (< 1s)"]

    %% 2. Weekly Rotation & Exterior Upkeep (US-0, US-2, US-4)
    Area -- "Chores & Exterior Hub" --> ChoreBoard["View indoor, bathroom clean & yard/porch tasks"]
    ChoreBoard --> ChoreUpdate["Add task or switch status: open -> in_progress -> completed"]
    ChoreUpdate --> SyncHub
    WeeklyCron(["Weekly Rotation Trigger"]) --> RotateArea["Cycle indoor & exterior areas to next housemate & remind"]
    RotateArea --> ChoreBoard

    %% 3. Garbage Day Flow (US-0, US-3)
    GarbageCron(["Night Before Garbage Day"]) --> TrashRemind["Send reminder to take trash bins out"]
    TrashRemind --> ChoreBoard

    %% 4. Supplies & Restock Flow (US-5)
    Area -- "Supplies & Restock" --> SupplyList["Check soap, trash bags, toilet paper, paper towels"]
    SupplyList --> SupplyAction{"Running low or restocked?"}
    SupplyAction -- "Flag Low / Out (1 tap)" --> MarkLow["Notify house that item is needed"]
    SupplyAction -- "Tap Restocked (1 tap)" --> MarkStocked["Reset to stocked & log housemate"]
    MarkLow --> SyncHub
    MarkStocked --> SyncHub

    %% 5. Repairs & Landlord Issues Flow (US-6)
    Area -- "Repairs & Landlord Log" --> RepairAction{"New issue or update status?"}
    RepairAction -- "Log issue (< 3 taps)" --> AddRepair["Save broken fixture/leak with room & photo note"]
    RepairAction -- "Update status" --> UpdateRepair["Switch: open -> reported_to_landlord -> fixed"]
    AddRepair --> SyncHub
    UpdateRepair --> SyncHub

    %% 6. House Rules Checklist Flow (US-7)
    Area -- "House Rules & Night Check" --> RulesList["View rules (11 PM lights, 2h dishes, fridge check)"]
    RulesList --> ToggleRule["Check off or update rule (< 3 taps)"]
    ToggleRule --> SyncHub

    SyncHub --> Hub
```

## Flow Summary

1. **Private Household Entry (`US-8`):** Unauthenticated users sign in and either create a household or join via invite code so only verified roommates see household data.
2. **Kitchen, Sink & Fridge (`US-0`, `US-1`, `US-4`):** Logging dishes starts a daytime reminder check if uncleaned; kitchen upkeep also covers wiping the stove/microwave and fridge cleanouts before trash night.
3. **Weekly Rotation, Exterior & Garbage Night (`US-0`, `US-2`, `US-3`, `US-4`):** Housemates update chore statuses (`open` → `in_progress` → `completed`), get night-before garbage reminders, and cycle weekly through indoor rooms (including bathroom cleaning) and outdoor upkeep (porch, yard, snow/leaves).
4. **Supplies & Restock (`US-5`):** Any roommate can flag essentials like dish soap, trash bags, or toilet paper as `low` or `out` in 1 tap and clear them when restocked.
5. **Repairs & Landlord Log (`US-6`):** Roommates log leaks, broken appliances, or burned-out bulbs and track whether someone already reported them to the landlord.
6. **House Rules & Night Check (`US-7`):** Roommates check off shared agreements (such as hallway lights off by 11 PM) right from the mobile hub.
