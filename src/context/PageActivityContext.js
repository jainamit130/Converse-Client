import React, { createContext, useContext, useEffect } from "react";
import usePageInactivity from "../hooks/usePageInactivity";

const PageActivityContext = createContext();

export const PageActivityProvider = ({ children }) => {
  const { isInactive, setIsInactive, resetInactivity } =
    usePageInactivity(60000);

  const resetActivity = () => {
    setIsInactive(true);
    resetInactivity();
  };

  useEffect(() => {
    return () => {
      resetActivity();
    };
  }, []);

  return (
    <PageActivityContext.Provider
      value={{ isInactive, setIsInactive, resetActivity }}
    >
      {children}
    </PageActivityContext.Provider>
  );
};

export const usePageActivity = () => useContext(PageActivityContext);
