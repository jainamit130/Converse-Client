import React from "react";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  ApolloProvider as Provider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import config from "../environment";

const httpLink = createHttpLink({
  uri: config.CHAT_BASE_URL + "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("authenticationToken");

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const urlParamsLink = new ApolloLink((operation, forward) => {
  const { operationName } = operation;

  if (operationName === "getChatRoomData") {
    const chatRoomId = localStorage.getItem("activeChatRoomId");
    if (chatRoomId && chatRoomId.trim() !== "") {
      const newUri = `${config.CHAT_BASE_URL}/graphql?chatRoomId=${chatRoomId}`;
      operation.setContext({
        uri: newUri,
      });
    }
  }

  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(urlParamsLink).concat(httpLink),
  cache: new InMemoryCache(),
});

const ApolloProvider = ({ children }) => {
  return <Provider client={client}>{children}</Provider>;
};

export default ApolloProvider;
