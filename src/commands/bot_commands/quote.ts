import { BaseCommand } from "../BaseCommand";

class QuoteCommand extends BaseCommand {
  public execute(
    message: import("discord.js").Message,
    args: string[] | null
  ): any {
    // TODO: Send query to GraphQL to retrieve a quote
    message.channel.send("\"English? Who needs that? I’m never going to England.\" -- Homer Simpson");
  }
}

module.exports = new QuoteCommand("quote", "quotes");
