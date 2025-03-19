import React, { useEffect, useRef } from "react";
import "../OptionsDropdown/OptionsDropdown.css";

const OptionsDropdown = ({
  options,
  onSelect,
  toggleDropdown,
  parameter,
  parentButtonRef,
}) => {
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.classList.contains(parentButtonRef)
      ) {
        toggleDropdown(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, toggleDropdown]);

  return (
    <div ref={dropdownRef} className="options-dropdown">
      {
        <ul className="options-list">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={(event) => onSelect(event, option, parameter)}
            >
              {option}
            </li>
          ))}
        </ul>
      }
    </div>
  );
};
export default OptionsDropdown;
