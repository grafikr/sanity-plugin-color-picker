import { defineType } from 'sanity';
import { GradientInput } from '../components/gradient-input';

export const colorGradientType = defineType({
  name: 'colorGradient',
  title: 'Gradient',
  type: 'object',
  fields: [
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: ['linear', 'radial'] },
      initialValue: 'linear',
    },
    { name: 'angle', title: 'Angle', type: 'number', initialValue: 90 },
    {
      name: 'stops',
      title: 'Stops',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'colorGradientStop',
          fields: [
            { name: 'position', title: 'Position', type: 'number' },
            { name: 'color', title: 'Color', type: 'color' },
          ],
        },
      ],
    },
    {
      name: 'value',
      type: 'string',
      description:
        'Ready-to-use CSS gradient value, e.g. linear-gradient(90deg, ...).',
    },
  ],
  components: {
    input: GradientInput,
  },
});
