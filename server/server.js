const express = require("express");
const cors = require("cors");
const db = require("./src/database");

// Using Apollo server express.
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const http = require("http");

// Added for subscription support.
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");

// GraphQL schema and resolvers.
const { typeDefs, resolvers } = require("./src/graphql");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

db.sync({ logging: console.log });

async function startApolloServer(typeDefs, resolvers) {
  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Setup GraphQL subscription server.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // Passing in an instance of a GraphQLSchema and
  // telling the WebSocketServer to start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  // Setup Apollo server.
  // Include plugin code to ensure all HTTP and subscription connections closed when the server is shutting down.
  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          };
        }
      }]
  });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
}

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// routes
require("./src/routes/users.js")(express, app);
require("./src/routes/product.routes.js")(express, app);
require("./src/routes/cart.routes.js")(express, app);
require("./src/routes/review.routes.js")(express, app);

startApolloServer(typeDefs, resolvers);