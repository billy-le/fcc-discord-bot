require("dotenv").config({ path: __dirname + "/../.env" });

import Bot from "./Bot";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import passport from "passport";
import { homeDocument } from "./views/homePage";
import "./models/user";
import "./services/passport";
// require("./models/user");
// require("./services/passport");

const { MONGO_URI, COOKIE_KEY } = process.env;

const PORT: string | number = process.env.PORT || 3000;

//******************************************************* */
// Constants
//******************************************************* */
const MAX_COOKIE_AGE = 30 * 24 * 3600 * 1000; // 30 days -> ms

//******************************************************* */
// Database configuration
//******************************************************* */
try {
  if (MONGO_URI == undefined) {
    throw Error("MONGO_URI not provided");
  }
  mongoose.connect(
    MONGO_URI,
    { useNewUrlParser: true }
  );
} catch (err) {
  console.error("Error:", err);
}

//******************************************************* */
// App configuration
//******************************************************* */
const app = express();
app.use(bodyParser.json({ type: "*/*" }));

// Setup cookies
app.use(
  cookieSession({
    maxAge: MAX_COOKIE_AGE,
    keys: [COOKIE_KEY as string]
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Setup routes
require("./routes/authentication")(app);

// TODO: Move these out into their own files
app.get("/", (req, res) => {
  res.status(200).send(homeDocument());
});
app.get("/error", (req, res) => {
  res.send("<h1>Login Error!</h1>");
});

//******************************************************* */
// Start server and bot
//******************************************************* */
app.listen(PORT);

const chatBot = new Bot();
chatBot.run();
