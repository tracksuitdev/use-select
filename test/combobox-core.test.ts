import { act, renderHook } from "@testing-library/react-hooks";
import { defaultFilter, useComboboxBase, useInputValueHandler, useInputValueState } from "../src/combobox-core";

describe("combobox core functions tests", () => {
  test("useInputValueState", () => {
    const { result } = renderHook(() => useInputValueState("value"));

    expect(result.current.inputValue).toEqual("value");
  });

  test("useInputValueHandler", () => {
    const setInputValue = jest.fn();
    const setHighlightedIndex = jest.fn();
    const { result } = renderHook(() => useInputValueHandler({ setInputValue, setHighlightedIndex }));

    act(() => {
      result.current("value");
    });

    expect(setInputValue).toHaveBeenCalledWith("value");
    expect(setHighlightedIndex).toHaveBeenCalledWith(-1);
  });

  test("useComboboxBase", () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const { result } = renderHook(() => useComboboxBase({ onOpen, onClose }));

    act(() => {
      result.current.handleOpen();
      result.current.handleClose();
    });

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("defaultFilter", () => {
    const result = defaultFilter(["item1", "item2", "item3", "option1", "option2"], "item", item => (item ? item : ""));

    expect(result).toEqual(["item1", "item2", "item3"]);
  });
});
