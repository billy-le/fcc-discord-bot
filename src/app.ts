require("dotenv").config();
import * as http from 'http';
import { Bot } from './Bot';

const PORT: string | number = process.env.PORT || 3000;

// Creating a new Bot instance will also start it up
const chatBot = new Bot();

// The server can be used later to get Github authorization from the user
const server = http.createServer((req: any, res: any) => {
  return res.end("<h1>App is live</h1>");
});

server.listen(PORT, () =>
  console.log(`The server is running on http://localhost:${PORT}`)
);
