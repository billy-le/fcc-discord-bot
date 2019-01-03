import * as Discord from "discord.js";
import { CommandStore } from "./CommandStore";
import { prefix } from "./constant";

const { DISCORD_TOKEN } = process.env;
export class Bot {
  private client: any;

  constructor() {
    this.client = new Discord.Client();
    this.client.commands = CommandStore.getInstance().getCommands();

    // Configure event listeners
    this.client.on("message", (message: any) => {
      if (!message.content.startsWith(prefix) || message.author.bot) return;

      const args = message.content.slice(prefix.length).split(/ +/);
      const commandName = args.shift().toLowerCase();

      if (!this.client.commands.has(commandName)) {
        return;
      }

      const command = this.client.commands.get(commandName);

      try {
        command.execute(message, args);
      } catch (error) {
        console.error(error);
        message.reply("there was an error trying to execute that command!");
      }
    });

    this.client.login(DISCORD_TOKEN);
  }
}
