export type RgbaColor = { r: number; g: number; b: number; a: number };

export type HsvaColor = { h: number; s: number; v: number; a: number };

export type HslaColor = { h: number; s: number; l: number; a: number };

export type ColorValue = {
  _type: 'color';
  hex: string;
  alpha: number;
  rgb: RgbaColor;
  hsla: HslaColor;
  /** Ready-to-use CSS color, e.g. `rgba(23, 23, 23, 0.8)`. */
  value: string;
};

export type GradientStop = {
  _key: string;
  _type: 'colorGradientStop';
  position: number;
  color: ColorValue;
};

export type GradientType = 'linear' | 'radial';

export type ColorGradientValue = {
  _type: 'colorGradient';
  type: GradientType;
  angle: number;
  stops: GradientStop[];
  /** Ready-to-use CSS gradient, e.g. `linear-gradient(90deg, rgba(...) 0%, rgba(...) 100%)`. */
  value: string;
};

export type ColorFormat = 'hex' | 'rgba' | 'hsla';

export type FillMode = 'solid' | 'gradient';

export type ColorFillValue = {
  _type: 'colorFill';
  mode: FillMode;
  color?: ColorValue;
  gradient?: ColorGradientValue;
};
