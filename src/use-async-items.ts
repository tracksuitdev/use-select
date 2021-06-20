import { FetchItems } from "./core";
import { useEffect, useRef, useState } from "react";
import { useRefCallback } from "./combobox-core";

export type UseAsyncItemsProps<T> = FetchItems<T> & {
  /**
   * Value of combobox input element
   */
  inputValue: string;
  /**
   * Updates items state
   */
  setItems: (items: T[]) => void;
};

/**
 * Fetches items when inputValue changes and calls setItems to update items state.
 *
 * @returns loading flag that indicates that request is in progress
 */
export function useAsyncItems<T>({ fetchItems, inputValue, setItems }: UseAsyncItemsProps<T>): boolean {
  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);

  const fetchItemsMemo = useRefCallback(fetchItems);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    let canceled = false;

    setLoading(true);
    fetchItemsMemo(inputValue).then(response => {
      if (!canceled) {
        setLoading(false);
        setItems(response);
      }
    });

    return () => {
      canceled = true;
    };
  }, [setItems, inputValue, fetchItemsMemo]);

  return loading;
}
