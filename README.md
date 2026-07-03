# sanity-plugin-color-picker

A Sanity Studio input plugin for picking colors and gradients, with alpha
channel support.

## Features

- Solid color input with hex, rgba, and hsla editing, plus an alpha slider
- Linear and radial gradient input with multiple draggable stops
- A combined "color fill" input that toggles between solid and gradient
- Every value ships with a ready-to-use CSS string (`value`) alongside its
  structured `hex` / `rgb` / `hsla` fields, so the frontend doesn't need to
  reassemble a color string itself

## Installation

```sh
npm install sanity-plugin-color-picker
```

## Usage

Add it to your `sanity.config.ts` plugins:

```ts
import { defineConfig } from 'sanity';
import { colorPickerInput } from 'sanity-plugin-color-picker';

export default defineConfig({
  // ...
  plugins: [colorPickerInput()],
});
```

This registers three object types you can reference from your own schemas:

- `color` — a single solid color
- `colorGradient` — a linear or radial gradient
- `colorFill` — a toggle between a solid `color` and a `colorGradient`

```ts
defineField({
  name: 'background',
  type: 'colorFill',
})
```

## License

MIT
