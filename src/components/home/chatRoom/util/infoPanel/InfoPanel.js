import { useEffect, useRef } from "react";
import closeButtonIcon from "../../../../../assets/CloseButton.png";
import "./InfoPanel.css";

const InfoPanel = ({ panelName, onClose, children }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        !event.target.classList.contains("close-button")
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="InfoPanel" ref={panelRef}>
      <div className="InfoHeader">
        <img
          src={closeButtonIcon}
          className="close-button"
          alt="close"
          onClick={onClose}
        />
        <span>{panelName}</span>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default InfoPanel;
