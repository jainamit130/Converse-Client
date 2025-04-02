import React from "react";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  ApolloProvider as Provider,
  createHttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import config from "../environment";
import { useHandleError } from "./../../hooks/useHandleError";

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

const ApolloProviderWrapper = ({ children }) => {
  const handleError = useHandleError();

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    handleError(graphQLErrors, networkError);
  });

  const client = new ApolloClient({
    link: errorLink.concat(authLink.concat(httpLink)),
    cache: new InMemoryCache(),
  });

  return <Provider client={client}>{children}</Provider>;
};

export default ApolloProviderWrapper;
