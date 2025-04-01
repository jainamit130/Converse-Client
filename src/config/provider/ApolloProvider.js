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
import { useNavigate } from "react-router-dom";

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

const errorLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    if (
      response.errors &&
      response.errors.some((err) => err.message === "403")
    ) {
      const navigate = useNavigate();
      navigate("/");
    }
    return response;
  });
});

const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
});

const ApolloProvider = ({ children }) => {
  return <Provider client={client}>{children}</Provider>;
};

export default ApolloProvider;
