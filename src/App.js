import ApolloProvider from "./ApolloProvider";
import ChatRooms from "./components/ChatRooms";
import "./App.css";

function App() {
  const userId = "668bbb44d834f25303f35c39";
  return (
    // <div className="App">
    //   <LoginSignUpPage />
    // </div>
    <ApolloProvider>
      <div className="App">
        <h1>Chat Rooms</h1>
        <ChatRooms userId={userId} />
      </div>
    </ApolloProvider>
  );
}

export default App;
