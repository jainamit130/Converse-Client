import React from "react";
import OptionsDropdown from "../OptionsDropdown/OptionsDropdown";
import messageOptionsIcon from "../../../assets/MessageOptions.png";
import "./MessageOptions.css";

const MessageOptions = ({
  id,
  isOpen,
  isUserMessage,
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
        src={messageOptionsIcon}
        className={`messageOptionsIcon ${isOpen ? "visible" : ""} ${
          isUserMessage ? "userMessage" : "notUserMessage"
        }`}
        onClick={handleClick}
      />

      <div className="messageOptions">
        {isOpen && (
          <OptionsDropdown
            options={options}
            onSelect={(event, option) => onSelect(option, id)}
            toggleDropdown={toggleDropdown}
            parameter={id}
            parentButtonRef="messageOptionsIcon"
          />
        )}
      </div>
    </div>
  );
};

export default MessageOptions;
