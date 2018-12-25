require("dotenv").config();
const fs = require("fs");
const path = require("path");
const http = require("http");
const { prefix } = require("./config");
const Discord = require("discord.js");
const { Collection } = Discord;

const PORT: string | number = process.env.PORT || 3000;

const chatBot = new Bot();

const server = http.createServer((req: any, res: any) => {
  return res.end("<h1>App is live</h1>");
});

server.listen(PORT, () =>
  console.log(`The server is running on http://localhost:${PORT}`)
);
