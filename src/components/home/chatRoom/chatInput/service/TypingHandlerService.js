import { useChatRoomWebSocket } from "../../../../../context/WebSocketContext/ChatRoomWebSocketContext";

export const TypingHandlerService = (typingTimeoutRef) => {
  const { send } = useChatRoomWebSocket();

  const handleTyping = (event) => {
    clearTimeout(typingTimeoutRef.current);

    const isCharacterKey =
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey;

    if (isCharacterKey) {
      const username = localStorage.getItem("username");
      send(`typing/`, username);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    const username = localStorage.getItem("username");
    send(`stopTyping/`, username);
  };

  return {
    handleTyping,
    handleStopTyping,
  };
};
