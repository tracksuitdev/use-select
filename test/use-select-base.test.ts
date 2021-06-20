import { act, renderHook } from "@testing-library/react-hooks";
import { useSelectBase } from "../src/core";
import { MouseEvent, KeyboardEvent } from "react";

const getEvent = () => ({ stopPropagation: () => null, preventDefault: () => null } as unknown);
const getKeyEvent = (key: string) => ({ ...(getEvent() as {}), key } as unknown);

describe("useSelectBase tests", () => {
  test("open and close", () => {
    const onClose = jest.fn();
    const onOpen = jest.fn();
    const { result } = renderHook(() => useSelectBase({ itemCount: 1, onClose, onOpen }));

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBeTruthy();
    expect(onOpen).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBeFalsy();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("open should not work if readOnly is true", () => {
    const { result } = renderHook(() => useSelectBase({ itemCount: 1, readOnly: true }));

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBeFalsy();
  });

  test("open should not work if disabled is true", () => {
    const { result } = renderHook(() => useSelectBase({ itemCount: 1, disabled: true }));

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBeFalsy();
  });

  test("handleClick", () => {
    const e = getEvent() as MouseEvent;
    const { result } = renderHook(() => useSelectBase({ itemCount: 1 }));

    act(() => {
      result.current.handleClick(e);
    });

    expect(result.current.isOpen).toBeTruthy();

    act(() => {
      result.current.handleClick(e);
    });

    expect(result.current.isOpen).toBeFalsy();
  });

  const arrowKeysTest = (key: "ArrowUp" | "ArrowDown") => {
    const e = getKeyEvent(key) as KeyboardEvent<HTMLElement>;
    const { result } = renderHook(() => useSelectBase({ itemCount: 2 }));

    act(() => {
      result.current.handleKeyDownBase(e);
    });

    expect(result.current.highlightedIndex).toEqual(0);

    act(() => {
      result.current.handleKeyDownBase(e);
    });

    expect(result.current.highlightedIndex).toEqual(1);

    act(() => {
      result.current.handleKeyDownBase(e);
    });

    expect(result.current.highlightedIndex).toEqual(0);
  };

  test("on ArrowDown key increase highlightedIndex circular", () => {
    arrowKeysTest("ArrowDown");
  });

  test("on ArrowUp key decrease highlightedIndex", () => {
    arrowKeysTest("ArrowUp");
  });
});
