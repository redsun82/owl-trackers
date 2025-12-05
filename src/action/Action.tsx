import { useOwlbearStore } from "../useOwlbearStore";
import IconButton from "../components/IconButton";
import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId";
import ToggleButton from "../components/ToggleButton";
import { useEffect, useRef, useState } from "react";
import Input from "../components/Input";
import {
  BASE_BAR_HEIGHT_METADATA_ID,
  BASE_BUBBLE_DIAMETER_METADATA_ID,
  SEGMENTS_ENABLED_METADATA_ID,
  TRACKERS_ABOVE_METADATA_ID,
  VERTICAL_OFFSET_METADATA_ID,
} from "../sceneMetadataHelpers";
import ActionHeader from "./ActionHeader";
import ReportBugButton from "../components/ReportBugButton";
import { useSceneSettingsStore } from "../useSceneSettingsStore";
import { Collapse } from "@mui/material";
import { cn } from "../lib/utils";
import { useTrackerBarNames } from "./getTrackerBarNames";
import DeleteIcon from "../icons/DeleteIcon";
import { TrackerInput } from "../components/TrackerInput";
import SimplePlusIcon from "../icons/SimplePlusIcon";
import { parseContentForNumber } from "../useTrackerStore";
import OpenInNewIcon from "../icons/OpenInNewIcon";

export function Action(): React.JSX.Element {
  const mode = useOwlbearStore((state) => state.themeMode);
  const role = useOwlbearStore((state) => state.role);

  const verticalOffset = useSceneSettingsStore((state) => state.verticalOffset);
  const setVerticalOffset = useSceneSettingsStore(
    (state) => state.setVerticalOffset,
  );

  const trackersAboveToken = useSceneSettingsStore(
    (state) => state.trackersAboveToken,
  );
  const setTrackersAboveToken = useSceneSettingsStore(
    (state) => state.setTrackersAboveToken,
  );

  const baseBarHeight = useSceneSettingsStore((state) => state.baseBarHeight);
  const setBaseBarHeight = useSceneSettingsStore(
    (state) => state.setBaseBarHeight,
  );

  const baseBubbleDiameter = useSceneSettingsStore(
    (state) => state.baseBubbleDiameter,
  );
  const setBaseBubbleDiameter = useSceneSettingsStore(
    (state) => state.setBaseBubbleDiameter,
  );

  const segmentsEnabled = useSceneSettingsStore(
    (state) => state.segmentsEnabled,
  );
  const setSegmentsEnabled = useSceneSettingsStore(
    (state) => state.setSegmentsEnabled,
  );

  const trackerBarNames = useTrackerBarNames();

  const [segmentSettings, setSegmentSettings] = useState<[string, number][]>(
    [],
  );

  const updateSegmentSettings = (segmentSettings: [string, number][]) => {
    OBR.scene.setMetadata({
      [getPluginId("segmentSettings")]: segmentSettings,
    });
    setSegmentSettings(segmentSettings);
  };

  useEffect(() => {
    const handleSceneMetadata = (sceneMetadata: Metadata) => {
      const segmentSettings = sceneMetadata[getPluginId("segmentSettings")];
      if (segmentSettings == undefined) setSegmentSettings([]);
      else setSegmentSettings(segmentSettings as [string, number][]);
    };
    OBR.scene.getMetadata().then(handleSceneMetadata);
    return OBR.scene.onMetadataChange(handleSceneMetadata);
  }, []);

  const trackerNamesWithSegmentsDisabled = trackerBarNames.filter(
    (name) => !segmentSettings.map((value) => value[0]).includes(name),
  );

  const baseHeight = 0;
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          const entry = entries[0];
          // Get the height of the border box
          // In the future you can use `entry.borderBoxSize`
          // however as of this time the property isn't widely supported (iOS)
          const borderHeight = entry.contentRect.bottom + entry.contentRect.top;
          // Set a minimum height of 64px
          const listHeight = Math.max(borderHeight);
          // Set the action height to the list height + the card header height + the divider + margin
          OBR.action.setHeight(listHeight + baseHeight);
          // console.log(listHeight);
        }
      });
      resizeObserver.observe(divRef.current);
      return () => {
        resizeObserver.disconnect();
        // Reset height when unmounted
        OBR.action.setHeight(129);
      };
    }
  }, [divRef]);

  return (
    <div className={cn("h-screen overflow-y-auto", { dark: mode === "DARK" })}>
      <div ref={divRef}>
        {/* Header */}
        <ActionHeader></ActionHeader>

        {/* Settings */}
        <div className="flex w-full flex-col pt-3">
          {role === "PLAYER" ? (
            <h2 className="justify-self-start px-4 py-2 text-sm text-text-secondary dark:text-text-secondary-dark">
              Must have GM access to configure settings.
            </h2>
          ) : (
            <>
              <div className="grid w-full auto-rows-fr grid-cols-[auto_50px] items-center justify-items-center gap-x-1 gap-y-1 px-4">
                {/* Default trackers */}
                <h2 className="justify-self-start text-sm text-text-primary dark:text-text-primary-dark">
                  Set scene default trackers
                </h2>
                <IconButton
                  Icon={OpenInNewIcon}
                  onClick={() =>
                    OBR.popover.open({
                      id: getPluginId("scene-editor"),
                      url: "/src/sceneEditor/sceneEditor.html",
                      height: 550,
                      width: 430,
                      anchorOrigin: {
                        horizontal: "CENTER",
                        vertical: "CENTER",
                      },
                      transformOrigin: {
                        horizontal: "CENTER",
                        vertical: "CENTER",
                      },
                    })
                  }
                ></IconButton>

                {/* Default trackers */}
                <h2 className="justify-self-start text-sm text-text-primary dark:text-text-primary-dark">
                  Vertical Offset
                </h2>
                <Input
                  value={verticalOffset}
                  updateHandler={(value: number) => {
                    setVerticalOffset(value);
                    OBR.scene.setMetadata({
                      [getPluginId(VERTICAL_OFFSET_METADATA_ID)]: value,
                    });
                  }}
                ></Input>

                {/* Default trackers */}
                <h2 className="justify-self-start text-sm text-text-primary dark:text-text-primary-dark">
                  Trackers above token
                </h2>
                <ToggleButton
                  isChecked={trackersAboveToken}
                  changeHandler={(isChecked: boolean) => {
                    setTrackersAboveToken(isChecked);
                    OBR.scene.setMetadata({
                      [getPluginId(TRACKERS_ABOVE_METADATA_ID)]: isChecked,
                    });
                  }}
                ></ToggleButton>

                {/* Base Bar Height */}
                <h2 className="justify-self-start text-sm text-text-primary dark:text-text-primary-dark">
                  Base Bar Height
                </h2>
                <Input
                  value={baseBarHeight}
                  updateHandler={(value: number) => {
                    setBaseBarHeight(value);
                    OBR.scene.setMetadata({
                      [getPluginId(BASE_BAR_HEIGHT_METADATA_ID)]: value,
                    });
                  }}
                ></Input>

                {/* Base Bubble Diameter */}
                <h2 className="justify-self-start text-sm text-text-primary dark:text-text-primary-dark">
                  Base Bubble Diameter
                </h2>
                <Input
                  value={baseBubbleDiameter}
                  updateHandler={(value: number) => {
                    setBaseBubbleDiameter(value);
                    OBR.scene.setMetadata({
                      [getPluginId(BASE_BUBBLE_DIAMETER_METADATA_ID)]: value,
                    });
                  }}
                ></Input>

                {/* Segments */}
                <h2 className="justify-self-start text-sm text-text-primary dark:text-text-primary-dark">
                  Enable Segments
                </h2>
                <ToggleButton
                  isChecked={segmentsEnabled}
                  changeHandler={(isChecked: boolean) => {
                    setSegmentsEnabled(isChecked);
                    OBR.scene.setMetadata({
                      [getPluginId(SEGMENTS_ENABLED_METADATA_ID)]: isChecked,
                    });
                  }}
                ></ToggleButton>
              </div>

              {/* Segments dropdown */}
              <div>
                <Collapse in={segmentsEnabled}>
                  <div className={"my-1 flex flex-col gap-2 bg-black/15 p-2"}>
                    {segmentSettings.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {[...segmentSettings].map((setting) => (
                          <div
                            key={setting[0]}
                            className="overflow-clip rounded-lg bg-white/5 p-2 pb-3 pl-3"
                          >
                            <div className="flex w-full items-start justify-between">
                              <div>
                                <h1 className="text-text-primary dark:text-text-primary-dark">
                                  {setting[0]}
                                </h1>
                                <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                                  Segments
                                </p>
                              </div>
                              <IconButton
                                Icon={DeleteIcon}
                                className="rounded-md"
                                onClick={() =>
                                  updateSegmentSettings(
                                    segmentSettings.filter(
                                      (value) => value !== setting,
                                    ),
                                  )
                                }
                              />
                            </div>
                            <div className="flex justify-between pr-1 pt-2">
                              <TrackerInput
                                fullWidth
                                value={setting[1].toString()}
                                onConfirm={(content) => {
                                  const index = segmentSettings.findIndex(
                                    (value) => value[0] === setting[0],
                                  );
                                  if (index !== -1) {
                                    segmentSettings[index][1] = Math.trunc(
                                      parseContentForNumber(content, 0, false, {
                                        min: 0,
                                      }),
                                    );
                                    updateSegmentSettings([...segmentSettings]);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {trackerNamesWithSegmentsDisabled.length > 0 && (
                      <div className="flex flex-row flex-wrap gap-2 py-1">
                        {trackerNamesWithSegmentsDisabled.map((name) => (
                          <button
                            key={name}
                            className="flex items-center gap-2 rounded-full px-3 py-1 pl-2 text-sm text-text-primary outline outline-1 outline-white/30 hover:bg-black/20 dark:text-text-primary-dark"
                            onClick={() =>
                              updateSegmentSettings([
                                ...segmentSettings,
                                [name, 0],
                              ])
                            }
                          >
                            <SimplePlusIcon />
                            <div className="pt-0.5">{name}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Collapse>
              </div>
            </>
          )}

          {/* Report Bug button */}
          <ReportBugButton />
        </div>
      </div>
    </div>
  );
}
