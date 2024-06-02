import { ApolloClient, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";

const GRAPHQL_ENDPOINT = "ws://localhost:4000/graphql";

const link = new WebSocketLink({
  uri: GRAPHQL_ENDPOINT,
  options: {
    reconnect: true,
  },
  webSocketImpl: WebSocket, // Use native WebSocket
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

export default client;
