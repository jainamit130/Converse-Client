import React from "react";
import ApolloProvider from "./ApolloProvider";
import ChatRooms from "./components/ChatRooms";
import client from "./client/ApolloClient";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { WebSocketProvider } from "./context/WebSocketContext";
import AddUser from "./components/AddUser";
import LoginSignUpPage from "./components/authComponents/LoginSignUpPage";
import { UserProvider, useUser } from "./context/UserContext";
import { ChatRoomProvider } from "./context/ChatRoomContext";
import { PageActivityProvider } from "./context/PageActivityContext";
import LogoutPage from "./components/authComponents/LogoutPage";

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignUpPage />} />

          <Route
            path="/*"
            element={
              <UserProvider>
                <PageActivityProvider>
                  <ChatRoomProvider>
                    <WebSocketProvider>
                      <Routes>
                        <Route path="/chat-rooms" element={<ChatRooms />} />
                        <Route path="/add-users" element={<AddUser />} />
                        <Route path="/logout" element={<LogoutPage />} />
                      </Routes>
                    </WebSocketProvider>
                  </ChatRoomProvider>
                </PageActivityProvider>
              </UserProvider>
            }
          />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
