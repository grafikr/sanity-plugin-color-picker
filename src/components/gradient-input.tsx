import { Popover } from '@sanity/ui';
import { useCallback } from 'react';
import type { ObjectInputProps } from 'sanity';
import { set } from 'sanity';
import { POPOVER_WIDTH } from '../lib/color-model';
import { DEFAULT_GRADIENT_VALUE, gradientToCss } from '../lib/gradient-model';
import { usePopoverField } from '../lib/use-popover-field';
import type { ColorGradientValue } from '../types';
import { ColorSwatchButton } from './color-swatch-button';
import { GradientEditor } from './gradient-editor';

export const GradientInput = (props: ObjectInputProps) => {
  const { value, onChange, readOnly, id } = props;
  const gradientValue = value as ColorGradientValue | undefined;
  const { open, toggle, buttonRef, popoverRef } = usePopoverField();

  const handleChange = useCallback(
    (next: ColorGradientValue) => {
      onChange(set(next));
    },
    [onChange],
  );

  const handleOpen = useCallback(() => {
    if (!gradientValue) {
      handleChange(DEFAULT_GRADIENT_VALUE);
    }

    toggle();
  }, [gradientValue, handleChange, toggle]);

  const gradientCss = gradientToCss(gradientValue);

  return (
    <Popover
      open={open}
      portal
      placement="bottom-start"
      content={
        <div ref={popoverRef} style={{ width: POPOVER_WIDTH }}>
          <GradientEditor
            value={gradientValue ?? DEFAULT_GRADIENT_VALUE}
            onChange={handleChange}
          />
        </div>
      }
    >
      <ColorSwatchButton
        id={id}
        ref={buttonRef}
        swatchBackground={gradientCss ?? undefined}
        empty={!gradientCss}
        valueLabel={gradientCss ? 'Gradient' : 'No color chosen'}
        onClick={handleOpen}
        readOnly={readOnly}
      />
    </Popover>
  );
};
