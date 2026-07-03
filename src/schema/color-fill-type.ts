import { defineType } from 'sanity';
import { ColorFillInput } from '../components/color-fill-input';
import { InlineColorField } from '../components/inline-color-field';

export const colorFillType = defineType({
  name: 'colorFill',
  title: 'Color',
  type: 'object',
  fields: [
    {
      name: 'mode',
      title: 'Mode',
      type: 'string',
      options: { list: ['solid', 'gradient'] },
      initialValue: 'solid',
    },
    { name: 'color', title: 'Color', type: 'color' },
    { name: 'gradient', title: 'Gradient', type: 'colorGradient' },
  ],
  components: {
    input: ColorFillInput,
    field: InlineColorField,
  },
  preview: {
    select: { mode: 'mode', hex: 'color.hex' },
    prepare({ mode, hex }: { mode?: string; hex?: string }) {
      return {
        title: mode === 'gradient' ? 'Gradient' : hex || 'No color chosen',
      };
    },
  },
});
