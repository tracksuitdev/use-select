# use-select
React hooks for building select and combobox components.

* [useSelect](#useselect)
* [useMultipleSelect](#usemultipleselect)
* [useCombobox](#usecombobox)
* [useMultipleCombobox](#usemultiplecombobox)
* [useAsyncCombobox](#useasynccombobox)
* [useMultipleAsyncCombobox](#usemultipleasynccombobox)

## useSelect

▸ **useSelect**<T, S, D\>(`props`: [`UseSelectProps<T>`](#props)): [UseSelect](#return-value)<T, S, D\>

Provides state and callbacks for building select component.

Only required prop are items that can be selected. To control value, provide [value and onChange](#valuecontrolt) props.

### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` - Type of items |
| `S` | `S`: `HTMLElement` = `HTMLDivElement` - Type of select element |
| `D` | `D`: `HTMLElement` = `HTMLUListElement`- Type of dropdown element |


### Props
**UseSelectProps**<T\> = [`Items<T>`](#itemst) & [`ValueControl<T>`](#valuecontrolt) & [`Handlers`](#handlers) & [`Flags`](#flags)

### Return value
**UseSelect**<T, S, D\>

| Name | Type | Description |
| :------ | :------ | :------ |
| `clear` | (`e`: `ReactMouseEvent`) => `void` | Calls onChange with undefined or empty array value in case of multiple selection. Prevents event propagation |
| `dropdownRef` | `RefObject`<D\> | Ref for dropdown element, used internally to allow closing of dropdown on outside click and scrolling to highlighted index item when using arrow keys to highlighted items. |
| `handleClick` | (`e`: `ReactMouseEvent`) => `void` | Toggles isOpen flag, prevents event propagation |
| `handleItemClick` | (`item`: `T`) => `void` | Calls select if item isn't selected or remove if item is selected |
| `handleKeyDown` | `KeyboardEventHandler`<never\> | Handles ArrowUp, ArrowDown, Enter and Escape key down event, apply to select and dropdown element (add tabIndex=0 to allow key events on div element) |
| `highlightedIndex` | `number` | Index of currently highlighted item, used for keyboard control, ArrowUp key decreases this, while ArrowDown key increases it |
| `isOpen` | `boolean` | Indicates whether dropdown is open or not |
| `isSelected` | (`item`: `T`) => `boolean` | Returns true if item equals value, or in case of multiple selection, if item is part of value array |
| `open` | () => `void` | Sets isOpen to true |
| `remove` | () => `void` | Calls onChange with value set to undefined |
| `select` | (`item`: `T`) => `void` | Calls onChange with provided item set as value |
| `selectRef` | `RefObject`<S\> | Ref for combobox element, used internally to allow closing of dropdown on outside click |
| `setHighlightedIndex` | (`index`: `number`) => `void` | Sets highlightedIndex to provided index |

### Usage
This example uses basic styling and markup, you can style your components however you want. 
Note that you need to assign selectRef and dropdownRef, this is needed so that isOpen is set to false (dropdown is closed) if you click outside select or dropdown element.
If you want your dropdown to scroll to highlighted item when user presses arrow keys make your items direct children of dropdown element.
```typescript jsx
const Select = () => {
  const [value, setValue] = useState<string>();
  const {
    selectRef,
    open,
    handleKeyDown,
    isOpen,
    handleClick,
    dropdownRef,
    handleItemClick,
    isSelected,
    highlightedIndex,
  } = useSelect({
    items: ["item1", "item2", "item3"],
    onChange: value => setValue(value),
    value,
  });

  return (
    <div>
      <div ref={selectRef} tabIndex={0} onFocus={open} onKeyDown={handleKeyDown}> {/* select */}
        {value}
        <button onFocus={e => e.stopPropagation()} onClick={handleClick}>
          {isOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
        </button>
      </div>
      {isOpen && ( // dropdown
        <ul
          ref={dropdownRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{ width: "400px", backgroundColor: "grey" }}>
          {items.map((item, index) => ( // item
            <li
              key={item}
              onClick={() => handleItemClick(item)}
              style={{
                color: isSelected(item) ? "blue" : "black",
                backgroundColor: highlightedIndex === index ? "green" : "grey",
                cursor: "pointer",
              }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
````

## useMultipleSelect

**UseMultipleSelect**<T, S, D\>: `Omit`<UseSelect<T, S, D\>, ``"remove"``\> & { `remove`: (`item`: `T`) => `void` ; `removeByIndex`: (`index`: `number`) => `void`  }

### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` - Type of items |
| `S` | `S`: `HTMLElement` = `HTMLDivElement` - Type of select element |
| `D` | `D`: `HTMLElement` = `HTMLUListElement`- Type of dropdown element |

## Usage

Examples with basic styling and markup.

### select

### multiple select

```typescript jsx
const MultipleSelect = () => {
  const [value, setValue] = useState<string[]>();
  const {
    selectRef,
    dropdownRef,
    isOpen,
    open,
    handleKeyDown,
    handleClick,
    handleItemClick,
    isSelected,
    highlightedIndex,
  } = useMultipleSelect({
    items,
    onChange: value => setValue(value),
    value,
  });

  return (
    <div>
      <div ref={selectRef} tabIndex={0} onFocus={open} onKeyDown={handleKeyDown}>
        {value?.join(", ")}
        <button onFocus={e => e.stopPropagation()} onClick={handleClick}>
          {isOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
        </button>
      </div>
      {isOpen && (
        <ul
          ref={dropdownRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{ width: "400px", backgroundColor: "grey" }}>
          {items.map((item, index) => (
            <li
              key={item}
              onClick={() => handleItemClick(item)}
              style={{
                color: isSelected(item) ? "blue" : "black",
                backgroundColor: highlightedIndex === index ? "green" : "grey",
                cursor: "pointer",
              }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```
### combobox
```typescript jsx
const Combobox = () => {
  const [value, setValue] = useState<string>();
  const {
    selectRef,
    dropdownRef,
    inputRef,
    inputValue,
    open,
    setInputValue,
    handleKeyDown,
    handleClick,
    handleItemClick,
    isSelected,
    highlightedIndex,
    isOpen,
    items,
  } = useCombobox({
    items: comboboxItems,
    value,
    onChange: value => setValue(value),
    itemToString: item => item ?? "",
  });

  return (
    <div>
      <div ref={selectRef} tabIndex={0} onFocus={open} onKeyDown={handleKeyDown}>
        <input value={inputValue} onChange={({ target: { value } }) => setInputValue(value)} ref={inputRef} />
        <button onFocus={e => e.stopPropagation()} onClick={handleClick}>
          {isOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
        </button>
      </div>
      {isOpen && (
        <ul
          ref={dropdownRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{ width: "400px", backgroundColor: "grey" }}>
          {items.map((item, index) => (
            <li
              key={item}
              onClick={() => handleItemClick(item)}
              style={{
                color: isSelected(item) ? "blue" : "black",
                backgroundColor: highlightedIndex === index ? "green" : "grey",
                cursor: "pointer",
              }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```
### combobox with multiple selection
```typescript jsx
const MultipleCombobox = () => {
  const [value, setValue] = useState<string[]>();
  const {
    selectRef,
    dropdownRef,
    inputRef,
    open,
    isOpen,
    highlightedIndex,
    inputValue,
    setInputValue,
    items,
    isSelected,
    handleItemClick,
    handleClick,
    handleKeyDown,
  } = useMultipleCombobox({
    items: comboboxItems,
    itemToString: item => item ?? "",
    value,
    onChange: setValue,
  });

  return (
    <div>
      <div ref={selectRef} tabIndex={0} onFocus={open} onKeyDown={handleKeyDown}>
        {value?.join(", ")}
        <input value={inputValue} onChange={({ target: { value } }) => setInputValue(value)} ref={inputRef} />
        <button onFocus={e => e.stopPropagation()} onClick={handleClick}>
          {isOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
        </button>
      </div>
      {isOpen && (
        <ul
          ref={dropdownRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{ width: "400px", backgroundColor: "grey" }}>
          {items.map((item, index) => (
            <li
              key={item}
              onClick={() => handleItemClick(item)}
              style={{
                color: isSelected(item) ? "blue" : "black",
                backgroundColor: highlightedIndex === index ? "green" : "grey",
                cursor: "pointer",
              }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```
### async combobox
```typescript jsx
const AsyncCombobox = () => {
  const [value, setValue] = useState<string>();
  const {
    selectRef,
    dropdownRef,
    inputRef,
    inputValue,
    open,
    setInputValue,
    handleKeyDown,
    handleClick,
    handleItemClick,
    isSelected,
    highlightedIndex,
    isOpen,
    items,
    loading,
  } = useAsyncCombobox({
    fetchItems: async _ => {
      const promise = new Promise<void>(resolve => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
      const [result] = await Promise.all([Promise.resolve(comboboxItems), promise]);

      return result;
    },
    value,
    onChange: value => setValue(value),
    itemToString: item => item ?? "",
  });

  return (
    <div>
      <div ref={selectRef} tabIndex={0} onFocus={open} onKeyDown={handleKeyDown}>
        <input value={inputValue} onChange={({ target: { value } }) => setInputValue(value)} ref={inputRef} />
        <button onFocus={e => e.stopPropagation()} onClick={handleClick}>
          {isOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
        </button>
      </div>
      {isOpen && (
        <ul
          ref={dropdownRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{ width: "400px", backgroundColor: "grey" }}>
          {loading
            ? "Loading..."
            : items.map((item, index) => (
                <li
                  key={item}
                  onClick={() => handleItemClick(item)}
                  style={{
                    color: isSelected(item) ? "blue" : "black",
                    backgroundColor: highlightedIndex === index ? "green" : "grey",
                    cursor: "pointer",
                  }}>
                  {item}
                </li>
              ))}
        </ul>
      )}
    </div>
  );
};
```
### async combobox with multiple selection
```typescript jsx
const MultipleAsyncCombobox = () => {
  const [value, setValue] = useState<string[]>();
  const {
    selectRef,
    dropdownRef,
    inputRef,
    inputValue,
    open,
    setInputValue,
    handleKeyDown,
    handleClick,
    handleItemClick,
    isSelected,
    highlightedIndex,
    isOpen,
    items,
    loading,
  } = useMultipleAsyncCombobox({
    fetchItems: async _ => {
      const promise = new Promise<void>(resolve => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
      const [result] = await Promise.all([Promise.resolve(comboboxItems), promise]);

      return result;
    },
    value,
    onChange: value => setValue(value),
    itemToString: item => item ?? "",
  });

  return (
    <div>
      <div ref={selectRef} tabIndex={0} onFocus={open} onKeyDown={handleKeyDown}>
        {value?.join(", ")}
        <input value={inputValue} onChange={({ target: { value } }) => setInputValue(value)} ref={inputRef} />
        <button onFocus={e => e.stopPropagation()} onClick={handleClick}>
          {isOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
        </button>
      </div>
      {isOpen && (
        <ul
          ref={dropdownRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{ width: "400px", backgroundColor: "grey" }}>
          {loading
            ? "Loading..."
            : items.map((item, index) => (
                <li
                  key={item}
                  onClick={() => handleItemClick(item)}
                  style={{
                    color: isSelected(item) ? "blue" : "black",
                    backgroundColor: highlightedIndex === index ? "green" : "grey",
                    cursor: "pointer",
                  }}>
                  {item}
                </li>
              ))}
        </ul>
      )}
    </div>
  );
};
```
## Common Types

### FetchItems<T\>

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | Type of items |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `fetchItems` | (`query`: `string`) => `Promise`<T[]\> | Fetch items asynchronously |

___

### Flags

| Name | Type | Description |
| :------ | :------ | :------ |
| `clearable?` | `boolean` | If true value can be set to undefined for {@link ValueControl.value}, and for {@link MultiValueControl.value} can be set to an empty array. Note that for {@link MultiValueControl.value} case it is still possible to set value to an empty array by calling remove or removeByIndex on every selected item. |
| `disabled?` | `boolean` | If true open function does nothing, same as readOnly, provided as separate prop for convenience |
| `readOnly?` | `boolean` | If true open function does nothing, same as disabled, provided as separate prop for convenience |

___

### Handlers

| Name | Type | Description |
| :------ | :------ | :------ | 
| `onClose?` | () => `void` | This function is called when isOpen is set to `false` |
| `onOpen?` | () => `void` | This function is called when isOpen is set to `true` |

___

### Items<T\>

#### Type parameters

| Name | Description |
| :------ | :------ | 
| `T` | Type of items |

| Name | Type | Description |
| :------ | :------ | :------ | 
| `items` | `T`[] | Options that can be selected |

___

### MultiValueControl<T\>

onChange handler and value type for hooks where multiple selection is allowed

#### Type parameters

| Name | Description |
| :------ | :------ | 
| `T` | Type of items |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `onChange?` | (`value?`: `T`[]) => `void` |
| `value?` | `T`[] |

___

### ValueControl<T\>

onChange handler and value type for hooks where only single selection is allowed

#### Type parameters

| Name | Description |
| :------ | :------ | 
| `T` | Type of items |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `onChange?` | (`value?`: `T`) => `void` |
| `value?` | `T` |

