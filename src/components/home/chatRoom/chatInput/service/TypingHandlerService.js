import { useRef } from "react";

export const TypingHandlerService = ({ typingTimeoutRef, isTypingRef }) => {
  const username = localStorage.getItem("username");

  const handleTyping = (event, send) => {
    const isCharacterKey =
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey;

    if (!isCharacterKey) return;

    if (!isTypingRef.current) {
      send(`typing/`, username);
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping(send);
    }, 1000);
  };

  const handleStopTyping = (send) => {
    if (isTypingRef.current) {
      send(`stopTyping/`, username);
      isTypingRef.current = false;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  return { handleTyping, handleStopTyping };
};
