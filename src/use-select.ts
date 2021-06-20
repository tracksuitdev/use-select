import { Flags, Handlers, Items, useHandlers, useSelectBase, ValueControl } from "./core";
import { KeyboardEventHandler, MouseEvent as ReactMouseEvent, RefObject, useCallback } from "react";

export type UseSelectProps<T> = Items<T> & ValueControl<T> & Handlers & Flags;

export type UseSelect<T, S extends HTMLElement = HTMLDivElement, D extends HTMLElement = HTMLUListElement> = {
  /**
   * Indicates whether dropdown is open or not
   */
  isOpen: boolean;
  /**
   * Index of currently highlighted item, used for keyboard control, ArrowUp key decreases this, while ArrowDown key
   * increases it
   */
  highlightedIndex: number;
  /**
   * Handles ArrowUp, ArrowDown, Enter and Escape key down event, apply to select and dropdown element
   * (add tabIndex=0 to allow key events on div element)
   */
  handleKeyDown: KeyboardEventHandler<never>;
  /**
   * Handler for button that opens/closes dropdown, toggles isOpen. Prevents propagation and default of event param.
   */
  handleClick: (e: ReactMouseEvent) => void;
  /**
   * Calls onChange with provided item
   */
  select: (item: T) => void;
  /**
   * Calls onChange with undefined param. Works only if clearable is true.
   */
  remove: () => void;
  /**
   * Calls onChange with undefined param or with empty array in case of multiple select/combobox. Works only if
   * clearable is true. Prevents propagation and default of event param.
   *
   * Use this on clear icon or button of your select/combobox.
   */
  clear: (e: ReactMouseEvent) => void;
  /**
   * Sets isOpen to true. Only works if disabled and readOnly are falsy.
   */
  open: () => void;
  /**
   * Checks if item === value
   */
  isSelected: (item: T) => boolean;
  /**
   * If given item is selected then removes it removes given item, if item is not selected then it selects given item.
   */
  handleItemClick: (item: T) => void;
  /**
   * Ref for combobox element, used internally to allow closing of dropdown on outside click
   */
  selectRef: RefObject<S>;
  /**
   * Ref for dropdown element, used internally to allow closing of dropdown on outside click and scrolling to
   * highlighted index item when using arrow keys to highlighted items.
   */
  dropdownRef: RefObject<D>;
  /**
   * Sets highlighted index state to provided index
   */
  setHighlightedIndex: (index: number) => void;
};

/**
 * Provides callbacks and state for controlling select component.
 *
 * Internally it uses {@link useSelectBase} and {@link useHandlers} hooks.
 *
 * Doesn't control value, instead it is expected that value and onChange function will be provided as a prop to this
 * hook. Callbacks that "change" value, actually call {@link ValueControl.onChange} function with new value.
 *
 * @template T - type of item
 * @template S - type of select element, defaults to {@link HTMLDivElement}
 * @template D - type of dropdown element, defaults to {@link HTMLUListElement}
 */
export function useSelect<T, S extends HTMLElement = HTMLDivElement, D extends HTMLElement = HTMLUListElement>({
  items,
  value,
  onChange,
  onOpen,
  onClose,
  readOnly,
  disabled,
  clearable,
}: UseSelectProps<T>): UseSelect<T, S, D> {
  const {
    isOpen,
    close,
    handleKeyDownBase,
    setHighlightedIndex,
    highlightedIndex,
    handleClick,
    selectRef,
    dropdownRef,
    open,
  } = useSelectBase<S, D>({
    itemCount: items.length,
    onOpen,
    onClose,
    readOnly,
    disabled,
  });

  const select = useCallback(
    (item: T) => {
      onChange?.(item);
      close();
    },
    [onChange, close]
  );

  const remove = useCallback(() => {
    if (clearable) {
      onChange?.(undefined);
    }
  }, [onChange, clearable]);

  const clear = useCallback(
    (e: ReactMouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      remove();
      close();
    },
    [remove, close]
  );

  const isSelected = useCallback((item: T) => value === item, [value]);

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
    selectRef,
    dropdownRef,
    open,
  };
}
