import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // use BrowserRouter for routing
import "./App.css";
import LoginSignUpPage from "./components/authComponents/LoginSignUpPage";
import { UserWebSocketProvider } from "./context/WebSocketContext/UserWebSocketContext";
import { ChatRoomWebSocketProvider } from "./context/WebSocketContext/ChatRoomWebSocketContext";
import Home from "./components/home/Home";
import ApolloProviderWrapper from "./config/provider/ApolloProvider";
import { ChatRoomContextProvider } from "./context/ChatRoomContext";

function App() {
  return (
    <Router>
      <ApolloProviderWrapper>
        <ChatRoomContextProvider>
          <ChatRoomWebSocketProvider>
            <UserWebSocketProvider>
              <Routes>
                <Route path="/" element={<LoginSignUpPage />} />
                <Route path="/chat-rooms" element={<Home />} />
              </Routes>
            </UserWebSocketProvider>
          </ChatRoomWebSocketProvider>
        </ChatRoomContextProvider>
      </ApolloProviderWrapper>
    </Router>
  );
}

export default App;
