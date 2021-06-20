import { act, renderHook } from "@testing-library/react-hooks";
import { useHandlers } from "../src/core";
import { KeyboardEvent } from "react";

const getEvent = () => ({ stopPropagation: () => null, preventDefault: () => null } as unknown);
const getKeyEvent = (key: string) => ({ ...(getEvent() as {}), key } as unknown);

describe("useHandlers tests", () => {
  test("handleItemClick selects item if not selected", () => {
    const select = jest.fn();
    const { result } = renderHook(() =>
      useHandlers({
        highlightedIndex: 1,
        remove: jest.fn(),
        handleKeyDownBase: jest.fn(),
        isSelected: (_: string) => false,
        items: ["item1", "item2"],
        select,
      })
    );

    act(() => {
      result.current.handleItemClick("item1");
    });

    expect(select).toHaveBeenCalledWith("item1");
  });

  test("handleClick removes item if selected", () => {
    const remove = jest.fn();
    const { result } = renderHook(() =>
      useHandlers({
        highlightedIndex: 1,
        remove: remove,
        handleKeyDownBase: jest.fn(),
        isSelected: (_: string) => true,
        items: ["item1", "item2"],
        select: jest.fn(),
      })
    );

    act(() => {
      result.current.handleItemClick("item1");
    });

    expect(remove).toHaveBeenCalledWith("item1");
  });

  test("on Enter key select highlighted item if not selected", () => {
    const select = jest.fn();
    const { result } = renderHook(() =>
      useHandlers({
        highlightedIndex: 1,
        remove: jest.fn(),
        handleKeyDownBase: jest.fn(),
        isSelected: (_: string) => false,
        items: ["item1", "item2"],
        select,
      })
    );

    act(() => {
      result.current.handleKeyDown(getKeyEvent("Enter") as KeyboardEvent<HTMLElement>);
    });

    expect(select).toHaveBeenCalledWith("item2");
  });

  test("on Enter key select highlighted item if not selected", () => {
    const remove = jest.fn();
    const { result } = renderHook(() =>
      useHandlers({
        highlightedIndex: 1,
        remove,
        handleKeyDownBase: jest.fn(),
        isSelected: (_: string) => true,
        items: ["item1", "item2"],
        select: jest.fn(),
      })
    );

    act(() => {
      result.current.handleKeyDown(getKeyEvent("Enter") as KeyboardEvent<HTMLElement>);
    });

    expect(remove).toHaveBeenCalledWith("item2");
  });
});
