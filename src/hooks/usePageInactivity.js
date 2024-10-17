import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import config from "../config/environment";

const usePageInactivity = (inactiveTimeout = 60000) => {
  const BASE_URL = config.BASE_URL;
  const [isInactive, setIsInactive] = useState(false);

  const resetInactivity = () => {
    setIsInactive(false);
  };

  const location = useLocation(); // This hook provides access to the current location

  useEffect(() => {
    let timeoutId;

    const resetInactivityTimer = () => {
      setIsInactive(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsInactive(true);
      }, inactiveTimeout);
    };

    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    const handleWindowClose = () => {
      setIsInactive(true);
    };

    const handleNavigation = () => {
      if (BASE_URL === window.location.origin) {
        if (window.location.pathname === "/") setIsInactive(true);
      } else {
        setIsInactive(true);
      }
    };

    handleNavigation();

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);
    window.addEventListener("beforeunload", handleWindowClose);

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("beforeunload", handleWindowClose);
      clearTimeout(timeoutId);
    };
  }, [inactiveTimeout, location]); // Add location as a dependency so it runs on route change

  return { isInactive, setIsInactive, resetInactivity };
};

export default usePageInactivity;
