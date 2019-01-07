import { BaseCommand } from "../BaseCommand";

class TestCommand extends BaseCommand {
  public execute(
    message: import("discord.js").Message,
    args: string[] | null
  ): void {
    if (args) {
      let response = `Hi, you sent the following args: ${args
        .join(", ")
        .toString()}`;
      message.channel.send(response);
    } else {
      message.channel.send("Test Command");
    }
  }
}

module.exports = new TestCommand("test", "testing");
