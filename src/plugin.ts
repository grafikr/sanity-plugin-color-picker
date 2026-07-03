import { definePlugin } from 'sanity';
import { colorFillType } from './schema/color-fill-type';
import { colorGradientType } from './schema/color-gradient-type';
import { colorType } from './schema/color-type';

export const colorPickerInput = definePlugin({
  name: 'color-picker-input',
  schema: {
    types: [colorType, colorGradientType, colorFillType],
  },
});
