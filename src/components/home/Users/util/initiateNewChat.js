export const initiateNewChat = ({
  id,
  name,
  type,
  directSelfChats,
  handleNewChat,
  goBack,
}) => {
  if (!id || !name) return;

  if (directSelfChats.has(name)) {
    handleNewChat({ id: directSelfChats.get(name), name, type });
  } else {
    localStorage.setItem("newDirectChatUserId", id);
    handleNewChat({ id: "temp", name, type });
  }

  if (typeof goBack === "function") {
    goBack();
  }
};
