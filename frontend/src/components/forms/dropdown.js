import React from "react";
import Select from "react-select";

const options = [
  { value: "North America", label: "North America" },
  { value: "South America", label: "South America" },
  { value: "Europe", label: "Europe" },
  { value: "Asia", label: "Asia" },
  { value: "Africa", label: "Africa" },
];

export default function Dropdown() {
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
      backgroundColor: state.isSelected ? "#fff" : null, // Cambiar el color de fondo de las opciones a blanco cuando está seleccionada
      color: state.isSelected ? "#333" : "#fff", // Cambiar el color del texto a blanco cuando está seleccionada
      "&:hover": {
        backgroundColor: state.isSelected ? "#fff" : "#222", // Cambiar el color de fondo al pasar el cursor sobre las opciones
        color: state.isSelected ? "#333" : "#fff", // Cambiar el color del texto al pasar el cursor sobre las opciones
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.isDisabled ? "#ccc" : "#fff", // Color del texto cuando está seleccionado
    }),
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: "#333",
      zIndex: 9999,
    }),
  };

  return (
    <div>
      <h4 className="mb-3">Select a region:</h4>
      <Select styles={customStyles} options={options} />
    </div>
  );
}
