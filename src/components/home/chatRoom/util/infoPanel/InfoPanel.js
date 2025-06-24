import { useEffect, useRef } from "react";
import closeButtonIcon from "../../../../../assets/CloseButton.png";
import backButtonIcon from "../../../../../assets/backButton.png";
import "./InfoPanel.css";

const InfoPanel = ({ panelName, onClose, onBack, children }) => {
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
        {onBack ? (
          <img
            src={backButtonIcon}
            className="back-button"
            alt="back"
            onClick={onBack}
          />
        ) : (
          <img
            src={closeButtonIcon}
            className="close-button"
            alt="close"
            onClick={onClose}
          />
        )}

        <span className="panelName">{panelName}</span>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default InfoPanel;
