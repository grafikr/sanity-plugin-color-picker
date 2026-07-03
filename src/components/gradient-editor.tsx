import { TrashIcon } from '@sanity/icons';
import { Box, Button, Flex, Grid, Popover, Stack, Text } from '@sanity/ui';
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';
import { useCallback, useRef, useState } from 'react';
import {
  CHECKERBOARD_IMAGE,
  CHECKERBOARD_SIZE,
  colorValueToBackgroundImage,
  POPOVER_WIDTH,
} from '../lib/color-model';
import {
  buildGradientValue,
  createGradientStop,
  gradientToCss,
  sortStops,
} from '../lib/gradient-model';
import { useColorPopoverOutsideClick } from '../lib/use-popover-outside-click';
import type {
  ColorGradientValue,
  ColorValue,
  GradientStop,
  GradientType,
} from '../types';
import { ColorPicker } from './color-picker';

const TRACK_HEIGHT = 36;
const HANDLE_SIZE = 16;

type GradientEditorProps = {
  value: ColorGradientValue;
  onChange: (value: ColorGradientValue) => void;
};

export const GradientEditor = ({ value, onChange }: GradientEditorProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<{
    key: string;
    startX: number;
    moved: boolean;
  } | null>(null);
  const stopButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [selectedStopKey, setSelectedStopKey] = useState<string | null>(null);

  const stops = sortStops(value.stops ?? []);
  const selectedStop =
    stops.find((stop) => stop._key === selectedStopKey) ?? null;

  useColorPopoverOutsideClick(
    Boolean(selectedStop),
    () => setSelectedStopKey(null),
    [popoverRef],
  );

  const updateStops = useCallback(
    (nextStops: GradientStop[]) =>
      onChange(
        buildGradientValue({
          type: value.type,
          angle: value.angle,
          stops: nextStops,
        }),
      ),
    [onChange, value],
  );

  const updateStopPosition = useCallback(
    (key: string, position: number) =>
      updateStops(
        stops.map((stop) => (stop._key === key ? { ...stop, position } : stop)),
      ),
    [stops, updateStops],
  );

  const updateStopColor = useCallback(
    (key: string, color: ColorValue) =>
      updateStops(
        stops.map((stop) => (stop._key === key ? { ...stop, color } : stop)),
      ),
    [stops, updateStops],
  );

  const removeStop = useCallback(
    (key: string) => {
      if (stops.length <= 2) {
        return;
      }

      updateStops(stops.filter((stop) => stop._key !== key));
      setSelectedStopKey(null);
    },
    [stops, updateStops],
  );

  const positionFromClientX = useCallback((clientX: number) => {
    if (!trackRef.current) {
      return 0;
    }

    const rect = trackRef.current.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.round(Math.min(1, Math.max(0, ratio)) * 100);
  }, []);

  const handleTrackClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.target !== trackRef.current) {
        return;
      }

      const position = positionFromClientX(event.clientX);
      const nearest = [...stops].sort(
        (a, b) =>
          Math.abs(a.position - position) - Math.abs(b.position - position),
      )[0];
      const newStop = createGradientStop(position, nearest?.color);
      updateStops([...stops, newStop]);
      setSelectedStopKey(newStop._key);
    },
    [positionFromClientX, stops, updateStops],
  );

  const handlePointerDown = useCallback(
    (key: string) => (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      dragState.current = { key, startX: event.clientX, moved: false };
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      const drag = dragState.current;

      if (!drag) {
        return;
      }

      if (Math.abs(event.clientX - drag.startX) > 2) {
        drag.moved = true;
      }

      updateStopPosition(drag.key, positionFromClientX(event.clientX));
    },
    [positionFromClientX, updateStopPosition],
  );

  const handlePointerUp = useCallback(() => {
    const drag = dragState.current;
    dragState.current = null;

    if (drag && !drag.moved) {
      setSelectedStopKey(drag.key);
    }
  }, []);

  const setType = (type: GradientType) =>
    onChange(
      buildGradientValue({ type, angle: value.angle, stops: value.stops }),
    );

  return (
    <Stack
      gap={3}
      padding={3}
      style={{ width: '100%', boxSizing: 'border-box' }}
    >
      <Grid gridTemplateColumns={2} gap={1}>
        <Button
          mode={value.type === 'linear' ? 'default' : 'bleed'}
          text="Linear"
          onClick={() => setType('linear')}
        />
        <Button
          mode={value.type === 'radial' ? 'default' : 'bleed'}
          text="Radial"
          onClick={() => setType('radial')}
        />
      </Grid>

      {value.type === 'linear' && (
        <Flex align="center" gap={2}>
          <Text size={1} muted style={{ width: 44 }}>
            Angle
          </Text>
          <input
            type="range"
            min={0}
            max={360}
            value={value.angle ?? 90}
            onChange={(event) =>
              onChange(
                buildGradientValue({
                  type: value.type,
                  angle: Number(event.currentTarget.value),
                  stops: value.stops,
                }),
              )
            }
            style={{ flex: 1 }}
          />
          <Text size={1} muted style={{ width: 32, textAlign: 'right' }}>
            {value.angle ?? 90}°
          </Text>
        </Flex>
      )}

      <Box
        ref={trackRef}
        onClick={handleTrackClick}
        style={{
          position: 'relative',
          height: TRACK_HEIGHT,
          borderRadius: 6,
          border: '1px solid var(--card-border-color)',
          background: gradientToCss(value) ?? 'transparent',
          cursor: 'copy',
        }}
      >
        {stops.map((stop) => (
          <button
            key={stop._key}
            ref={(el) => {
              if (el) {
                stopButtonRefs.current.set(stop._key, el);
              } else {
                stopButtonRefs.current.delete(stop._key);
              }
            }}
            type="button"
            onPointerDown={handlePointerDown(stop._key)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              position: 'absolute',
              left: `${stop.position}%`,
              top: '50%',
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundImage: `${colorValueToBackgroundImage(stop.color)}, ${CHECKERBOARD_IMAGE}`,
              backgroundSize: `auto, ${CHECKERBOARD_SIZE}`,
              border:
                stop._key === selectedStopKey
                  ? '2px solid var(--card-focus-ring-color, #2276fc)'
                  : '2px solid white',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.25)',
              cursor: 'grab',
              padding: 0,
            }}
            aria-label={`Gradient stop at ${stop.position}%`}
          />
        ))}
      </Box>

      {selectedStop && (
        // Not portaled: this renders inside the parent color/gradient
        // input's own (portaled) popover content, so it needs to stay a
        // real DOM descendant of that popover's outside-click boundary —
        // otherwise clicking here would register as "outside" and close it.
        <Popover
          open
          placement="bottom"
          referenceElement={
            stopButtonRefs.current.get(selectedStop._key) ?? null
          }
          content={
            <div ref={popoverRef} style={{ width: POPOVER_WIDTH }}>
              <ColorPicker
                value={selectedStop.color}
                onChange={(color) => updateStopColor(selectedStop._key, color)}
              />
              <Box padding={3} paddingTop={0}>
                <Button
                  icon={TrashIcon}
                  mode="bleed"
                  tone="critical"
                  text="Remove stop"
                  disabled={stops.length <= 2}
                  onClick={() => removeStop(selectedStop._key)}
                  style={{ width: '100%' }}
                />
              </Box>
            </div>
          }
        />
      )}
    </Stack>
  );
};
