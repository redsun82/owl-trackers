import { create } from "zustand";

export const DEFAULT_BAR_HEIGHT = 20;
export const DEFAULT_BUBBLE_DIAMETER = 30;

export const BUBBLE_FONT_SIZE_RATIO = 22 / DEFAULT_BUBBLE_DIAMETER;
export const BUBBLE_REDUCED_FONT_SIZE_RATIO = 15 / DEFAULT_BUBBLE_DIAMETER;
export const BUBBLE_TEXT_HEIGHT_RATIO = 32 / DEFAULT_BUBBLE_DIAMETER;

export const BAR_TEXT_HEIGHT_OFFSET_RATIO = 8 / DEFAULT_BAR_HEIGHT;
export const BAR_FONT_SIZE_OFFSET_RATIO = 2 / DEFAULT_BAR_HEIGHT;
export const BAR_TEXT_Y_OFFSET_RATIO = -5.3 / DEFAULT_BAR_HEIGHT;

interface SceneSettingsState {
  verticalOffset: number;
  trackersAboveToken: boolean;
  baseBarHeight: number;
  baseBubbleDiameter: number;
  segmentsEnabled: boolean;

  setVerticalOffset: (verticalOffset: number) => void;
  setTrackersAboveToken: (trackersAboveToken: boolean) => void;
  setBaseBarHeight: (baseBarHeight: number) => void;
  setBaseBubbleDiameter: (baseBubbleDiameter: number) => void;
  setSegmentsEnabled: (segmentsEnabled: boolean) => void;
}

export const useSceneSettingsStore = create<SceneSettingsState>()((set) => ({
  verticalOffset: 0,
  trackersAboveToken: false,
  baseBarHeight: DEFAULT_BAR_HEIGHT,
  baseBubbleDiameter: DEFAULT_BUBBLE_DIAMETER,
  segmentsEnabled: false,

  setVerticalOffset: (verticalOffset) =>
    set((state) => ({ ...state, verticalOffset })),
  setTrackersAboveToken: (trackersAboveToken) =>
    set((state) => ({ ...state, trackersAboveToken })),
  setBaseBarHeight: (baseBarHeight) =>
    set((state) => ({ ...state, baseBarHeight })),
  setBaseBubbleDiameter: (baseBubbleDiameter) =>
    set((state) => ({ ...state, baseBubbleDiameter })),
  setSegmentsEnabled: (segmentsEnabled) =>
    set((state) => ({ ...state, segmentsEnabled })),
}));
