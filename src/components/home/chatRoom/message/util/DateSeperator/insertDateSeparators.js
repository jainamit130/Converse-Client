import { formatMessageDate, parseDate } from "../../../../../../util/dateUtil";
import NotificationMessage from "../../NotificationMessage/NotificationMessage";
import UnreadMessageNotification from "../UnreadMessageStyle/UnreadMessageNotification";

export const insertDateSeparators = (
  messages,
  unreadMessageCount,
  renderMessage
) => {
  let unreadChatCount = 0;
  let totalChatMessages = 0;

  messages.forEach((m) => {
    if (m.__typename === "ChatMessage") {
      totalChatMessages++;
    }
  });

  const unreadStartChatIndex = totalChatMessages - unreadMessageCount;

  return messages.reduce((acc, message, index) => {
    const messageDate = formatMessageDate(parseDate(message.timestamp));
    const prevMessage = messages[index - 1];
    const prevDate = prevMessage
      ? formatMessageDate(parseDate(prevMessage.timestamp))
      : null;

    if (index === 0 || messageDate !== prevDate) {
      acc.push(
        <NotificationMessage
          key={`date-${messageDate}-${index}`}
          content={messageDate}
        />
      );
    }

    if (message.__typename === "ChatMessage") {
      if (unreadChatCount === unreadStartChatIndex && unreadMessageCount > 0) {
        acc.push(
          <UnreadMessageNotification
            key={`unread-${messageDate}-${index}`}
            unreadMessageCount={unreadMessageCount}
          />
        );
      }
      unreadChatCount++;
    }

    acc.push(renderMessage(message));
    return acc;
  }, []);
};
