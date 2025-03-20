import ApolloProvider from "./config/provider/ApolloProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // use BrowserRouter for routing
import "./App.css";
import LoginSignUpPage from "./components/authComponents/LoginSignUpPage";
import client from "./config/client/ApolloClient";
import ChatRooms from "./components/home/chatRooms/ChatRooms";
import { UserWebSocketProvider } from "./context/WebSocketContext/UserWebSocketContext";

function App() {
  return (
    <ApolloProvider client={client}>
      <UserWebSocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginSignUpPage />} />
            <Route path="/chat-rooms" element={<ChatRooms />} />
          </Routes>
        </Router>
      </UserWebSocketProvider>
    </ApolloProvider>
  );
}

export default App;
