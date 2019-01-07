module.exports = {
  name: "test",
  description: "testing",
  execute(message: any, args: string[] | null) {
    if(args) {
      let response = `Hi, you sent the following args: ${args.join(", ").toString()}`;
      message.channel.send(response);
    }
    message.channel.send("Test Command");
  }
};
