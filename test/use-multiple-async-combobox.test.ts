import { renderHook } from "@testing-library/react-hooks";
import { useMultipleAsyncCombobox } from "../src/use-multiple-async-combobox";

describe("useMultipleAsyncCombobox tests", () => {
  test("returns empty array of items on mount", () => {
    const { result } = renderHook(() =>
      useMultipleAsyncCombobox<string>({ fetchItems: jest.fn(), itemToString: item => item ?? "" })
    );

    expect(result.current.items).toEqual([]);
  });
});
