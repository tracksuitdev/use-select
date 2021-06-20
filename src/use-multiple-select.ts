import { Flags, Handlers, Items, MultiValueControl, useHandlers, useSelectBase } from "./core";
import { UseSelect } from "./use-select";
import { MouseEvent as ReactMouseEvent, useCallback } from "react";

export type UseMultipleSelectProps<T> = Items<T> & MultiValueControl<T> & Handlers & Flags;

export type UseMultipleSelect<
  T,
  S extends HTMLElement = HTMLDivElement,
  D extends HTMLElement = HTMLUListElement
> = Omit<UseSelect<T, S, D>, "remove"> & {
  /**
   * Calls {@link MultiValueControl.onChange} with new array without the item at provided index
   */
  removeByIndex: (index: number) => void;
  /**
   * Calls {@link MultiValueControl.onChange} with new array without provided item
   */
  remove: (item: T) => void;
};

/**
 * Allows selection of multiple items. Useful for building multiple select component.
 *
 * Internally it uses {@link useSelectBase} and {@link useHandlers} hooks.
 *
 * Doesn't control value, instead it is expected that value and onChange function will be provided as a prop to this
 * hook. Callbacks that "change" value, actually call {@link MultiValueControl.onChange} function with new value.
 *
 * @template T - type of item
 * @template S - type of select element, defaults to {@link HTMLDivElement}
 * @template D - type of dropdown element, defaults to {@link HTMLUListElement}
 */
export function useMultipleSelect<T, S extends HTMLElement = HTMLDivElement, D extends HTMLElement = HTMLUListElement>({
  items,
  value,
  onChange,
  onOpen,
  onClose,
  readOnly,
  disabled,
  clearable,
}: UseMultipleSelectProps<T>): UseMultipleSelect<T, S, D> {
  const {
    isOpen,
    handleClick,
    handleKeyDownBase,
    highlightedIndex,
    selectRef,
    dropdownRef,
    open,
    setHighlightedIndex,
  } = useSelectBase<S, D>({
    itemCount: items.length,
    onOpen,
    onClose,
    readOnly,
    disabled,
  });

  const select = useCallback(
    (item: T) => {
      const currentValue = value ? [...value] : [];
      currentValue.push(item);
      onChange?.(currentValue);
    },
    [value, onChange]
  );

  const clear = useCallback(
    (e: ReactMouseEvent) => {
      if (clearable) {
        e.preventDefault();
        e.stopPropagation();
        onChange?.([]);
      }
    },
    [onChange, clearable]
  );

  const isSelected = useCallback(
    (item: T) => {
      return (value?.indexOf(item) ?? -1) > -1;
    },
    [value]
  );

  const removeByIndex = useCallback(
    (index: number) => {
      const currentValue = value ? [...value] : [];
      currentValue.splice(index, 1);
      onChange?.(currentValue);
    },
    [onChange, value]
  );

  const remove = useCallback(
    (item?: T) => {
      if (value && item) {
        removeByIndex(value?.indexOf(item));
      }
    },
    [removeByIndex, value]
  );

  const { handleKeyDown, handleItemClick } = useHandlers({
    highlightedIndex,
    items,
    select,
    remove,
    isSelected,
    handleKeyDownBase,
  });

  return {
    isOpen,
    highlightedIndex,
    setHighlightedIndex,
    handleClick,
    handleKeyDown,
    select,
    remove,
    clear,
    isSelected,
    handleItemClick,
    removeByIndex,
    selectRef,
    dropdownRef,
    open,
  };
}
