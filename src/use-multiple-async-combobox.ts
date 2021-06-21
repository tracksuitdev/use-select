import { ItemToString } from "./combobox-core";
import { FetchItems, Flags, Handlers, MultiValueControl } from "./core";
import { useState } from "react";
import { UseMultipleCombobox, useMultipleCombobox } from "./use-multiple-combobox";
import { useAsyncItems } from "./use-async-items";
import { Loading } from "./use-async-combobox";

export type UseMultipleAsyncComboboxProps<T> = { itemToString: ItemToString<T> } & MultiValueControl<T> &
  FetchItems<T> &
  Handlers &
  Flags;

export type UseMultipleAsyncCombobox<
  T,
  S extends HTMLElement = HTMLDivElement,
  D extends HTMLElement = HTMLUListElement
> = UseMultipleCombobox<T, S, D> & Loading;

/**
 * Similar to {@link useMultipleCombobox} only this hook fetches new items on inputValue change.
 *
 * Uses {@link useMultipleCombobox} and {@link useAsyncItems} internally.
 *
 * Doesn't control value, instead it is expected that value and onChange function will be provided as a prop to this
 * hook. Callbacks that "change" value, actually call {@link MultiValueControl.onChange} function with new value.
 *
 * @template T - type of item
 * @template S - type of select element, defaults to {@link HTMLDivElement}
 * @template D - type of dropdown element, defaults to {@link HTMLUListElement}
 */
export function useMultipleAsyncCombobox<
  T,
  S extends HTMLElement = HTMLDivElement,
  D extends HTMLElement = HTMLUListElement
>({ fetchItems, ...props }: UseMultipleAsyncComboboxProps<T>): UseMultipleAsyncCombobox<T, S, D> {
  const [items, setItems] = useState<T[]>([]);
  const { inputValue, ...combobox } = useMultipleCombobox<T, S, D>({ ...props, items, filter: items => items });
  const loading = useAsyncItems<T>({ fetchItems, inputValue, setItems });

  return { loading, inputValue, ...combobox };
}
