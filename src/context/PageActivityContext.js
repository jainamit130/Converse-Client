import React, { createContext, useContext, useEffect } from "react";
import usePageInactivity from "../hooks/usePageInactivity"; // Import your hook
import useRedis from "../hooks/useRedis";
import { useUser } from "./UserContext";

const PageActivityContext = createContext();

export const PageActivityProvider = ({ children }) => {
  const { userId, isLogin } = useUser();
  const { isInactive } = usePageInactivity(30000);
  const { updateLastSeen, saveLastSeen } = useRedis();

  useEffect(() => {
    if (!userId) {
      return;
    }

    const timestamp = new Date().toISOString();
    if (!isInactive) {
      saveLastSeen(userId, timestamp);
    } else {
      updateLastSeen(userId);
    }
  }, [isInactive, userId]);

  return (
    <PageActivityContext.Provider value={{ isInactive }}>
      {children}
    </PageActivityContext.Provider>
  );
};

export const usePageActivity = () => useContext(PageActivityContext);
