import { renderHook } from "@testing-library/react-hooks";
import { useAsyncItems } from "../src/use-async-items";

const comboboxItems = ["item1", "item2"];

const fetchItems = async () => {
  const promise = new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
  const [result] = await Promise.all([Promise.resolve(comboboxItems), promise]);
  return result;
};

describe("useAsyncItems tests", () => {
  test("fetchItems is called on inputValue change", async () => {
    const fetchItems = jest.fn();
    let inputValue = "";
    const { rerender } = renderHook(() => useAsyncItems({ fetchItems, setItems: jest.fn(), inputValue }));

    inputValue = "value";
    rerender();

    expect(fetchItems).toHaveBeenCalledWith("value");
  });

  test("loading flag is true while request is in progress and false when it finishes", async () => {
    const setItems = jest.fn();
    let inputValue = "";
    const { waitForNextUpdate, rerender, result } = renderHook(() =>
      useAsyncItems({ fetchItems, setItems, inputValue })
    );

    inputValue = "value";
    rerender();
    expect(result.current).toBeTruthy();
    await waitForNextUpdate();
    expect(result.current).toBeFalsy();
  });

  test("setItems is called with returned items from fetchItems", async () => {
    const setItems = jest.fn();
    let inputValue = "";
    const { waitForNextUpdate, rerender } = renderHook(() => useAsyncItems({ fetchItems, setItems, inputValue }));

    inputValue = "value";
    rerender();
    await waitForNextUpdate();
    expect(setItems).toHaveBeenCalledWith(comboboxItems);
  });
});
