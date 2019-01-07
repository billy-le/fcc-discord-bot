import Discord, { Message, Client } from "discord.js";
import { CommandStore } from "./CommandStore";
import { prefix } from "./constant";

const { DISCORD_TOKEN } = process.env;

export default class Bot {
  private client: Client;
  private commands: any;

  constructor() {
    this.client = new Discord.Client();
    this.commands = CommandStore.getInstance().getCommands();
    this._configMessageListener();
  }

  private _configMessageListener() {
    this.client.on("message", (message: Message) => {
      // Don't allow the bot to respond to itself
      if (message.author.bot) {
        return;
      }

      // Is the message a command?
      if (message.content.startsWith(prefix)) {
        this._handleCommand(message);
      } else {
        // do nothing for now, later allow the bot to hold a conversation if tagged
      }
    });
  }

  private _handleCommand(message: Message): void {
    const tokens = message.content.slice(prefix.length).split(/ +/);

    // If no command was provided, do nothing
    if (tokens.length < 1) {
      return;
    }
    // The command is the first token
    const command = tokens[0];

    // If the command is not one the bot knows, do nothing
    if (!this.commands.has(command)) {
      return;
    }
    // Get the corresponding command object from the bot
    const botCommand = this.commands.get(command);

    // Get any arguments
    let args: string[] | null = null;
    if (tokens.length > 1) {
      args = tokens.slice(1);
    }

    try {
      botCommand.execute(message, args);
    } catch (err) {
      console.error("Error:", err.message);
    }
  }

  public run(): void {
    this.client.login(DISCORD_TOKEN);
  }
}
