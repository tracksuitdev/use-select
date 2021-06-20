import { useMultipleSelect, UseMultipleSelectProps } from "../src/use-multiple-select";
import { act, renderHook } from "@testing-library/react-hooks";
import { MouseEvent } from "react";

const getEvent = () => ({ stopPropagation: () => null, preventDefault: () => null } as unknown);
describe("useMultipleSelect tests", () => {
  const testTarget = ({ items = ["item"], ...props }: Partial<UseMultipleSelectProps<string>> = { items: ["item"] }) =>
    renderHook(() => useMultipleSelect({ items, ...props }));

  test("select", () => {
    const onChange = jest.fn();
    const { result } = testTarget({ onChange });

    act(() => {
      result.current.select("item");
    });

    expect(onChange).toHaveBeenCalledWith(["item"]);
  });

  test("clear", () => {
    const onChange = jest.fn();
    const { result } = testTarget({ onChange, clearable: true });

    act(() => {
      result.current.clear(getEvent() as MouseEvent);
    });

    expect(onChange).toHaveBeenCalledWith([]);
  });

  test("clear does nothing if clearable is false", () => {
    const onChange = jest.fn();
    const { result } = testTarget({ onChange });

    act(() => {
      result.current.clear(getEvent() as MouseEvent);
    });

    expect(onChange).toHaveBeenCalledTimes(0);
  });

  test("isSelected returns true if item is in value array", () => {
    const { result } = testTarget({ value: ["item1", "item2"] });

    act(() => {
      expect(result.current.isSelected("item1")).toBeTruthy();
    });
  });

  test("isSelected returns false if item is not in value array", () => {
    const { result } = testTarget({ value: ["item1", "item2"] });

    act(() => {
      expect(result.current.isSelected("something else")).toBeFalsy();
    });
  });

  test("removeByIndex", () => {
    const onChange = jest.fn();
    const { result } = testTarget({ onChange, value: ["item1", "remove", "item2"] });

    act(() => {
      expect(result.current.removeByIndex(1));
    });

    expect(onChange).toHaveBeenCalledWith(["item1", "item2"]);
  });

  test("remove", () => {
    const onChange = jest.fn();
    const { result } = testTarget({ onChange, value: ["item1", "remove", "item2"] });

    act(() => {
      expect(result.current.remove("remove"));
    });

    expect(onChange).toHaveBeenCalledWith(["item1", "item2"]);
  });
});
