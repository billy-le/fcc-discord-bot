module.exports = {
  name: "test",
  description: "testing",
  execute(message: any, args: any) {
    message.channel.send("Subscribing!");
  }
};
