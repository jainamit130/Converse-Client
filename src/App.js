import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // use BrowserRouter for routing
import "./App.css";
import LoginSignUpPage from "./components/authComponents/LoginSignUpPage";
import { UserWebSocketProvider } from "./context/WebSocketContext/UserWebSocketContext";
import { ChatRoomWebSocketProvider } from "./context/WebSocketContext/ChatRoomWebSocketContext";
import Home from "./components/home/Home";
import ApolloProviderWrapper from "./config/provider/ApolloProvider";

function App() {
  return (
    <Router>
      <ApolloProviderWrapper>
        <UserWebSocketProvider>
          <ChatRoomWebSocketProvider>
            <Routes>
              <Route path="/" element={<LoginSignUpPage />} />
              <Route path="/chat-rooms" element={<Home />} />
            </Routes>
          </ChatRoomWebSocketProvider>
        </UserWebSocketProvider>
      </ApolloProviderWrapper>
    </Router>
  );
}

export default App;
