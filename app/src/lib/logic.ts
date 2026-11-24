import { Chore, ChoreStatus, DayOfWeek, DishEntry, RepairStatus } from "./types";

export const DISH_REMINDER_THRESHOLD_MS = 2 * 60 * 60 * 1000;

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/** Returns true when an uncleaned dish entry has passed the 2-hour daytime reminder threshold. */
export function isDishReminderActive(dish: DishEntry, nowMs: number): boolean {
  if (dish.clearedAt !== null) return false;
  const createdMs = Date.parse(dish.createdAt);
  if (Number.isNaN(createdMs)) return false;
  return nowMs - createdMs >= DISH_REMINDER_THRESHOLD_MS;
}

/** Formats elapsed time since an ISO timestamp into a compact mobile label (e.g., "3h 20m"). */
export function formatElapsed(createdAtIso: string, nowMs: number): string {
  const createdMs = Date.parse(createdAtIso);
  if (Number.isNaN(createdMs)) return "Just now";
  const diffMinutes = Math.max(0, Math.floor((nowMs - createdMs) / 60000));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return mins === 0 ? `${hours}h ago` : `${hours}h ${mins}m ago`;
}

/** Returns true the night before garbage pickup day (or when the demo preview toggle is active). */
export function isGarbageNight(
  garbageDay: DayOfWeek,
  nowMs: number,
  forceGarbageEve = false
): boolean {
  if (forceGarbageEve) return true;
  const tomorrow = ((new Date(nowMs).getDay() + 1) % 7) as DayOfWeek;
  return tomorrow === garbageDay;
}

const CHORE_ORDER: ChoreStatus[] = ["open", "in_progress", "completed"];

/** Cycles chore status cleanly: open -> in_progress -> completed -> open. */
export function cycleChoreStatus(current: ChoreStatus): ChoreStatus {
  const index = CHORE_ORDER.indexOf(current);
  return CHORE_ORDER[(index + 1) % CHORE_ORDER.length];
}

const REPAIR_ORDER: RepairStatus[] = ["reported", "fixed"];

/** Cycles repair status: reported -> fixed -> reported. */
export function cycleRepairStatus(current: RepairStatus): RepairStatus {
  const index = REPAIR_ORDER.indexOf(current);
  return REPAIR_ORDER[(index + 1) % REPAIR_ORDER.length];
}

/** Formats an ISO timestamp into a concise date and time (e.g., "Nov 24, 11:42 AM"). */
export function formatDateTime(iso: string): string {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return "Unknown time";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(ms));
}

/**
 * Advances weekly rotating chores to the next housemate in memberLabels
 * and resets repeating tasks to "open" for the new week.
 */
export function advanceWeeklyRotation(
  chores: Chore[],
  memberLabels: string[]
): Chore[] {
  if (memberLabels.length === 0) return chores;
  return chores.map((chore) => {
    if (!chore.isWeeklyRotation) return chore;
    const nextIndex = (chore.rotationIndex + 1) % memberLabels.length;
    return {
      ...chore,
      rotationIndex: nextIndex,
      assignedToLabel: memberLabels[nextIndex],
      status: "open",
      completedAt: null,
    };
  });
}

/** Returns the label of the next housemate in rotation after the chore's current assignee. */
export function getNextAssigneeLabel(
  chore: Chore,
  memberLabels: string[]
): string {
  if (memberLabels.length === 0) return chore.assignedToLabel;
  const nextIndex = (chore.rotationIndex + 1) % memberLabels.length;
  return memberLabels[nextIndex];
}
