import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const usePageInactivity = (inactiveTimeout = 60000) => {
  const [isInactive, setIsInactive] = useState(false);
  const location = useLocation(); // Get current route location

  const resetInactivity = () => {
    setIsInactive(false); // Reset inactivity state when user is active
  };

  useEffect(() => {
    let timeoutId;

    const resetInactivityTimer = () => {
      // Set user as active and clear previous timeout
      setIsInactive(false);
      clearTimeout(timeoutId);

      // Set user as inactive after timeout if still on /chat-rooms
      timeoutId = setTimeout(() => {
        if (location.pathname === "/chat-rooms") {
          setIsInactive(true);
        }
      }, inactiveTimeout);
    };

    const handleUserActivity = () => {
      // Reset inactivity timer only if the user is on /chat-rooms
      if (location.pathname === "/chat-rooms") {
        resetInactivityTimer();
      } else {
        setIsInactive(true); // Force inactive if not on /chat-rooms
      }
    };

    const handleWindowClose = () => {
      setIsInactive(true); // Set inactive when window is closed
    };

    // Add event listeners for user activity
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);
    window.addEventListener("beforeunload", handleWindowClose);

    // Initial check when location changes
    if (location.pathname !== "/chat-rooms") {
      setIsInactive(true); // Make inactive immediately if not on /chat-rooms
    }

    // Clean up listeners and timeout on component unmount
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
