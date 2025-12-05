/////////////////////////////////////////////////////////////////////
// Tracker types
/////////////////////////////////////////////////////////////////////

export type Tracker = {
  id: string;
  color: number;
  name?: string;
  showOnMap?: boolean;
  inlineMath?: boolean;
  sizePercentage?: number;
} & (
  | {
      variant: "value";
      value: number;
    }
  | {
      variant: "value-max";
      value: number;
      max: number;
    }
  | {
      variant: "checkbox";
      checked: boolean;
    }
  | {
      variant: "counter";
      value: number;
    }
);

export type TrackerVariant = "value" | "value-max" | "checkbox" | "counter";

export function isTracker(
  potentialTracker: unknown,
): potentialTracker is Tracker {
  const tracker = potentialTracker as Tracker;

  if (tracker.id === undefined) return false;
  if (typeof tracker.id !== "string") return false;

  if (tracker.color === undefined) return false;
  if (typeof tracker.color !== "number") return false;

  if (tracker.name !== undefined && typeof tracker.name !== "string")
    return false;

  if (tracker.showOnMap !== undefined && typeof tracker.showOnMap !== "boolean")
    return false;

  if (
    tracker.inlineMath !== undefined &&
    typeof tracker.inlineMath !== "boolean"
  )
    return false;

  if (tracker.sizePercentage !== undefined && typeof tracker.sizePercentage !== "number")
    return false;

  if (tracker.variant === "value") {
    if (tracker.value === undefined) return false;
    if (typeof tracker.value !== "number") return false;
  } else if (tracker.variant === "counter") {
    if (tracker.value === undefined) return false;
    if (typeof tracker.value !== "number") return false;
  } else if (tracker.variant === "value-max") {
    if (tracker.value === undefined) return false;
    if (typeof tracker.value !== "number") return false;
    if (tracker.max === undefined) return false;
    if (typeof tracker.max !== "number") return false;
  } else if (tracker.variant === "checkbox") {
    if (tracker.checked === undefined) return false;
    if (typeof tracker.checked !== "boolean") return false;
  } else return false;

  return true;
}

/////////////////////////////////////////////////////////////////////
// Constants
/////////////////////////////////////////////////////////////////////

export const MAX_TRACKER_COUNT = 12;
export const TRACKER_METADATA_ID: string = "trackers";
export const HIDDEN_METADATA_ID: string = "hidden";

/////////////////////////////////////////////////////////////////////
// Tracker creation
/////////////////////////////////////////////////////////////////////

export const createColor = (trackers: Tracker[], variant: TrackerVariant) => {
  const count = trackers.filter(
    (tracker) => tracker.variant === variant,
  ).length;

  if (variant === "value") return (5 + count * 2) % 9;
  if (variant === "counter") return (6 + count * 2) % 9;
  else if (variant === "value-max") return (2 + count * 4) % 9;
  return (2 + count * 2) % 9;
};

export const createId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export const createBubble = (trackers: Tracker[]): Tracker => {
  return {
    id: createId(),
    variant: "value",
    color: createColor(trackers, "value"),
    value: 0,
  };
};

export const createCounter = (trackers: Tracker[]): Tracker => {
  return {
    id: createId(),
    variant: "counter",
    color: createColor(trackers, "counter"),
    inlineMath: false,
    value: 0,
  };
};

export const createBar = (trackers: Tracker[]): Tracker => {
  return {
    id: createId(),
    variant: "value-max",
    color: createColor(trackers, "value-max"),
    value: 0,
    max: 0,
  };
};

export const createCheckboxTracker = (trackers: Tracker[]): Tracker => {
  return {
    id: createId(),
    variant: "checkbox",
    color: createColor(trackers, "checkbox"),
    checked: false,
  };
};
