import { create } from "zustand";

export const DEFAULT_BAR_HEIGHT = 20;

interface SceneSettingsState {
  verticalOffset: number;
  trackersAboveToken: boolean;
  baseBarHeight: number;
  segmentsEnabled: boolean;

  setVerticalOffset: (verticalOffset: number) => void;
  setTrackersAboveToken: (trackersAboveToken: boolean) => void;
  setBaseBarHeight: (baseBarHeight: number) => void;
  setSegmentsEnabled: (segmentsEnabled: boolean) => void;
}

export const useSceneSettingsStore = create<SceneSettingsState>()((set) => ({
  verticalOffset: 0,
  trackersAboveToken: false,
  baseBarHeight: DEFAULT_BAR_HEIGHT,
  segmentsEnabled: false,

  setVerticalOffset: (verticalOffset) =>
    set((state) => ({ ...state, verticalOffset })),
  setTrackersAboveToken: (trackersAboveToken) =>
    set((state) => ({ ...state, trackersAboveToken })),
  setBaseBarHeight: (baseBarHeight) =>
    set((state) => ({ ...state, baseBarHeight })),
  setSegmentsEnabled: (segmentsEnabled) =>
    set((state) => ({ ...state, segmentsEnabled })),
}));
