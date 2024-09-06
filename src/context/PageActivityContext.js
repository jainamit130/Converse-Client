import React, { createContext, useContext, useEffect } from "react";
import usePageVisibilityAndInactivity from "../hooks/usePageVisibilityAndInactivity"; // Import your hook
import useRedis from "../hooks/useRedis";
import { useUser } from "./UserContext";

const PageActivityContext = createContext();

export const PageActivityProvider = ({ children }) => {
  const { isVisible, isInactive } = usePageVisibilityAndInactivity(30000); // 30-second timeout
  const { removeDataFromRedis, saveDataToRedis } = useRedis();
  const { userId } = useUser();

  useEffect(() => {
    const timestamp = new Date().toISOString();
    if (isVisible || !isInactive) {
      saveDataToRedis(userId, timestamp);
    } else {
      removeDataFromRedis(userId);
    }
  }, [isVisible, isInactive]);

  return (
    <PageActivityContext.Provider value={{ isVisible, isInactive }}>
      {children}
    </PageActivityContext.Provider>
  );
};

export const usePageActivity = () => useContext(PageActivityContext);
