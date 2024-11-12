import React, { useEffect, useRef } from "react";

const OptionsDropdown = ({
  options,
  onSelect,
  isOpen,
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
        toggleDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, toggleDropdown]);

  return (
    <div ref={dropdownRef} className="options-dropdown">
      {isOpen && (
        <ul className="options-list">
          {options.map((option, index) => (
            <li key={index} onClick={() => onSelect(option, parameter)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default OptionsDropdown;
