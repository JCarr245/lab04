import { beforeEach, describe, expect, it } from "vitest";
import {
  advanceWeeklyRotation,
  cycleChoreStatus,
  formatElapsed,
  isDishReminderActive,
  isGarbageNight,
} from "@/lib/logic";
import {
  HOUSEFLOW_STORAGE_KEY,
  createSeedState,
  loadState,
  saveState,
} from "@/lib/storage";

describe("HouseFlow storage and domain logic", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("persists state in localStorage across loads", () => {
    const seed = createSeedState(1_700_000_000_000);
    seed.preferences.theme = "dark";
    saveState(seed);

    expect(window.localStorage.getItem(HOUSEFLOW_STORAGE_KEY)).not.toBeNull();
    const loaded = loadState(1_700_000_000_000);
    expect(loaded.preferences.theme).toBe("dark");
    expect(loaded.household.name).toBe("Maple St. House");
  });

  it("activates dish reminder after 2 hours when uncleaned and cancels when cleared", () => {
    const now = 1_700_000_000_000;
    const seed = createSeedState(now);
    const overdueDish = seed.dishes[0];
    const recentDish = seed.dishes[1];

    expect(isDishReminderActive(overdueDish, now)).toBe(true);
    expect(isDishReminderActive(recentDish, now)).toBe(false);
    expect(
      isDishReminderActive({ ...overdueDish, clearedAt: new Date(now).toISOString() }, now)
    ).toBe(false);
    expect(formatElapsed(overdueDish.createdAt, now)).toBe("3h 20m ago");
  });

  it("detects the night before garbage day", () => {
    // Nov 23, 2026 is a Monday -> tomorrow is Tuesday (day 2)
    const mondayMs = new Date(2026, 10, 23, 20, 0, 0).getTime();
    const wednesdayMs = new Date(2026, 10, 25, 20, 0, 0).getTime();

    expect(isGarbageNight(2, mondayMs, false)).toBe(true);
    expect(isGarbageNight(2, wednesdayMs, false)).toBe(false);
    expect(isGarbageNight(2, wednesdayMs, true)).toBe(true);
  });

  it("cycles chore status and advances weekly rotation fairly", () => {
    expect(cycleChoreStatus("open")).toBe("in_progress");
    expect(cycleChoreStatus("in_progress")).toBe("completed");
    expect(cycleChoreStatus("completed")).toBe("open");

    const seed = createSeedState();
    const nextWeek = advanceWeeklyRotation(seed.chores, seed.household.memberLabels);

    expect(nextWeek[0].assignedToLabel).toBe("Housemate B");
    expect(nextWeek[1].assignedToLabel).toBe("Housemate D");
    expect(nextWeek[1].status).toBe("open");
  });
});
