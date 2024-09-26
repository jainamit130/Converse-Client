import React, { createContext, useContext } from "react";
import usePageInactivity from "../hooks/usePageInactivity";

const PageActivityContext = createContext();

export const PageActivityProvider = ({ children }) => {
  const { isInactive } = usePageInactivity(30000);

  return (
    <PageActivityContext.Provider value={{ isInactive }}>
      {children}
    </PageActivityContext.Provider>
  );
};

export const usePageActivity = () => useContext(PageActivityContext);
