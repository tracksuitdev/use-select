import { KeyboardEventHandler, MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef, useState } from "react";

export type Items<T> = { items: T[] };
export type FetchItems<T> = {
  /**
   * Fetch items asynchronously (from remote server)
   * @param query - value of input used in combobox
   */
  fetchItems: (query: string) => Promise<T[]>;
};
export type ValueControl<T> = { value?: T; onChange?: (value?: T) => void };
export type MultiValueControl<T> = { value?: T[]; onChange?: (value?: T[]) => void };
export type Handlers = {
  /**
   * Executes when open function is called, (opening of dropdown for select options)
   */
  onOpen?: () => void;
  /**
   * Executes when close function is called, (closing of dropdown for select options)
   */
  onClose?: () => void;
};
export type Flags = {
  /**
   * If true open function does nothing, same as disabled, provided as separate prop for convenience
   */
  readOnly?: boolean;
  /**
   * If true open function does nothing, same as readOnly, provided as separate prop for convenience
   */
  disabled?: boolean;
  /**
   * If true value can be set to undefined for {@link ValueControl.value}, and for {@link MultiValueControl.value} can
   * be set to an empty array. Note that for {@link MultiValueControl.value} case it is still possible to set value to
   * an empty array by calling remove or removeByIndex on every selected item.
   */
  clearable?: boolean;
};

export type UseSelectHandlersProps<T> = {
  /**
   * Index of currently highlighted item, used for keyboard control
   */
  highlightedIndex: number;
  items: T[];
  select: (item: T) => void;
  remove: (item?: T) => void;
  isSelected: (item: T) => boolean;
  /**
   * KeyboardEventHandler for ArrowUp, ArrowDown and escape
   */
  handleKeyDownBase: KeyboardEventHandler;
};

type UseSelectBaseProps = { itemCount: number } & Handlers & Omit<Flags, "clearable">;

/**
 * Hook that creates basic callbacks used by other hooks in this lib, creates selectRef and dropdownRef and holds
 * dropdown (isOpen) and highlighted index states
 */
export function useSelectBase<S extends HTMLElement = HTMLDivElement, D extends HTMLElement = HTMLUListElement>({
  itemCount,
  onOpen,
  onClose,
  readOnly,
  disabled,
}: UseSelectBaseProps) {
  const selectRef = useRef<S>(null);
  const dropdownRef = useRef<D>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const open = useCallback(() => {
    if (!readOnly && !disabled) {
      setIsOpen(true);
      onOpen?.();
    }
  }, [onOpen, readOnly, disabled]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (!selectRef?.current?.contains(e.target as Node) && !dropdownRef?.current?.contains(e.target as Node)) {
        close();
      }
    }
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [selectRef, dropdownRef, close]);

  const handleClick = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen) {
        close();
      } else {
        open();
      }
    },
    [isOpen, close, open]
  );

  const setIndex = (index: number) => {
    setHighlightedIndex(index);
    if (dropdownRef?.current?.children.length ?? -1 > index) {
      dropdownRef?.current?.children[index].scrollIntoView({ block: "center" });
    }
  };

  const handleKeyDownBase: KeyboardEventHandler = useCallback(
    e => {
      switch (e.key) {
        case "ArrowDown":
          setIndex((highlightedIndex + 1) % itemCount);
          e.preventDefault();
          e.stopPropagation();
          break;
        case "ArrowUp":
          setIndex((itemCount + (highlightedIndex - 1)) % itemCount);
          e.preventDefault();
          e.stopPropagation();
          break;
        case "Escape":
          close();
          e.preventDefault();
          e.stopPropagation();
          break;
        default:
          break;
      }
    },
    [itemCount, highlightedIndex, close]
  );

  return {
    isOpen,
    close,
    open,
    handleKeyDownBase,
    setHighlightedIndex,
    highlightedIndex,
    handleClick,
    selectRef,
    dropdownRef,
  };
}

/**
 * Basic handlers for other hooks
 */
export function useHandlers<T>({
  highlightedIndex,
  items,
  select,
  remove,
  isSelected,
  handleKeyDownBase,
}: UseSelectHandlersProps<T>) {
  const handleItemClick = useCallback(
    (item: T) => {
      if (isSelected(item)) {
        remove(item);
      } else {
        select(item);
      }
    },
    [isSelected, select, remove]
  );

  const handleEnter: KeyboardEventHandler = useCallback(
    e => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        if (highlightedIndex > -1) {
          handleItemClick(items[highlightedIndex]);
        }
      }
    },
    [handleItemClick, items, highlightedIndex]
  );

  const handleKeyDown: KeyboardEventHandler = useCallback(
    e => {
      handleKeyDownBase(e);
      handleEnter(e);
    },
    [handleKeyDownBase, handleEnter]
  );

  return { handleItemClick, handleKeyDown };
}
