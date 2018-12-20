require("dotenv").config();
const fs = require("fs");
const path = require("path");
const http = require("http");
const { prefix } = require("./config");
const Discord = require("discord.js");

const PORT: string | number = process.env.PORT || 3000;

const server = http.createServer((req: any, res: any) => {
  req;
  const client = new Discord.Client();
  client.commands = new Discord.Collection();

  const commandFiles = fs
    .readdirSync(__dirname + "/commands")
    .filter((file: any) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }

  client.on("message", (message: any) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) {
      return;
    }

    const command = client.commands.get(commandName);

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply("there was an error trying to execute that command!");
    }
  });

  client.login(process.env.DISCORD_TOKEN);

  return res.end("<h1>App is live</h1>");
});

server.listen(PORT, () =>
  console.log(`The server is running on http://localhost:${PORT}`)
);
