import { create } from "zustand";
import {
  Tracker,
  createBubble,
  createBar,
  MAX_TRACKER_COUNT,
  createCheckboxTracker,
  createCounter,
} from "./trackerHelpersBasic";

interface TrackerState {
  trackers: Tracker[];
  writeToSaveLocation: ((trackers: Tracker[]) => Promise<void>) | undefined;

  setTrackers: (trackers: Tracker[]) => void;
  setWriteToSaveLocation: (
    writeToSaveLocation: (trackers: Tracker[]) => Promise<void>,
  ) => void;

  overWriteTrackers: (trackers: Tracker[]) => void;
  updateTrackerField: (
    trackerId: string,
    field: "value" | "max" | "name" | "color" | "checked" | "sizePercentage",
    content: string | number | boolean,
  ) => void;
  addTrackerBubble: () => void;
  addTrackerBar: () => void;
  addCheckboxTracker: () => void;
  addCounterTracker: () => void;
  deleteTracker: (trackerId: string) => void;
  toggleShowOnMap: (trackerId: string) => void;
  toggleInlineMath: (trackerId: string) => void;
}

export const useTrackerStore = create<TrackerState>()((set) => ({
  trackers: [],
  writeToSaveLocation: undefined,

  setTrackers: (trackers) => set((state) => ({ ...state, trackers })),
  setWriteToSaveLocation: (writeToSaveLocation) =>
    set((state) => ({ ...state, writeToSaveLocation })),

  // Updates trackers locally and in the save location
  overWriteTrackers: (trackers) =>
    set((state) => {
      state.trackers = trackers;
      sideEffects(state);
      return { ...state };
    }),
  updateTrackerField: (trackerId, field, content) =>
    set((state) => {
      const index = state.trackers.findIndex((item) => item.id === trackerId);
      const tracker = state.trackers[index];

      let value: string | number | boolean;
      if (
        field === "value" &&
        typeof content === "string" &&
        (tracker.variant === "value" ||
          tracker.variant === "value-max" ||
          tracker.variant === "counter")
      ) {
        value = parseContentForNumber(
          content,
          tracker.value,
          tracker.inlineMath !== false,
        );
      } else if (
        field === "max" &&
        typeof content === "string" &&
        tracker.variant === "value-max"
      ) {
        value = parseContentForNumber(
          content,
          tracker.max,
          tracker.inlineMath !== false,
        );
      } else {
        value = content;
      }

      state.trackers = [
        ...state.trackers.slice(0, index),
        {
          ...state.trackers[index],
          [field]: value,
        },
        ...state.trackers.slice(index + 1),
      ];

      sideEffects(state);
      return { ...state };
    }),
  addTrackerBubble: () =>
    set((state) => {
      if (state.trackers.length < MAX_TRACKER_COUNT) {
        state.trackers = [...state.trackers, createBubble(state.trackers)];
      }
      sideEffects(state);
      return { ...state };
    }),
  addCounterTracker: () =>
    set((state) => {
      if (state.trackers.length < MAX_TRACKER_COUNT) {
        state.trackers = [...state.trackers, createCounter(state.trackers)];
      }
      sideEffects(state);
      return { ...state };
    }),
  addTrackerBar: () =>
    set((state) => {
      if (state.trackers.length < MAX_TRACKER_COUNT) {
        state.trackers = [...state.trackers, createBar(state.trackers)];
      }
      sideEffects(state);
      return { ...state };
    }),
  addCheckboxTracker: () =>
    set((state) => {
      if (state.trackers.length < MAX_TRACKER_COUNT) {
        state.trackers = [
          ...state.trackers,
          createCheckboxTracker(state.trackers),
        ];
      }
      sideEffects(state);
      return { ...state };
    }),
  deleteTracker: (trackerId) =>
    set((state) => {
      const index = state.trackers.findIndex((item) => item.id === trackerId);
      state.trackers.splice(index, 1);
      sideEffects(state);
      return { ...state };
    }),
  toggleShowOnMap: (trackerId) =>
    set((state) => {
      const index = state.trackers.findIndex((item) => item.id === trackerId);
      const showOnMap = state.trackers[index].showOnMap;
      state.trackers.splice(index, 1, {
        ...state.trackers[index],
        ["showOnMap"]: showOnMap === undefined ? false : !showOnMap,
      });
      sideEffects(state);
      return { ...state };
    }),
  toggleInlineMath: (trackerId) =>
    set((state) => {
      const index = state.trackers.findIndex((item) => item.id === trackerId);
      const inlineMath = state.trackers[index].inlineMath;
      state.trackers.splice(index, 1, {
        ...state.trackers[index],
        ["inlineMath"]: inlineMath === undefined ? false : !inlineMath,
      });
      sideEffects(state);
      return { ...state };
    }),
}));

function sideEffects(state: TrackerState) {
  // Update trackers in the location they are stored
  if (state.writeToSaveLocation === undefined)
    throw new Error("Write to save location is undefined");
  state.writeToSaveLocation(state.trackers);
}

export function parseContentForNumber(
  inputContent: string,
  previousValue: number,
  doInlineMath = true,
  bounds?: { min?: number; max?: number },
): number {
  if (inputContent.startsWith("=")) {
    inputContent = inputContent.substring(1).trim();
    doInlineMath = false;
  }

  const newValue = parseFloat(inputContent);

  if (Number.isNaN(newValue)) return 0;
  if (
    doInlineMath &&
    (inputContent.startsWith("+") || inputContent.startsWith("-"))
  ) {
    return Math.trunc(previousValue + Math.trunc(newValue));
  }

  if (bounds !== undefined) {
    if (bounds.max !== undefined && newValue > bounds.max) return bounds.max;
    if (bounds.min !== undefined && newValue < bounds.min) return bounds.min;
  }

  return newValue;
}
