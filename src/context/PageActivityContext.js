import React, { createContext, useContext, useEffect } from "react";
import usePageInactivity from "../hooks/usePageInactivity";
import { useLocation } from "react-router-dom";
import useRedis from "../hooks/useRedis";
import { useUser } from "./UserContext";

const PageActivityContext = createContext();

export const PageActivityProvider = ({ children }) => {
  const { isInactive, setIsInactive, resetInactivity } =
    usePageInactivity(60000);
  const location = useLocation();
  const { saveUserToRedis, removeUserFromRedis } = useRedis();
  const { userId, activeChatRoomId } = useUser();

  const resetActivity = () => {
    setIsInactive(true);
    resetInactivity();
  };

  useEffect(() => {
    if (location.pathname !== "/chat-rooms") {
      removeUserFromRedis(userId, activeChatRoomId);
      setIsInactive(true);
    } else {
      saveUserToRedis(userId, activeChatRoomId);
      setIsInactive(false);
    }
  }, [location, setIsInactive]);

  useEffect(() => {
    return () => {
      if (userId !== null) removeUserFromRedis(userId, activeChatRoomId);
      setIsInactive(true);
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
