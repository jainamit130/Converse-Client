import React from "react";
import OptionsDropdown from "../OptionsDropdown/OptionsDropdown";
import "./Options.css";

const Options = ({
  id,
  optionsIcon,
  isOpen,
  options,
  toggleDropdown,
  onSelect,
  shouldStayVisible = false,
  optionsIconClassName = "",
}) => {
  const handleClick = (event) => {
    toggleDropdown(event, id);
    event.stopPropagation();
  };

  return (
    <div
      className={`options-wrapper ${shouldStayVisible ? "always-visible" : ""}`}
    >
      <img
        src={optionsIcon}
        className={`optionsIcon ${optionsIconClassName}`}
        onClick={handleClick}
      />
      <div>
        {isOpen && (
          <OptionsDropdown
            options={options}
            onSelect={(event, option) => onSelect(event, option, id)}
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
