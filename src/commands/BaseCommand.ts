import { Message } from "discord.js";

export abstract class BaseCommand {
  protected name: string;
  protected description: string;

  public constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  public abstract execute(message: Message, args: string[] | null): void;
}
