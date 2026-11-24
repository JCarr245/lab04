import { HouseFlowState } from "./types";

export const HOUSEFLOW_STORAGE_KEY = "houseflow_v1_state";

/** Builds realistic initial sample data matching the Lab 04 HouseFlow spec and mockup. */
export function createSeedState(nowMs = Date.now()): HouseFlowState {
  const householdId = "house-maple-402";
  const memberLabels = [
    "Alex (You)",
    "Housemate B",
    "Housemate C",
    "Housemate D",
  ];

  const minutesAgo = (mins: number) =>
    new Date(nowMs - mins * 60 * 1000).toISOString();

  return {
    household: {
      id: householdId,
      name: "Maple St. House",
      inviteCode: "MPL-402",
      garbageDay: 2, // Tuesday morning pickup -> Monday night reminder
      memberLabels,
    },
    dishes: [
      {
        id: "dish-1",
        householdId,
        loggedByLabel: "Housemate B",
        description: "Cast-iron skillet & 2 pasta bowls",
        createdAt: minutesAgo(200), // 3h 20m ago -> daytime reminder active
        clearedAt: null,
      },
      {
        id: "dish-2",
        householdId,
        loggedByLabel: "Alex (You)",
        description: "Coffee French press & mug",
        createdAt: minutesAgo(25),
        clearedAt: null,
      },
    ],
    chores: [
      {
        id: "chore-1",
        householdId,
        title: "Kitchen Counters & Fridge Cleanout",
        area: "kitchen",
        status: "in_progress",
        assignedToLabel: memberLabels[0],
        isWeeklyRotation: true,
        rotationIndex: 0,
        completedAt: null,
      },
      {
        id: "chore-2",
        householdId,
        title: "Bathroom Scrub & Vanity",
        area: "bathroom",
        status: "completed",
        assignedToLabel: memberLabels[2],
        isWeeklyRotation: true,
        rotationIndex: 2,
        completedAt: minutesAgo(180),
      },
      {
        id: "chore-3",
        householdId,
        title: "Living Room & Hall Vacuum",
        area: "living",
        status: "open",
        assignedToLabel: memberLabels[3],
        isWeeklyRotation: true,
        rotationIndex: 3,
        completedAt: null,
      },
      {
        id: "chore-4",
        householdId,
        title: "Porch, Yard & Sidewalk Leaves",
        area: "exterior",
        status: "open",
        assignedToLabel: memberLabels[1],
        isWeeklyRotation: true,
        rotationIndex: 1,
        completedAt: null,
      },
    ],
    supplies: [
      {
        id: "sup-1",
        householdId,
        name: "Trash Bags",
        status: "out",
        note: "13-gal kitchen bags",
        updatedByLabel: "Housemate B",
        updatedAt: minutesAgo(240),
      },
      {
        id: "sup-2",
        householdId,
        name: "Toilet Paper",
        status: "low",
        note: "2 rolls left",
        updatedByLabel: "Housemate D",
        updatedAt: minutesAgo(90),
      },
      {
        id: "sup-3",
        householdId,
        name: "Dish Soap",
        status: "stocked",
        note: "Full bottle under sink",
        updatedByLabel: "Alex (You)",
        updatedAt: minutesAgo(600),
      },
      {
        id: "sup-4",
        householdId,
        name: "Paper Towels",
        status: "stocked",
        note: "3 rolls in pantry",
        updatedByLabel: "Housemate C",
        updatedAt: minutesAgo(420),
      },
    ],
    repairs: [
      {
        id: "rep-1",
        householdId,
        title: "Kitchen sink P-trap leak",
        location: "Kitchen",
        status: "reported",
        loggedByLabel: "Housemate C",
        createdAt: minutesAgo(2880),
        reportedAt: minutesAgo(2880),
        fixedAt: null,
      },
      {
        id: "rep-2",
        householdId,
        title: "Porch floodlight bulb out",
        location: "Front Porch",
        status: "reported",
        loggedByLabel: "Housemate B",
        createdAt: minutesAgo(300),
        reportedAt: minutesAgo(300),
        fixedAt: null,
      },
      {
        id: "rep-3",
        householdId,
        title: "Back door screen latch loose",
        location: "Back Porch",
        status: "fixed",
        loggedByLabel: "Alex (You)",
        createdAt: minutesAgo(7200),
        reportedAt: minutesAgo(7200),
        fixedAt: minutesAgo(4320),
      },
    ],
    rules: [
      {
        id: "rule-1",
        householdId,
        title: "Hallway lights off by 11:00 PM",
        subtitle: "Nightly check",
        checked: true,
        lastCheckedAt: minutesAgo(600),
      },
      {
        id: "rule-2",
        householdId,
        title: "Dishes cleared within 2 hours",
        subtitle: "Kitchen agreement",
        checked: false,
        lastCheckedAt: null,
      },
      {
        id: "rule-3",
        householdId,
        title: "Front & back doors locked",
        subtitle: "Evening check",
        checked: true,
        lastCheckedAt: minutesAgo(580),
      },
      {
        id: "rule-4",
        householdId,
        title: "Fridge cleanout before trash night",
        subtitle: "Weekly Monday evening",
        checked: false,
        lastCheckedAt: null,
      },
    ],
    preferences: {
      theme: "light",
      activeTab: "today",
      activeMemberLabel: "Alex (You)",
      simulatedHoursOffset: 0,
      forceGarbageEve: false,
    },
    weekNumber: 1,
    trashCompletedBy: null,
  };
}

/** Loads persisted state from browser localStorage, falling back to seeded defaults if empty or invalid. */
export function loadState(nowMs = Date.now()): HouseFlowState {
  if (typeof window === "undefined") {
    return createSeedState(nowMs);
  }
  try {
    const raw = window.localStorage.getItem(HOUSEFLOW_STORAGE_KEY);
    if (!raw) return createSeedState(nowMs);
    const parsed = JSON.parse(raw) as Partial<HouseFlowState>;
    const seed = createSeedState(nowMs);
    if (!parsed.household || !Array.isArray(parsed.chores)) {
      return seed;
    }
    const validTabs = new Set(["today", "supplies", "chores", "repairs"]);
    const rawTab = parsed.preferences?.activeTab as string | undefined;
    const safeTab = rawTab && validTabs.has(rawTab) ? rawTab : "today";

    const validRepairStatuses = new Set(["reported", "fixed"]);
    const normalizedRepairs = Array.isArray(parsed.repairs)
      ? parsed.repairs.map((r) => {
          const rawStatus = r.status as string;
          const status = validRepairStatuses.has(rawStatus)
            ? r.status
            : "reported";
          return {
            ...r,
            status,
            reportedAt: r.reportedAt || r.createdAt,
            fixedAt: r.fixedAt ?? null,
          };
        })
      : seed.repairs;

    return {
      ...seed,
      ...parsed,
      repairs: normalizedRepairs,
      household: { ...seed.household, ...parsed.household },
      preferences: {
        ...seed.preferences,
        ...parsed.preferences,
        activeTab: safeTab as HouseFlowState["preferences"]["activeTab"],
      },
    };
  } catch {
    return createSeedState(nowMs);
  }
}

/** Saves the current HouseFlow state to browser localStorage. */
export function saveState(state: HouseFlowState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HOUSEFLOW_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in restricted browser modes.
  }
}

/** Clears saved state and restores realistic initial sample data. */
export function resetState(nowMs = Date.now()): HouseFlowState {
  const seed = createSeedState(nowMs);
  saveState(seed);
  return seed;
}
