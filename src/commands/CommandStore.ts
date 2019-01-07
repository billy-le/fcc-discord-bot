import fs from 'fs';
import Discord from 'discord.js';

export class CommandStore {
    private static instance: CommandStore;
    private commands: any;

    private constructor() {
    }

    public static getInstance(): CommandStore {
        if (!CommandStore.instance) {
            CommandStore.instance = new CommandStore();
            CommandStore.instance._buildCommandList();
        }
        return CommandStore.instance;
    }

    private _buildCommandList(): void {
        this.commands = new Discord.Collection();

        let commandFiles = null;
        fs.readdir(`${__dirname}/bot_commands/`, (error: any, files: string[]) => {
            if (error) {
                throw new Error("Error reading from command directory.");
            }

            commandFiles = files.filter((file: any) => file.endsWith(".js"));
            try {
                if (!commandFiles) {
                    throw new Error("Could not read commands");
                }
                for (const file of commandFiles) {
                    const command = require(`${__dirname}/bot_commands/${file}`);
                    this.commands.set(command.name, command);
                }
            } catch (err) {
                console.error("Error (_buildCommandList):", err);
                throw err;
            }
        });
    }

    public getCommands(): any {
        return this.commands;
    }
}
