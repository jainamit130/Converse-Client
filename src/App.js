import ApolloProvider from "./config/provider/ApolloProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // use BrowserRouter for routing
import "./App.css";
import LoginSignUpPage from "./components/authComponents/LoginSignUpPage";
import client from "./config/client/ApolloClient";
import ChatRooms from "./components/home/chatRooms/ChatRooms";

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignUpPage />} />
          <Route path="/chat-rooms" element={<ChatRooms />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
