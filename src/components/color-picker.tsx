import { Box, Button, Card, Flex, Stack, Text, TextInput } from '@sanity/ui';
import {
  Alpha,
  EditableInputHSLA,
  EditableInputRGBA,
  Hue,
  Saturation,
} from '@uiw/react-color';
import { useCallback, useState } from 'react';
import {
  buildColorValue,
  colorValueToHexAlpha,
  colorValueToHsva,
  hsvaToColorValue,
  parseColorString,
  roundAlpha,
} from '../lib/color-model';
import type { ColorFormat, ColorValue, HsvaColor, RgbaColor } from '../types';

const NEXT_FORMAT: Record<ColorFormat, ColorFormat> = {
  hex: 'rgba',
  rgba: 'hsla',
  hsla: 'hex',
};

const CHANNEL_INPUT_STYLE = { style: { flex: 1, minWidth: 0 } };

type ColorPickerProps = {
  value: ColorValue | undefined;
  onChange: (value: ColorValue) => void;
};

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const [format, setFormat] = useState<ColorFormat>('hex');
  const hsva = colorValueToHsva(value);

  const applyHsva = useCallback(
    (patch: Partial<HsvaColor>) => {
      onChange(hsvaToColorValue({ ...hsva, ...patch }));
    },
    [hsva, onChange],
  );

  const applyRgba = useCallback(
    (rgba: RgbaColor) => {
      onChange(buildColorValue({ ...rgba, a: roundAlpha(rgba.a) }));
    },
    [onChange],
  );

  const handleHexChange = useCallback(
    (raw: string) => {
      const parsed = parseColorString(raw.startsWith('#') ? raw : `#${raw}`);

      if (!parsed) {
        return;
      }

      applyRgba(parsed.rgb);
    },
    [applyRgba],
  );

  return (
    <Stack
      gap={3}
      padding={3}
      style={{ width: '100%', boxSizing: 'border-box' }}
    >
      <Card
        radius={2}
        style={{ position: 'relative', height: 180, overflow: 'hidden' }}
      >
        <Saturation
          hsva={hsva}
          onChange={applyHsva}
          style={{ width: '100%', height: '100%' }}
        />
      </Card>

      <Flex align="center" gap={2}>
        <Box flex={1} style={{ minWidth: 0 }}>
          {format === 'hex' && (
            <TextInput
              value={colorValueToHexAlpha(value).toUpperCase()}
              onChange={(event) => handleHexChange(event.currentTarget.value)}
            />
          )}
          {format === 'rgba' && (
            <EditableInputRGBA
              hsva={hsva}
              onChange={(result) => applyRgba(result.rgba)}
              rProps={CHANNEL_INPUT_STYLE}
              gProps={CHANNEL_INPUT_STYLE}
              bProps={CHANNEL_INPUT_STYLE}
              aProps={CHANNEL_INPUT_STYLE}
            />
          )}
          {format === 'hsla' && (
            <EditableInputHSLA
              hsva={hsva}
              onChange={(result) => applyRgba(result.rgba)}
              hProps={CHANNEL_INPUT_STYLE}
              sProps={CHANNEL_INPUT_STYLE}
              lProps={CHANNEL_INPUT_STYLE}
              aProps={CHANNEL_INPUT_STYLE}
            />
          )}
        </Box>

        <Button
          mode="bleed"
          fontSize={0}
          padding={2}
          text={format.toUpperCase()}
          onClick={() => setFormat(NEXT_FORMAT[format])}
        />
      </Flex>

      <Box style={{ padding: '0 2px' }}>
        <Hue hue={hsva.h} onChange={applyHsva} style={{ width: '100%' }} />
      </Box>

      <Flex align="center" gap={2}>
        <Box flex={1} style={{ padding: '0 2px' }}>
          <Alpha
            hsva={hsva}
            onChange={applyHsva}
            style={{ width: '100%' }}
            radius={4}
          />
        </Box>

        <Text size={1} muted style={{ width: 36, textAlign: 'right' }}>
          {Math.round(hsva.a * 100)}%
        </Text>
      </Flex>
    </Stack>
  );
};
