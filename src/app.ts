require("dotenv").config({ path: __dirname + "/../.env" });

import { Bot } from "./Bot";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import passport from "passport";
import { homeDocument } from "./views/homePage";
require("./models/user");
require("./services/passport");

const { MONGO_URI, COOKIE_KEY } = process.env;

const PORT: string | number = process.env.PORT || 3000;

//******************************************************* */
// Constants
//******************************************************* */
const MAX_COOKIE_AGE = 30 * 24 * 3600 * 1000; // 30 days -> ms

//******************************************************* */
// Database configuration
mongoose
  .connect(
    MONGO_URI as string,
    { useNewUrlParser: true }
  )
  .catch(err => console.log(err));
//******************************************************* */

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
// Start server

app.listen(PORT);

// Creating a new Bot instance will also start it up
const chatBot = new Bot();
