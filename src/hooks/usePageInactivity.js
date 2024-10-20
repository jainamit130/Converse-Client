import { useState, useEffect } from "react";
import config from "../config/environment";
import useRedis from "./useRedis";

const usePageInactivity = (inactiveTimeout = 60000) => {
  const BASE_URL = config.BASE_URL;
  const [isInactive, setIsInactive] = useState(false);

  const resetInactivity = () => {
    setIsInactive(true);
  };

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

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("beforeunload", handleWindowClose);
      clearTimeout(timeoutId);
    };
  }, [inactiveTimeout]);

  return { isInactive, setIsInactive, resetInactivity };
};

export default usePageInactivity;
