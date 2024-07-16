import ApolloProvider from "./ApolloProvider";
import ChatRooms from "./components/ChatRooms";
import client from "./client/ApolloClient";
import "./App.css";
import { WebSocketProvider } from "./context/WebSocketContext";

function App() {
  const userId = "668bbb44d834f25303f35c39";
  return (
    <ApolloProvider client={client}>
      <WebSocketProvider>
        <ChatRooms userId={userId} />
      </WebSocketProvider>
    </ApolloProvider>
  );
}

export default App;
