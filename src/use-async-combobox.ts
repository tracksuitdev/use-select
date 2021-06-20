import { ItemToString } from "./combobox-core";
import { FetchItems, Flags, Handlers, ValueControl } from "./core";
import { useState } from "react";
import { UseCombobox, useCombobox } from "./use-combobox";
import { useAsyncItems } from "./use-async-items";

export type UseAsyncComboboxProps<T> = { itemToString: ItemToString<T> } & ValueControl<T> &
  FetchItems<T> &
  Handlers &
  Flags;

export type Loading = {
  /**
   * True if {@link FetchItems.fetchItems} has been called but promise hasn't resolved yet.
   */
  loading: boolean;
};

export type UseAsyncCombobox<
  T,
  S extends HTMLElement = HTMLDivElement,
  D extends HTMLElement = HTMLUListElement
> = UseCombobox<T, S, D> & Loading;

/**
 * Returns state and callbacks for building combobox component that fetches items asynchronously.
 *
 * Internally it uses {@link useCombobox} and {@link useAsyncItems} hooks, but instead of filtering items this hook
 * calls {@link FetchItems.fetchItems} when inputValue changes.
 *
 * {@link UseAsyncCombobox.items} returned from this hook are latest result of {@link FetchItems.fetchItems} call.
 *
 * Doesn't control value, instead it is expected that value and onChange function will be provided as a prop to this
 * hook. Callbacks that "change" value, actually call {@link ValueControl.onChange} function with new value.
 *
 * @template T - type of item
 * @template S - type of select element, defaults to {@link HTMLDivElement}
 * @template D - type of dropdown element, defaults to {@link HTMLUListElement}
 */
export function useAsyncCombobox<T, S extends HTMLElement = HTMLDivElement, D extends HTMLElement = HTMLUListElement>({
  fetchItems,
  ...props
}: UseAsyncComboboxProps<T>): UseAsyncCombobox<T, S, D> {
  const [items, setItems] = useState<T[]>([]);
  const { inputValue, ...combobox } = useCombobox<T, S, D>({ ...props, items, filter: items => items });
  const loading = useAsyncItems<T>({ fetchItems, inputValue, setItems });

  return { loading, inputValue, ...combobox };
}
