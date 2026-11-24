export type ChoreArea = "kitchen" | "bathroom" | "living" | "exterior" | "trash";

export type ChoreStatus = "open" | "in_progress" | "completed";

export type SupplyStatus = "stocked" | "low" | "out";

export type RepairStatus = "reported" | "fixed";

export type TabKey = "today" | "supplies" | "chores" | "repairs";

export type ThemeMode = "light" | "dark";

/** 0 = Sunday through 6 = Saturday, matching Date.getDay(). */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Household {
  id: string;
  name: string;
  inviteCode: string;
  garbageDay: DayOfWeek;
  /** Display labels or initials only — never real names, emails, or IDs (NFR-1). */
  memberLabels: string[];
}

export interface DishEntry {
  id: string;
  householdId: string;
  loggedByLabel: string;
  description: string;
  createdAt: string;
  clearedAt: string | null;
}

export interface Chore {
  id: string;
  householdId: string;
  title: string;
  area: ChoreArea;
  status: ChoreStatus;
  assignedToLabel: string;
  isWeeklyRotation: boolean;
  rotationIndex: number;
  completedAt: string | null;
}

export interface SupplyItem {
  id: string;
  householdId: string;
  name: string;
  status: SupplyStatus;
  note: string;
  updatedByLabel: string;
  updatedAt: string;
}

export interface RepairIssue {
  id: string;
  householdId: string;
  title: string;
  location: string;
  status: RepairStatus;
  loggedByLabel: string;
  createdAt: string;
  reportedAt: string;
  fixedAt: string | null;
}

export interface HouseRule {
  id: string;
  householdId: string;
  title: string;
  subtitle: string;
  checked: boolean;
  lastCheckedAt: string | null;
}

export interface UiPreferences {
  theme: ThemeMode;
  activeTab: TabKey;
  activeMemberLabel: string;
  /** Offset in hours used to preview time-based reminders in v1 without waiting. */
  simulatedHoursOffset: number;
  forceGarbageEve: boolean;
}

export interface HouseFlowState {
  household: Household;
  dishes: DishEntry[];
  chores: Chore[];
  supplies: SupplyItem[];
  repairs: RepairIssue[];
  rules: HouseRule[];
  preferences: UiPreferences;
  weekNumber: number;
  trashCompletedBy: string | null;
}
