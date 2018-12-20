"use strict";
require("dotenv").config();
var fs = require("fs");
var path = require("path");
var http = require("http");
var prefix = require("./config").prefix;
var Discord = require("discord.js");
var PORT = process.env.PORT || 3000;
var server = http.createServer(function (req, res) {
    req;
    var client = new Discord.Client();
    client.commands = new Discord.Collection();
    var commandFiles = fs
        .readdirSync(__dirname + "/commands")
        .filter(function (file) { return file.endsWith(".js"); });
    for (var _i = 0, commandFiles_1 = commandFiles; _i < commandFiles_1.length; _i++) {
        var file = commandFiles_1[_i];
        var command = require("./commands/" + file);
        client.commands.set(command.name, command);
    }
    client.on("message", function (message) {
        if (!message.content.startsWith(prefix) || message.author.bot)
            return;
        var args = message.content.slice(prefix.length).split(/ +/);
        var commandName = args.shift().toLowerCase();
        if (!client.commands.has(commandName)) {
            return;
        }
        var command = client.commands.get(commandName);
        try {
            command.execute(message, args);
        }
        catch (error) {
            console.error(error);
            message.reply("there was an error trying to execute that command!");
        }
    });
    client.login(process.env.DISCORD_TOKEN);
    return res.end("<h1>App is live</h1>");
});
server.listen(PORT, function () {
    return console.log("The server is running on http://localhost:" + PORT);
});
//# sourceMappingURL=app.js.map