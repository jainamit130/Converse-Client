import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const usePageInactivity = (inactiveTimeout = 60000) => {
  const [isInactive, setIsInactive] = useState(false);
  const location = useLocation();

  const resetInactivity = () => {
    setIsInactive(false);
  };

  useEffect(() => {
    let timeoutId;

    const resetInactivityTimer = () => {
      setIsInactive(false);
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        if (location.pathname === "/chat-rooms") {
          setIsInactive(true);
        }
      }, inactiveTimeout);
    };

    const handleUserActivity = () => {
      if (location.pathname === "/chat-rooms") {
        resetInactivityTimer();
      } else {
        setIsInactive(true);
      }
    };

    const handleWindowClose = (event) => {
      setIsInactive(true);
      event.returnValue = "";
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);
    window.addEventListener("beforeunload", handleWindowClose);

    if (location.pathname !== "/chat-rooms") {
      setIsInactive(true);
    }

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("beforeunload", handleWindowClose);
      clearTimeout(timeoutId);
    };
  }, [inactiveTimeout, location]);

  return { isInactive, setIsInactive, resetInactivity };
};

export default usePageInactivity;
