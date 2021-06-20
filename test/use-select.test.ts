import { act, renderHook } from "@testing-library/react-hooks";
import { useSelect } from "../src/use-select";
import { MouseEvent } from "react";

const getEvent = () => ({ stopPropagation: () => null, preventDefault: () => null } as unknown);
describe("useSelect tests", () => {
  test("select", () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useSelect({ items: ["item1", "item2", "item3"], onChange }));

    act(() => {
      result.current.select("item1");
    });

    expect(onChange).toHaveBeenCalledWith("item1");
  });

  const removeTest = (fn: "remove" | "clear" = "remove", clearable?: boolean) => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useSelect({ items: ["item"], onChange, clearable }));

    act(() => {
      result.current[fn](getEvent() as MouseEvent);
    });

    if (clearable) {
      expect(onChange).toHaveBeenCalledWith(undefined);
    } else {
      expect(onChange).toHaveBeenCalledTimes(0);
    }
  };

  test("remove", () => {
    removeTest("remove", true);
  });

  test("remove should do nothing if clearable isn't true", () => {
    removeTest();
  });

  test("clear", () => {
    removeTest("clear", true);
  });

  test("isSelected returns true if value equals item", () => {
    const { result } = renderHook(() => useSelect({ items: ["item"], value: "item" }));

    act(() => {
      expect(result.current.isSelected("item")).toBeTruthy();
    });
  });

  test("isSelected returns false if value doesn't equal item", () => {
    const { result } = renderHook(() => useSelect({ items: ["item"], value: "something else" }));

    act(() => {
      expect(result.current.isSelected("item")).toBeFalsy();
    });
  });
});
