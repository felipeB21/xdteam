import React, { useEffect, useState } from "react";
import Select from "react-select";

const options = [
  { value: "North America", label: "North America" },
  { value: "South America", label: "South America" },
  { value: "Europe", label: "Europe" },
  { value: "Asia", label: "Asia" },
  { value: "Africa", label: "Africa" },
];

export default function Dropdown({ setRegion, dropdownId }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#333",
      border: state.isFocused ? "2px solid #221" : "2px solid #220",
      borderRadius: "0px",
      padding: "8px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#fff" : null,
      color: state.isSelected ? "#333" : "#fff",
      "&:hover": {
        backgroundColor: state.isSelected ? "#fff" : "#222",
        color: state.isSelected ? "#333" : "#fff",
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.isDisabled ? "#ccc" : "#fff",
    }),
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: "#333",
      zIndex: 9999,
    }),
  };

  const handleChange = (selectedOption) => {
    setRegion(selectedOption.value);
  };

  if (!isClient) {
    return null; // No renderizar en el servidor
  }

  return (
    <div>
      <h4 className="mb-3">Select a region:</h4>
      <Select
        inputId={dropdownId}
        styles={customStyles}
        options={options}
        onChange={handleChange}
      />
    </div>
  );
}
