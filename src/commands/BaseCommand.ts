import { Message } from "discord.js";
import mongoose from 'mongoose';

export abstract class BaseCommand {
  protected name: string;
  protected description: string;
  protected Command = mongoose.model('commands');

  public constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  public abstract execute(message: Message, args: string[] | null): void;
}
