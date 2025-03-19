import ChatRoom from "./chatRoom/ChatRoom";
import ChatRooms from "./chatRooms/ChatRooms";

const home = () => {
  return (
    <div>
      <ChatRooms></ChatRooms>
      <ChatRoom></ChatRoom>
    </div>
  );
};

export default Home;
