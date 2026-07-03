import { useRef, useState } from 'react';
import { useColorPopoverOutsideClick } from './use-popover-outside-click';

/** Shared open/close + outside-click wiring for a swatch-button-triggered popover. */
export const usePopoverField = () => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useColorPopoverOutsideClick(open, () => setOpen(false), [
    buttonRef,
    popoverRef,
  ]);

  return {
    open,
    setOpen,
    toggle: () => setOpen((isOpen) => !isOpen),
    buttonRef,
    popoverRef,
  };
};
