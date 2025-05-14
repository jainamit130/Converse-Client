export const toggleDropdown = (
  message,
  isOpen,
  setIsOpen,
  setOptions,
  isWithinDeleteWindow,
  isUserMessage
) => {
  if (isOpen) {
    setIsOpen(null);
  } else {
    if (isUserMessage && !message.deletedForEveryone && isWithinDeleteWindow) {
      setOptions(["Delete for everyone", "Delete for me", "Message info"]);
    } else {
      setOptions(["Delete for me", "Message info"]);
    }
    setIsOpen(message.id);
  }
};
