import { UseMultipleSelect, useMultipleSelect, UseMultipleSelectProps } from "./use-multiple-select";
import {
  ComboboxFunctions,
  defaultFilter,
  useComboboxBase,
  useInputValueHandler,
  useInputValueState,
} from "./combobox-core";
import { useEffect } from "react";
import { UseComboboxReturnValue } from "./use-combobox";

export type UseMultipleComboboxProps<T> = UseMultipleSelectProps<T> & ComboboxFunctions<T>;
export type UseMultipleCombobox<
  T,
  S extends HTMLElement = HTMLDivElement,
  D extends HTMLElement = HTMLUListElement
> = UseMultipleSelect<T, S, D> & UseComboboxReturnValue<T>;

/**
 * Provides state and callbacks for combobox with multiple selection. When value prop changes, inputValue is set to
 * empty string, thus allowing for selection of new item.
 *
 * Internally it uses {@link useComboboxBase}, {@link useInputValueState}, {@link useInputValueHandler} and
 * {@link useMultipleSelect}.
 *
 * Doesn't control value, instead it is expected that value and onChange function will be provided as a prop to this
 * hook. Callbacks that "change" value, actually call {@link MultiValueControl.onChange} function with new value.
 *
 * @template T - type of item
 * @template S - type of select element, defaults to {@link HTMLDivElement}
 * @template D - type of dropdown element, defaults to {@link HTMLUListElement}
 */
export function useMultipleCombobox<
  T,
  S extends HTMLElement = HTMLDivElement,
  D extends HTMLElement = HTMLUListElement
>({
  onOpen,
  onClose,
  items,
  itemToString,
  value,
  filter = defaultFilter,
  ...props
}: UseMultipleComboboxProps<T>): UseMultipleCombobox<T, S, D> {
  const { inputRef, handleOpen, handleClose } = useComboboxBase({ onOpen, onClose });

  const { inputValue, ...rest } = useInputValueState("");
  const filteredItems = filter(items, inputValue, itemToString);
  const multipleSelect = useMultipleSelect<T, S, D>({
    ...props,
    items: filteredItems,
    value,
    onClose: handleClose,
    onOpen: handleOpen,
  });
  const setInputValue = useInputValueHandler({ ...rest, ...multipleSelect });

  useEffect(() => {
    if (value) {
      setInputValue("");
    }
  }, [value, setInputValue]);

  return {
    ...multipleSelect,
    items: filteredItems,
    inputRef,
    inputValue,
    setInputValue,
  };
}
