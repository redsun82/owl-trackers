import { Metadata } from "@owlbear-rodeo/sdk";
import { getPluginId } from "./getPluginId";

export const VERTICAL_OFFSET_METADATA_ID = "verticalOffset";
export const TRACKERS_ABOVE_METADATA_ID = "trackersAboveToken";
export const BASE_BAR_HEIGHT_METADATA_ID = "baseBarHeight";
export const BASE_BUBBLE_DIAMETER_METADATA_ID = "baseBubbleDiameter";
export const SEGMENTS_ENABLED_METADATA_ID = "segmentsEnabled";

export function readBooleanFromMetadata(
  metadata: Metadata,
  key: string,
): boolean {
  const value = metadata[getPluginId(key)];
  if (typeof value !== "boolean") return false;
  return value;
}

export function readNumberFromMetadata(
  metadata: Metadata,
  key: string,
): number {
  const value = metadata[getPluginId(key)];
  if (typeof value !== "number") return 0;
  if (Number.isNaN(value)) return 0;
  return value;
}
