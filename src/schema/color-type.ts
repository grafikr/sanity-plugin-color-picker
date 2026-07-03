import { defineType } from 'sanity';
import { ColorInput } from '../components/color-input';
import { InlineColorField } from '../components/inline-color-field';

export const colorType = defineType({
  name: 'color',
  title: 'Color',
  type: 'object',
  fields: [
    { name: 'hex', type: 'string' },
    { name: 'alpha', type: 'number' },
    {
      name: 'rgb',
      type: 'object',
      fields: [
        { name: 'r', type: 'number' },
        { name: 'g', type: 'number' },
        { name: 'b', type: 'number' },
        { name: 'a', type: 'number' },
      ],
    },
    {
      name: 'hsla',
      type: 'object',
      fields: [
        { name: 'h', type: 'number' },
        { name: 's', type: 'number' },
        { name: 'l', type: 'number' },
        { name: 'a', type: 'number' },
      ],
    },
    {
      name: 'value',
      type: 'string',
      description: 'Ready-to-use CSS color value, e.g. rgba(23, 23, 23, 0.8).',
    },
  ],
  components: {
    input: ColorInput,
    field: InlineColorField,
  },
  preview: {
    select: { hex: 'hex' },
    prepare({ hex }: { hex?: string }) {
      return { title: hex || 'No color chosen' };
    },
  },
});
