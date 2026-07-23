
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.ATLASDB_URL);
await client.connect(); 

const auth = betterAuth({
    database: mongodbAdapter(client.db()),

    trustedOrigins: [
  "http://localhost:5173",
  "https://placementprep-bice.vercel.app",
],

advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },

  account: {
    skipStateCookieCheck: true,
  },

    socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
},

});

export default auth;