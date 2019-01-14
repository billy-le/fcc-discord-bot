require("dotenv").config({ path: __dirname + "/../.env" });

import http from 'http';
import https from 'https';
import fs from 'fs';
import Bot from "./Bot";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import passport from "passport";
import expressGraphQL from 'express-graphql';
import { homeDocument } from "./views/homePage";
import "./models/user";
import "./models/command";
import "./services/passport";
import schema from './schema/schema';

const { MONGO_URI, COOKIE_KEY } = process.env;

const PORT: string | number = process.env.PORT || 3000;
let SECPORT;
if (typeof PORT === 'number') {
  SECPORT = PORT + 443;
} else if (typeof PORT === 'string') {
  SECPORT = Number.parseInt(PORT) + 443;
}

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

// Redirect all traffic to the secure server
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(307, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});

app.use(bodyParser.json({ type: "*/*" }));

// Setup cookies
// app.use(
//   cookieSession({
//     maxAge: MAX_COOKIE_AGE,
//     keys: [COOKIE_KEY as string]
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// Setup routes
require("./routes/authentication")(app);

// Setup GraphQL
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

// TODO: Move these out into their own files
app.get("/", (req, res) => {
  res.status(200).send(homeDocument());
});
app.get("/error", (req, res) => {
  res.send("<h1>Login Error!</h1>");
});

//******************************************************* */
// Configure server and bot
//******************************************************* */
app.set('port', PORT);
app.set('secPort', SECPORT);

const server = http.createServer(app);
server.listen(PORT);
server.on('error', () => { console.log("Server Error") });
server.on('listen', () => { console.log("Server is listening") });

// Configure HTTPS server
const opts = {
  key: fs.readFileSync(__dirname + '/private.key'),
  cert: fs.readFileSync(__dirname + '/certificate.pem')
}

const secureServer = https.createServer(opts, app);
secureServer.listen(app.get('secPort'), () => {
  console.log(`Secure server listening on port ${app.get('secPort')}`);
});
secureServer.on('error', () => { console.log("Secure Server Error") });
secureServer.on('listen', () => { console.log("Secure Server is listening") });

const chatBot = new Bot();
chatBot.run();
