import { act, renderHook } from "@testing-library/react-hooks";
import { useAsyncCombobox } from "../src";

describe("useAsyncCombobox tests", () => {
  test("on mount fetchItems is not called", () => {
    const fetchItems = jest.fn();
    renderHook(() => useAsyncCombobox<string>({ fetchItems, itemToString: item => item ?? "" }));

    expect(fetchItems).toHaveBeenCalledTimes(0);
  });

  test("fetchItems is called on input value change", () => {
    const fetchItems = jest.fn();
    const { result } = renderHook(() => useAsyncCombobox<string>({ fetchItems, itemToString: item => item ?? "" }));

    act(() => {
      result.current.setInputValue("value");
    });

    expect(fetchItems).toHaveBeenCalledWith("value");
  });

  test("fetchItems updates items", async () => {
    const fetchItems = async () => {
      return ["item1", "item2"];
    };
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncCombobox<string>({ fetchItems, itemToString: item => item ?? "" })
    );

    act(() => {
      result.current.setInputValue("value");
    });

    await waitForNextUpdate();

    expect(result.current.items).toEqual(["item1", "item2"]);
  });
});
