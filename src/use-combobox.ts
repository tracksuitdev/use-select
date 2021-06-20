import {
  ComboboxFunctions,
  defaultFilter,
  useComboboxBase,
  useInputValueHandler,
  useInputValueState,
  useRefCallback,
} from "./combobox-core";
import { UseSelect, useSelect, UseSelectProps } from "./use-select";
import { RefObject, useEffect } from "react";

export type UseComboboxProps<T> = UseSelectProps<T> & ComboboxFunctions<T>;
export type UseComboboxReturnValue<T> = {
  /**
   * Items filtered by {@link ComboboxFunctions.filter}, or in case of async combobox result of fetchItems
   */
  items: T[];
  /**
   * Ref that needs to be applied to combobox input element
   */
  inputRef: RefObject<HTMLInputElement>;
  /**
   * Value of input element
   */
  inputValue: string;
  /**
   * Saves given value in inputValue state
   */
  setInputValue: (value: string) => void;
};
export type UseCombobox<
  T,
  S extends HTMLElement = HTMLDivElement,
  D extends HTMLElement = HTMLUListElement
> = UseSelect<T, S, D> & UseComboboxReturnValue<T>;

/**
 * Hook that returns state and callbacks for controlling combobox component. Updates inputValue according to provided
 * value (currently selected item). This keeps inputValue and value state in sync whenever an item is selected, or value
 * was changed by some code.
 *
 * Internally it uses {@link useSelect}, {@link useComboboxBase}, {@link useInputValueState} and
 * {@link useInputValueHandler} hooks.
 *
 * Doesn't control value, instead it is expected that value and onChange function will be provided as a prop to this
 * hook. Callbacks that "change" value, actually call {@link ValueControl.onChange} function with new value.
 *
 * @template T - type of item
 * @template S - type of select element, defaults to {@link HTMLDivElement}
 * @template D - type of dropdown element, defaults to {@link HTMLUListElement}
 */
export function useCombobox<T, S extends HTMLElement = HTMLDivElement, D extends HTMLElement = HTMLUListElement>({
  items,
  itemToString,
  value,
  onClose,
  onOpen,
  filter = defaultFilter,
  ...props
}: UseComboboxProps<T>): UseCombobox<T, S, D> {
  const { inputRef, handleOpen, handleClose } = useComboboxBase({ onOpen, onClose });

  const itemToStringMemo = useRefCallback(itemToString);

  const { inputValue, ...rest } = useInputValueState(itemToStringMemo(value));
  const filteredItems = filter(items, inputValue, itemToString);
  const select = useSelect<T, S, D>({
    ...props,
    items: filteredItems,
    value,
    onClose: handleClose,
    onOpen: handleOpen,
  });
  const setInputValue = useInputValueHandler({ ...rest, ...select });

  useEffect(() => {
    if (!select.isOpen) {
      setInputValue(itemToStringMemo(value));
    }
  }, [value, setInputValue, select.isOpen, itemToStringMemo]);

  return {
    ...select,
    items: filteredItems,
    inputRef,
    inputValue,
    setInputValue,
  };
}
