import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useState } from "react";
import { useAsyncCombobox, useSelect } from "../src";
import { useMultipleSelect } from "../src";
import { useCombobox } from "../src";
import { useMultipleCombobox } from "../src";
import { useMultipleAsyncCombobox } from "../src";

function range(n: number) {
  return Array.from(Array(n).keys());
}

const items = range(10).map(x => `value ${x}`);

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
    items,
    onChange: value => setValue(value),
    value,
  });

  return (
    <div>
      <div ref={selectRef} tabIndex={0} onFocus={open} onKeyDown={handleKeyDown}>
        {value}
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

const comboboxItems = ["black", "white", "red", "green", "blue", "grey"];

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

const App = () => {
  return (
    <div>
      <p>Select</p>
      <Select />
      <p>Multiple select</p>
      <MultipleSelect />
      <p>Combobox</p>
      <Combobox />
      <p>Multiple combobox</p>
      <MultipleCombobox />
      <p>Combobox with asynchronous filtering</p>
      <AsyncCombobox />
      <p>Combobox with asynchronous filtering and multiple value selection</p>
      <MultipleAsyncCombobox />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
