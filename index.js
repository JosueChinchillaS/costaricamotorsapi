// Import Environment Variables

require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { Clerk } = require("@clerk/clerk-sdk-node");
const cors = require("cors");
const { Webhook } = require("svix");
const bodyParser = require("body-parser");

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

  app.use(cors());

  try {
    await server.start();
    server.applyMiddleware({ app, path: "/api/graphql" });

    app.post(
      "/api/webhooks",
      bodyParser.raw({ type: "application/json" }),
      async (req, res) => {
        const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
        if (!WEBHOOK_SECRET) {
          return res
            .status(500)
            .json({ error: "WEBHOOK_SECRET is not configured." });
        }

        const headers = req.headers;
        const payload = req.body;

        const svix_id = headers["svix-id"];
        const svix_timestamp = headers["svix-timestamp"];
        const svix_signature = headers["svix-signature"];

        if (!svix_id || !svix_timestamp || !svix_signature) {
          return res
            .status(400)
            .json({ error: "Error occurred -- no svix headers" });
        }

        const wh = new Webhook(WEBHOOK_SECRET);

        try {
          const evt = wh.verify(payload.toString(), {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
          });

          // Determine the type of event
          switch (evt.type) {
            case "user.created":
              // Extract user data from the event
              const newUser = {
                clerkId: evt.data.id,
                email: evt.data.emailAddresses[0].emailAddress, // Assuming the first email is the primary one
                username: evt.data.username,
                firstName: evt.data.firstName,
                lastName: evt.data.lastName,
                // Add other fields as necessary
              };
              // Create a new user in MongoDB
              await User.create(newUser);
              break;
            case "user.updated":
              // Update the user in MongoDB
              await User.findOneAndUpdate(
                { clerkId: evt.data.id },
                {
                  email: evt.data.emailAddresses[0].emailAddress,
                  username: evt.data.username,
                  firstName: evt.data.firstName,
                  lastName: evt.data.lastName,
                  // Update other fields as necessary
                },
                { new: true }
              );
              break;
            case "user.deleted":
              // Delete the user from MongoDB
              await User.findOneAndDelete({ clerkId: evt.data.id });
              break;
            // Handle other event types as necessary
          }

          console.log(`Handled webhook event: ${evt.type}`);
          return res
            .status(200)
            .json({ success: true, message: "Webhook handled successfully" });
        } catch (error) {
          console.error("Webhook verification failed:", error.message);
          return res
            .status(400)
            .json({ success: false, message: "Webhook failed to verify" });
        }
      }
    );

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
