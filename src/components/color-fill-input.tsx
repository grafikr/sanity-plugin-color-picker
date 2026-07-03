import { Box, Button, Grid, Popover, Stack } from '@sanity/ui';
import { useCallback } from 'react';
import type { ObjectInputProps } from 'sanity';
import { set } from 'sanity';
import {
  colorValueToBackgroundImage,
  colorValueToHexAlpha,
  DEFAULT_COLOR_VALUE,
  POPOVER_WIDTH,
} from '../lib/color-model';
import { DEFAULT_GRADIENT_VALUE, gradientToCss } from '../lib/gradient-model';
import { usePopoverField } from '../lib/use-popover-field';
import type {
  ColorFillValue,
  ColorGradientValue,
  ColorValue,
  FillMode,
} from '../types';
import { ColorPicker } from './color-picker';
import { ColorSwatchButton } from './color-swatch-button';
import { GradientEditor } from './gradient-editor';

export const ColorFillInput = (props: ObjectInputProps) => {
  const { value, onChange, readOnly, id } = props;
  const fillValue = value as ColorFillValue | undefined;
  const mode: FillMode = fillValue?.mode ?? 'solid';
  const { open, toggle, buttonRef, popoverRef } = usePopoverField();

  const handleChange = useCallback(
    (next: ColorFillValue) => {
      onChange(set(next));
    },
    [onChange],
  );

  const buildFillValue = useCallback(
    (
      overrides: Partial<Pick<ColorFillValue, 'mode' | 'color' | 'gradient'>>,
    ): ColorFillValue => ({
      _type: 'colorFill',
      mode: fillValue?.mode ?? 'solid',
      color: fillValue?.color ?? DEFAULT_COLOR_VALUE,
      gradient: fillValue?.gradient ?? DEFAULT_GRADIENT_VALUE,
      ...overrides,
    }),
    [fillValue],
  );

  const setMode = useCallback(
    (nextMode: FillMode) => handleChange(buildFillValue({ mode: nextMode })),
    [buildFillValue, handleChange],
  );

  const handleColorChange = useCallback(
    (color: ColorValue) =>
      handleChange(buildFillValue({ mode: 'solid', color })),
    [buildFillValue, handleChange],
  );

  const handleGradientChange = useCallback(
    (gradient: ColorGradientValue) =>
      handleChange(buildFillValue({ mode: 'gradient', gradient })),
    [buildFillValue, handleChange],
  );

  const swatchBackground =
    mode === 'gradient'
      ? (gradientToCss(fillValue?.gradient) ?? 'transparent')
      : colorValueToBackgroundImage(fillValue?.color);

  return (
    <Popover
      open={open}
      portal
      placement="bottom-start"
      content={
        <div ref={popoverRef}>
          <Stack gap={0} style={{ width: POPOVER_WIDTH }}>
            <Box padding={3} paddingBottom={0}>
              <Grid gridTemplateColumns={2} gap={1}>
                <Button
                  mode={mode === 'solid' ? 'default' : 'bleed'}
                  text="Solid"
                  onClick={() => setMode('solid')}
                />
                <Button
                  mode={mode === 'gradient' ? 'default' : 'bleed'}
                  text="Gradient"
                  onClick={() => setMode('gradient')}
                />
              </Grid>
            </Box>

            {mode === 'solid' ? (
              <ColorPicker
                value={fillValue?.color}
                onChange={handleColorChange}
              />
            ) : (
              <GradientEditor
                value={fillValue?.gradient ?? DEFAULT_GRADIENT_VALUE}
                onChange={handleGradientChange}
              />
            )}
          </Stack>
        </div>
      }
    >
      <ColorSwatchButton
        id={id}
        ref={buttonRef}
        swatchBackground={swatchBackground}
        empty={!fillValue}
        valueLabel={
          mode === 'gradient'
            ? 'Gradient'
            : fillValue?.color
              ? colorValueToHexAlpha(fillValue.color).toUpperCase()
              : 'No color chosen'
        }
        onClick={toggle}
        readOnly={readOnly}
      />
    </Popover>
  );
};
