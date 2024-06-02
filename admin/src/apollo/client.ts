import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createClient } from "graphql-ws";
import { WebSocketLink } from "@apollo/client/link/ws";

const GRAPHQL_ENDPOINT = "ws://localhost:4000/graphql";

const link = new WebSocketLink({
  uri: GRAPHQL_ENDPOINT,
  options: {
    reconnect: true,
  },
  webSocketImpl: createClient,
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

export default client;
