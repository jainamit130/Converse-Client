import React from "react";
import OptionsDropdown from "./OptionsDropdown";
import "./Options.css";

const Options = ({
  id,
  isOpen,
  optionsIcon,
  options,
  toggleDropdown,
  onSelect,
}) => {
  const handleClick = (event) => {
    toggleDropdown(event, id);
    event.stopPropagation();
  };

  return (
    <div>
      <img
        src={optionsIcon}
        className={`optionsIcon ${isOpen ? "visible" : ""}`}
        onClick={handleClick}
      />
      <div>
        {isOpen && (
          <OptionsDropdown
            options={options}
            onSelect={(event, option) => onSelect(option, id)}
            toggleDropdown={toggleDropdown}
            parameter={id}
            parentButtonRef="optionsIcon"
          />
        )}
      </div>
    </div>
  );
};

export default Options;
