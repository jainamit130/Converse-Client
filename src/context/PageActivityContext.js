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
  const { saveLastSeen, updateLastSeen } = useRedis();
  const { userId, activeChatRoomId } = useUser();

  const resetActivity = () => {
    setIsInactive(true);
    resetInactivity();
  };

  useEffect(() => {
    if (location.pathname !== "/chat-rooms") {
      updateLastSeen(userId, activeChatRoomId);
      setIsInactive(true);
    } else {
      saveLastSeen(userId, activeChatRoomId);
      setIsInactive(false);
    }
  }, [location, setIsInactive]);

  // useEffect(() => {
  //   return () => {
  //     resetActivity();
  //   };
  // }, []);

  return (
    <PageActivityContext.Provider
      value={{ isInactive, setIsInactive, resetActivity }}
    >
      {children}
    </PageActivityContext.Provider>
  );
};

export const usePageActivity = () => useContext(PageActivityContext);
