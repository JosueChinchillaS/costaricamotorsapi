// Import Environment Variables

require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { Clerk } = require("@clerk/clerk-sdk-node");
const User = require("./models/User");
// Initialize Clerk
const clerk = new Clerk(process.env.CLERK_API_KEY);

const typeDefs = require("./database/Schema/schema");
const resolvers = require("./database/Resolver/resolvers");

// // Import JWT
// const jwt = require("jsonwebtoken");

// Import DB Connection
const dbConnection = require("./config/database");

// Connect to DB
dbConnection();

// Create an async function to start the server

const startServer = async () => {
  const app = express();

  // Authentication middleware
  async function authContext({ req }) {
    // Attempt to retrieve the session token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (token) {
      try {
        const { userId } = await clerk.verifyToken(token);
        const user = await clerk.users.getUser(userId);
        console.log(user);
        return { user };
      } catch (error) {
        console.warn("Authentication error:", error.message);
        // In case of any authentication error, proceed with no user context
        return { user: null };
      }
    }

    // If no token was provided, return with no user context
    return { user: null };
  }
  // Create an ApolloServer instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authContext,
    // context: ({ req }) => {
    //   const token = req.headers["authorization"] || "";
    //   if (token) {
    //     try {
    //       const user = jwt.verify(
    //         token.replace("Bearer ", ""),
    //         process.env.JWT_SECRET
    //       );
    //       return {
    //         user,
    //       };
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // },
  });

  try {
    await server.start();
    server.applyMiddleware({ app, path: "/api/graphql" });

    app.post("/webhooks/clerk", async (req, res) => {
      const { type, data } = req.body;

      if (type === "user.created" || type === "user.updated") {
        try {
          const userPayload = {
            clerkId: data.id,
            email:
              data.emailAddresses.length > 0
                ? data.emailAddresses[0].emailAddress
                : "",
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
          };

          // Upsert user in MongoDB
          const user = await User.findOneAndUpdate(
            { clerkId: data.id },
            userPayload,
            { new: true, upsert: true }
          );
          console.log("User created or updated in MongoDB:", user);
        } catch (error) {
          console.error("Error processing Clerk webhook:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
      }

      // Respond to Clerk to acknowledge receipt of the webhook
      res.status(200).json({ message: "Webhook processed" });
    });

    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}/`);
    });
  } catch (error) {
    console.error("Error starting the server:");
    console.error(error);
  }
};

startServer();
