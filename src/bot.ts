// const commands = require('./CommandStore');

interface BotInterface {
    commands: any;
    client: any;
}

class Bot implements BotInterface {
    commands: any;
    client: any;

    constructor() {
        this.commands = CommandStore.getInstance().getCommands();
        this.client = new Discord.Client();
        this.client.commands = this.commands;

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
        
          this.client.login(process.env.DISCORD_TOKEN);
    }
}

module.exports = Bot;