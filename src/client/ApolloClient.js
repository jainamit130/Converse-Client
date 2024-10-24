import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import config from "../config/environment";

const httpLink = createHttpLink({
  uri: config.BASE_URL + "/graphql", // Adjust this URL to match your GraphQL server
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token"); // Retrieve your token from wherever you store it
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
