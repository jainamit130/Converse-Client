import React from "react";
import ApolloProvider from "./ApolloProvider";
import ChatRooms from "./components/ChatRooms";
import client from "./client/ApolloClient";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { WebSocketProvider } from "./context/WebSocketContext";
import AddUser from "./components/AddUser";
import LoginSignUpPage from "./components/LoginSignUpPage";
import { UserProvider } from "./context/UserContext";
import { ChatRoomProvider } from "./context/ChatRoomContext";

function App() {
  return (
    <ApolloProvider client={client}>
      <WebSocketProvider>
        <UserProvider>
          <ChatRoomProvider>
            {" "}
            {/* Wrap ChatRoomProvider */}
            <Router>
              <Routes>
                <Route path="/" element={<LoginSignUpPage />} />
                <Route path="/chat-rooms" element={<ChatRooms />} />
                <Route path="/add-users" element={<AddUser />} />
              </Routes>
            </Router>
          </ChatRoomProvider>
        </UserProvider>
      </WebSocketProvider>
    </ApolloProvider>
  );
}

export default App;
