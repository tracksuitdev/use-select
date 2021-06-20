import { renderHook } from "@testing-library/react-hooks";
import { useCombobox } from "../src";

describe("useCombobox tests", () => {
  test("useCombobox returns filtered items", () => {
    const { result } = renderHook(() =>
      useCombobox({
        items: ["item"],
        itemToString: item => item ?? "",
        filter: () => ["filtered"],
      })
    );

    expect(result.current.items).toEqual(["filtered"]);
  });

  test("useCombobox updates inputValue if value is changed", () => {
    let value = "item";
    const { result, rerender } = renderHook(() =>
      useCombobox({ items: ["item"], value, itemToString: item => item ?? "" })
    );

    value = "value";
    rerender();

    expect(result.current.inputValue).toEqual("value");
  });
});
