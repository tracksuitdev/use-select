import { useCallback, useEffect, useRef, useState } from "react";
import { Handlers } from "./core";

export type UseInputValueHandlerProps = {
  /**
   * Saves given value in state
   */
  setInputValue: (value: string) => void;
  /**
   * Saves given index in state
   */
  setHighlightedIndex: (index: number) => void;
};

/**
 * Simple hook for controlling the state of input used in combobox
 * @param initialValue - initial value of input state
 */
export function useInputValueState(initialValue: string) {
  const [inputValue, setInputValue] = useState(initialValue);
  return { inputValue, setInputValue };
}

/**
 * Returns callback that updates inputValue and highlightedIndex state, resetting highlightedIndex to -1 when value is
 * changed. This is done because when inputValue changes, number of items can change depending on the filtering, if this
 * happens then highlightedIndex needs to be reset.
 */
export function useInputValueHandler({ setInputValue, setHighlightedIndex }: UseInputValueHandlerProps) {
  return useCallback(
    (value: string) => {
      setInputValue(value);
      setHighlightedIndex(-1);
    },
    [setInputValue, setHighlightedIndex]
  );
}

/**
 * Base of combobox hooks, returns ref for input element and open and close handlers that take care of opening/closing
 * dropdown and focusing/blurring input element
 */
export function useComboboxBase({ onOpen, onClose }: Handlers) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleOpen = useCallback(() => {
    onOpen?.();
    inputRef.current?.focus();
  }, [onOpen, inputRef]);
  const handleClose = useCallback(() => {
    onClose?.();
    inputRef.current?.blur();
  }, [onClose, inputRef]);

  return {
    inputRef,
    handleOpen,
    handleClose,
  };
}

export type ItemToString<T> = (item?: T) => string;

/**
 * This function will be used if filter prop is not provided to combobox hooks. It returns all items that start with
 * query string. Comparison is case insensitive.
 * @param items - combobox items
 * @param query - string to filter by
 * @param itemToString - function that converts item to string
 */
export function defaultFilter<T>(items: T[], query: string, itemToString: ItemToString<T>) {
  return items.filter(item =>
    itemToString(item)
      .toLowerCase()
      .startsWith(query.toLowerCase())
  );
}

export type ComboboxFunctions<T> = {
  /**
   * Function that converts item to string. Since items can be of any type, to compare them we need to have a way of
   * converting them to string.
   */
  itemToString: ItemToString<T>;
  /**
   * Function used for filtering items, default is {@link defaultFilter}
   * @param items - all combobox items
   * @param query - current input value of combobox
   * @param itemToString - function that converts item to string
   */
  filter?: (items: T[], query: string, itemToString: ItemToString<T>) => T[];
};

/**
 * Helper hook that memoizes given function using ref. Neat trick to prevent rerunning of effects when a given function
 * is recreated (such as on rerender of a component in which it is defined) while still obeying react-hooks-rules.
 *
 * Note that since refs are mutable, whenever returned function is called it will still be the "latest" function.
 * @param fn - function that is memoized
 */
export function useRefCallback<F extends (...args: any[]) => any>(fn: F) {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  }, [fn]);
  return useCallback(ref.current, []);
}
