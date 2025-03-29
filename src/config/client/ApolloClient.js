import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import config from "../environment";

const httpLink = createHttpLink({
  uri: config.CHAT_BASE_URL + "/graphql",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
