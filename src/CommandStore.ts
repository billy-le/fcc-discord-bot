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

        const commandFiles = fs
            .readdirSync(__dirname + "/commands/bot_commands")
            .filter((file: any) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(`./commands/bot_commands/${file}`);
            this.commands.set(command.name, command);
        }

    }

    public getCommands(): any {
        return this.commands;
    }
}
