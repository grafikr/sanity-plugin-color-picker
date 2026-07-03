import type {
  ColorGradientValue,
  ColorValue,
  GradientStop,
  GradientType,
} from '../types';
import {
  colorValueToCss,
  DEFAULT_COLOR_VALUE,
  parseColorString,
} from './color-model';

export const createKey = () => Math.random().toString(36).slice(2, 10);

export const createGradientStop = (
  position: number,
  color: ColorValue = DEFAULT_COLOR_VALUE,
): GradientStop => ({
  _key: createKey(),
  _type: 'colorGradientStop',
  position,
  color,
});

export const sortStops = (stops: GradientStop[]) =>
  [...stops].sort((a, b) => a.position - b.position);

type GradientShape = {
  type: GradientType;
  angle: number;
  stops: GradientStop[];
};

const gradientShapeToCss = (gradient: GradientShape): string | null => {
  if (!gradient.stops.length) {
    return null;
  }

  const stops = sortStops(gradient.stops)
    .map((stop) => `${colorValueToCss(stop.color)} ${stop.position}%`)
    .join(', ');

  return gradient.type === 'radial'
    ? `radial-gradient(circle, ${stops})`
    : `linear-gradient(${gradient.angle ?? 90}deg, ${stops})`;
};

/** Builds a `ColorGradientValue` from its raw fields, keeping `value` in sync. */
export const buildGradientValue = (
  gradient: GradientShape,
): ColorGradientValue => ({
  _type: 'colorGradient',
  ...gradient,
  value: gradientShapeToCss(gradient) ?? '',
});

export const DEFAULT_GRADIENT_VALUE: ColorGradientValue = buildGradientValue({
  type: 'linear',
  angle: 90,
  stops: [
    createGradientStop(0, parseColorString('#ffffff') ?? DEFAULT_COLOR_VALUE),
    createGradientStop(100, DEFAULT_COLOR_VALUE),
  ],
});

export const gradientToCss = (
  gradient: ColorGradientValue | undefined,
): string | null => gradient?.value || null;
