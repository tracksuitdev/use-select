[use-select](README.md) / Exports

# use-select

## Table of contents

### Type aliases

- [UseSelect](modules.md#useselect)
- [UseSelectProps](modules.md#useselectprops)

### Functions

- [useSelect](modules.md#useselect)

## Type aliases

### UseSelect

Ƭ **UseSelect**<T, S, D\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `S` | `S`: `HTMLElement` = `HTMLDivElement` |
| `D` | `D`: `HTMLElement` = `HTMLUListElement` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `clear` | (`e`: `ReactMouseEvent`) => `void` | - |
| `dropdownRef` | `RefObject`<D\> | Ref for dropdown element, used internally to allow closing of dropdown on outside click and scrolling to highlighted index item when using arrow keys to highlighted items. |
| `handleClick` | (`e`: `ReactMouseEvent`) => `void` | - |
| `handleItemClick` | (`item`: `T`) => `void` | - |
| `handleKeyDown` | `KeyboardEventHandler`<never\> | Handles ArrowUp, ArrowDown, Enter and Escape key down event, apply to select and dropdown element (add tabIndex=0 to allow key events on div element) |
| `highlightedIndex` | `number` | Index of currently highlighted item, used for keyboard control, ArrowUp key decreases this, while ArrowDown key increases it |
| `isOpen` | `boolean` | Indicates whether dropdown is open or not |
| `isSelected` | (`item`: `T`) => `boolean` | - |
| `open` | () => `void` | - |
| `remove` | () => `void` | - |
| `select` | (`item`: `T`) => `void` | - |
| `selectRef` | `RefObject`<S\> | Ref for combobox element, used internally to allow closing of dropdown on outside click |
| `setHighlightedIndex` | (`index`: `number`) => `void` | - |

#### Defined in

use-select.ts:6

___

### UseSelectProps

Ƭ **UseSelectProps**<T\>: `Items`<T\> & `ValueControl`<T\> & `Handlers` & `Flags`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

use-select.ts:4

## Functions

### useSelect

▸ **useSelect**<T, S, D\>(`__namedParameters`): [UseSelect](modules.md#useselect)<T, S, D\>

Provides callbacks and state for controlling select component.

Internally it uses {@link useSelectBase} and {@link useHandlers} hooks.

Doesn't control value, instead it is expected that value and onChange function will be provided as a prop to this
hook. Callbacks that "change" value, actually call {@link ValueControl.onChange} function with new value.

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | `T` | type of item |
| `S` | `S`: `HTMLElement` = `HTMLDivElement` | type of select element, defaults to {@link HTMLDivElement} |
| `D` | `D`: `HTMLElement` = `HTMLUListElement` | type of dropdown element, defaults to {@link HTMLUListElement} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [UseSelectProps](modules.md#useselectprops)<T\> |

#### Returns

[UseSelect](modules.md#useselect)<T, S, D\>

#### Defined in

use-select.ts:79
