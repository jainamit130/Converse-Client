import React, { createContext, useContext, useEffect } from "react";
import usePageVisibilityAndInactivity from "../hooks/usePageVisibilityAndInactivity"; // Import your hook
import useRedis from "../hooks/useRedis";
import { useUser } from "./UserContext";
import { useMarkAllMessagesDelivered } from "../hooks/useMarkAllMessages";

const PageActivityContext = createContext();

export const PageActivityProvider = ({ children }) => {
  const { userId } = useUser(); // Destructure userId first
  const { isVisible, isInactive } = usePageVisibilityAndInactivity(30000); // 30-second timeout
  const { updateLastSeen, saveLastSeen } = useRedis();
  const handleMarkAllMessagesDelivered = useMarkAllMessagesDelivered(userId);

  useEffect(() => {
    const timestamp = new Date().toISOString();
    if (isVisible || !isInactive) {
      handleMarkAllMessagesDelivered();
      saveLastSeen(userId, timestamp);
    } else {
      updateLastSeen(userId);
    }
  }, [isVisible, isInactive, userId]); // Make sure to add userId as a dependency

  return (
    <PageActivityContext.Provider value={{ isVisible, isInactive }}>
      {children}
    </PageActivityContext.Provider>
  );
};

export const usePageActivity = () => useContext(PageActivityContext);
