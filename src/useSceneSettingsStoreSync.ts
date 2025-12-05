import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { useEffect } from "react";
import {
  readNumberFromMetadata,
  VERTICAL_OFFSET_METADATA_ID,
  readBooleanFromMetadata,
  TRACKERS_ABOVE_METADATA_ID,
  BASE_BAR_HEIGHT_METADATA_ID,
  SEGMENTS_ENABLED_METADATA_ID,
} from "./sceneMetadataHelpers";
import { useOwlbearStore } from "./useOwlbearStore";
import { useSceneSettingsStore, DEFAULT_BAR_HEIGHT } from "./useSceneSettingsStore";

export function useSceneSettingsStoreSync() {
  const sceneReady = useOwlbearStore((state) => state.sceneReady);

  const setVerticalOffset = useSceneSettingsStore(
    (state) => state.setVerticalOffset,
  );
  const setTrackersAboveToken = useSceneSettingsStore(
    (state) => state.setTrackersAboveToken,
  );
  const setBaseBarHeight = useSceneSettingsStore(
    (state) => state.setBaseBarHeight,
  );
  const setSegmentsEnabled = useSceneSettingsStore(
    (state) => state.setSegmentsEnabled,
  );

  const setSettings = (metadata: Metadata) => {
    setVerticalOffset(
      readNumberFromMetadata(metadata, VERTICAL_OFFSET_METADATA_ID),
    );
    setTrackersAboveToken(
      readBooleanFromMetadata(metadata, TRACKERS_ABOVE_METADATA_ID),
    );
    setBaseBarHeight(
      readNumberFromMetadata(metadata, BASE_BAR_HEIGHT_METADATA_ID) || DEFAULT_BAR_HEIGHT,
    );
    setSegmentsEnabled(
      readBooleanFromMetadata(metadata, SEGMENTS_ENABLED_METADATA_ID),
    );
  };

  useEffect(() => {
    OBR.scene.onMetadataChange(setSettings);
  }, []);

  useEffect(() => {
    if (sceneReady) {
      OBR.scene.getMetadata().then(setSettings);
    }
  }, [sceneReady]);
}
