import { Popover } from '@sanity/ui';
import { useCallback } from 'react';
import type { ObjectInputProps } from 'sanity';
import { set, unset } from 'sanity';
import {
  colorValueToBackgroundImage,
  colorValueToHexAlpha,
  POPOVER_WIDTH,
} from '../lib/color-model';
import { usePopoverField } from '../lib/use-popover-field';
import type { ColorValue } from '../types';
import { ColorPicker } from './color-picker';
import { ColorSwatchButton } from './color-swatch-button';

export const ColorInput = (props: ObjectInputProps) => {
  const { value, onChange, readOnly, id } = props;
  const colorValue = value as ColorValue | undefined;
  const { open, toggle, buttonRef, popoverRef } = usePopoverField();

  const handleChange = useCallback(
    (next: ColorValue) => {
      onChange(next.rgb ? set(next) : unset());
    },
    [onChange],
  );

  return (
    <Popover
      open={open}
      portal
      placement="bottom-start"
      content={
        <div ref={popoverRef} style={{ width: POPOVER_WIDTH }}>
          <ColorPicker value={colorValue} onChange={handleChange} />
        </div>
      }
    >
      <ColorSwatchButton
        id={id}
        ref={buttonRef}
        swatchBackground={colorValueToBackgroundImage(colorValue)}
        empty={!colorValue}
        valueLabel={
          colorValue
            ? colorValueToHexAlpha(colorValue).toUpperCase()
            : 'No color chosen'
        }
        onClick={toggle}
        readOnly={readOnly}
      />
    </Popover>
  );
};
