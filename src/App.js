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
import { PageActivityProvider } from "./context/PageActivityContext";
import { AppStateProvider } from "./context/AppStateContext";

function App() {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <AppStateProvider>
          <PageActivityProvider>
            <ChatRoomProvider>
              <WebSocketProvider>
                {" "}
                {/* Wrap ChatRoomProvider */}
                <Router>
                  <Routes>
                    <Route path="/" element={<LoginSignUpPage />} />
                    <Route path="/chat-rooms" element={<ChatRooms />} />
                    <Route path="/add-users" element={<AddUser />} />
                  </Routes>
                </Router>
              </WebSocketProvider>
            </ChatRoomProvider>
          </PageActivityProvider>
        </AppStateProvider>
      </UserProvider>
    </ApolloProvider>
  );
}

export default App;
