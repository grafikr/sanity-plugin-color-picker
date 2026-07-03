import { useClickOutsideEvent } from '@sanity/ui';
import type { RefObject } from 'react';

export const useColorPopoverOutsideClick = (
  active: boolean,
  onOutsideClick: () => void,
  refs: RefObject<HTMLElement | null>[],
) => {
  useClickOutsideEvent(active ? onOutsideClick : false, () =>
    refs.map((ref) => ref.current),
  );
};
