import {Message} from 'discord.js';

abstract class BaseCommand {
    public execute(message: Message, args: any) {
        message.channel.send("blah!");
      }
}