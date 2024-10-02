import { useState, useEffect } from "react";

const usePageInactivity = (inactiveTimeout = 60000) => {
  const [isInactive, setIsInactive] = useState(false);

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

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);
    window.addEventListener("beforeunload", handleWindowClose);

    resetInactivityTimer();

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("beforeunload", handleWindowClose);
      clearTimeout(timeoutId);
    };
  }, [inactiveTimeout]);

  return { isInactive };
};

export default usePageInactivity;
