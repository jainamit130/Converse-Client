import React, { createContext, useContext, useEffect } from "react";
import usePageVisibilityAndInactivity from "../hooks/usePageVisibilityAndInactivity"; // Import your hook
import useRedis from "../hooks/useRedis";
import { useUser } from "./UserContext";

const PageActivityContext = createContext();

export const PageActivityProvider = ({ children }) => {
  const { userId } = useUser();
  const { isVisible, isInactive } = usePageVisibilityAndInactivity(30000);
  const { updateLastSeen, saveLastSeen } = useRedis();

  useEffect(() => {
    const timestamp = new Date().toISOString();
    if (isVisible || !isInactive) {
      saveLastSeen(userId, timestamp);
    } else {
      updateLastSeen(userId);
    }
  }, [isVisible, isInactive, userId]);

  return (
    <PageActivityContext.Provider value={{ isVisible, isInactive }}>
      {children}
    </PageActivityContext.Provider>
  );
};

export const usePageActivity = () => useContext(PageActivityContext);
