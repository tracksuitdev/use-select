import { act, renderHook } from "@testing-library/react-hooks";
import { useMultipleCombobox } from "../src";

describe("useMultipleCombobox tests", () => {
  test("reset inputValue on value change", () => {
    let value = ["item"];
    const { result, rerender } = renderHook(() =>
      useMultipleCombobox({ items: ["item"], itemToString: item => item ?? "", value })
    );

    act(() => {
      result.current.setInputValue("item");
    });

    value = ["new value"];
    rerender();

    expect(result.current.inputValue).toEqual("");
  });
});
