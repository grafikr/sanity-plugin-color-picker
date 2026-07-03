import { ChevronDownIcon } from '@sanity/icons';
import { Box, Card, Flex, Text } from '@sanity/ui';
import type { CSSProperties } from 'react';
import { forwardRef } from 'react';
import { CHECKERBOARD_IMAGE, CHECKERBOARD_SIZE } from '../lib/color-model';

const EMPTY_SWATCH_STYLE: CSSProperties = {
  backgroundImage:
    'repeating-linear-gradient(-45deg, transparent, transparent 3px, var(--card-border-color) 3px, var(--card-border-color) 4px)',
};

type ColorSwatchButtonProps = {
  /** CSS `background-image`-compatible value (a gradient, or a solid color wrapped as `linear-gradient(color 0 0)`), painted over a checkerboard so alpha is visible. */
  swatchBackground?: string;
  empty?: boolean;
  valueLabel: string;
  onClick: () => void;
  readOnly?: boolean;
  /** The field's `inputId`, so its `<label htmlFor>` can focus/activate this button. */
  id?: string;
};

export const ColorSwatchButton = forwardRef<
  HTMLDivElement,
  ColorSwatchButtonProps
>(({ swatchBackground, empty, valueLabel, onClick, readOnly, id }, ref) => (
  <Card
    as="button"
    type="button"
    id={id}
    ref={ref}
    onClick={onClick}
    disabled={readOnly}
    radius={2}
    border
    tone={readOnly ? 'transparent' : 'default'}
    style={{
      width: '100%',
      textAlign: 'left',
      cursor: readOnly ? 'default' : 'pointer',
    }}
  >
    <Flex align="center" gap={3} padding={2}>
      <Box
        style={{
          width: 24,
          height: 24,
          borderRadius: 5,
          flexShrink: 0,
          border: '1px solid var(--card-border-color)',
          ...(empty
            ? EMPTY_SWATCH_STYLE
            : {
                backgroundImage: `${swatchBackground}, ${CHECKERBOARD_IMAGE}`,
                backgroundSize: `auto, ${CHECKERBOARD_SIZE}`,
              }),
        }}
      />
      <Text size={1} style={{ fontFamily: 'monospace', flex: 1 }} muted={empty}>
        {valueLabel}
      </Text>
      <ChevronDownIcon style={{ flexShrink: 0 }} />
    </Flex>
  </Card>
));

ColorSwatchButton.displayName = 'ColorSwatchButton';
