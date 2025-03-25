import ApolloProvider from "./config/provider/ApolloProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // use BrowserRouter for routing
import "./App.css";
import LoginSignUpPage from "./components/authComponents/LoginSignUpPage";
import client from "./config/client/ApolloClient";
import { UserWebSocketProvider } from "./context/WebSocketContext/UserWebSocketContext";
import { ChatRoomWebSocketProvider } from "./context/WebSocketContext/ChatRoomWebSocketContext";
import Home from "./components/home/Home";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    localStorage.removeItem("activeChatRoomId");
    localStorage.removeItem("activeChatRoomName");
  }, []);
  return (
    <ApolloProvider client={client}>
      <UserWebSocketProvider>
        <ChatRoomWebSocketProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LoginSignUpPage />} />
              <Route path="/chat-rooms" element={<Home />} />
            </Routes>
          </Router>
        </ChatRoomWebSocketProvider>
      </UserWebSocketProvider>
    </ApolloProvider>
  );
}

export default App;
