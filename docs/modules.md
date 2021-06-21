[use-select](README.md) / Exports

# use-select

## Table of contents

### Type aliases

- [UseMultipleSelect](modules.md#usemultipleselect)
- [UseMultipleSelectProps](modules.md#usemultipleselectprops)

### Functions

- [useMultipleSelect](modules.md#usemultipleselect)

## Type aliases

### UseMultipleSelect

Ƭ **UseMultipleSelect**<T, S, D\>: `Omit`<UseSelect<T, S, D\>, ``"remove"``\> & { `remove`: (`item`: `T`) => `void` ; `removeByIndex`: (`index`: `number`) => `void`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `S` | `S`: `HTMLElement` = `HTMLDivElement` |
| `D` | `D`: `HTMLElement` = `HTMLUListElement` |

#### Defined in

[use-multiple-select.ts:7](https://github.com/tracksuitdev/use-select/blob/b17eb60/src/use-multiple-select.ts#L7)

___

### UseMultipleSelectProps

Ƭ **UseMultipleSelectProps**<T\>: `Items`<T\> & `MultiValueControl`<T\> & `Handlers` & `Flags`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[use-multiple-select.ts:5](https://github.com/tracksuitdev/use-select/blob/b17eb60/src/use-multiple-select.ts#L5)

## Functions

### useMultipleSelect

▸ **useMultipleSelect**<T, S, D\>(`__namedParameters`): [UseMultipleSelect](modules.md#usemultipleselect)<T, S, D\>

Allows selection of multiple items. Useful for building multiple select component.

Internally it uses {@link useSelectBase} and {@link useHandlers} hooks.

Doesn't control value, instead it is expected that value and onChange function will be provided as a prop to this
hook. Callbacks that "change" value, actually call {@link MultiValueControl.onChange} function with new value.

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | `T` | type of item |
| `S` | `S`: `HTMLElement` = `HTMLDivElement` | type of select element, defaults to {@link HTMLDivElement} |
| `D` | `D`: `HTMLElement` = `HTMLUListElement` | type of dropdown element, defaults to {@link HTMLUListElement} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [UseMultipleSelectProps](modules.md#usemultipleselectprops)<T\> |

#### Returns

[UseMultipleSelect](modules.md#usemultipleselect)<T, S, D\>

#### Defined in

[use-multiple-select.ts:34](https://github.com/tracksuitdev/use-select/blob/b17eb60/src/use-multiple-select.ts#L34)
