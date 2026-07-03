import { colord } from 'colord';
import type { ColorValue, HsvaColor, RgbaColor } from '../types';

export const CHECKERBOARD_IMAGE =
  'repeating-conic-gradient(#e0e0e0 0% 25%, #ffffff 0% 50%)';

export const CHECKERBOARD_SIZE = '8px 8px';

export const POPOVER_WIDTH = 300;

const rgbaToCss = (rgba: RgbaColor) =>
  `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;

export const DEFAULT_COLOR_VALUE: ColorValue = {
  _type: 'color',
  hex: '#000000',
  alpha: 1,
  rgb: { r: 0, g: 0, b: 0, a: 1 },
  hsla: { h: 0, s: 0, l: 0, a: 1 },
  value: rgbaToCss({ r: 0, g: 0, b: 0, a: 1 }),
};

/** Rounds a 0-1 alpha fraction to the nearest whole percentage step (e.g. 0.847 -> 0.85). */
export const roundAlpha = (alpha: number) => Math.round(alpha * 100) / 100;

const resolveAlpha = (value: ColorValue | undefined): number =>
  value?.alpha ?? value?.rgb?.a ?? 1;

/** Builds a `ColorValue` from an already-rounded RGBA color, keeping hex/rgb/hsla/value in sync. */
export const buildColorValue = (rgba: RgbaColor): ColorValue => {
  const instance = colord(rgba);

  return {
    _type: 'color',
    hex: instance.toHex(),
    alpha: rgba.a,
    rgb: rgba,
    hsla: instance.toHsl(),
    value: rgbaToCss(rgba),
  };
};

export const colorValueToHsva = (value: ColorValue | undefined): HsvaColor => {
  if (!value?.rgb) {
    return { h: 0, s: 0, v: 0, a: 1 };
  }

  return colord({ ...value.rgb, a: resolveAlpha(value) }).toHsv();
};

export const hsvaToColorValue = (hsva: HsvaColor): ColorValue => {
  const instance = colord(hsva);
  const alpha = roundAlpha(instance.alpha());

  return buildColorValue({ ...instance.toRgb(), a: alpha });
};

export const parseColorString = (input: string): ColorValue | null => {
  const instance = colord(input);

  if (!instance.isValid()) {
    return null;
  }

  const alpha = roundAlpha(instance.alpha());

  return buildColorValue({ ...instance.toRgb(), a: alpha });
};

export const colorValueToCss = (value: ColorValue | undefined): string =>
  value?.value ?? 'transparent';

/** Hex including the alpha channel (8-digit `#rrggbbaa` when alpha < 1). */
export const colorValueToHexAlpha = (value: ColorValue | undefined): string => {
  if (!value?.rgb) {
    return '#000000';
  }

  return colord({ ...value.rgb, a: resolveAlpha(value) }).toHex();
};

export const colorValueToBackgroundImage = (
  value: ColorValue | undefined,
): string => `linear-gradient(${colorValueToCss(value)} 0 0)`;
