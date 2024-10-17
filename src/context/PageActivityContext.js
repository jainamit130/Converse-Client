import React, { createContext, useContext } from "react";
import usePageInactivity from "../hooks/usePageInactivity";

const PageActivityContext = createContext();

export const PageActivityProvider = ({ children }) => {
  const { isInactive, setIsInactive, resetInactivity } =
    usePageInactivity(60000);

  const resetActivity = () => {
    setIsInactive(false);
    resetInactivity();
  };

  return (
    <PageActivityContext.Provider
      value={{ isInactive, setIsInactive, resetActivity }}
    >
      {children}
    </PageActivityContext.Provider>
  );
};

export const usePageActivity = () => useContext(PageActivityContext);
