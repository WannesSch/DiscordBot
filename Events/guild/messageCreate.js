module.exports = (Discord, client, message) => {
    if (message.author.bot) return;
    
    if (!message.content.startsWith(client.config.app.px)) {
        var command = client.commands.get("messagehandler")
        if (command) command.execute(client, message, args, Discord);
        return;
    }

    var args = message.content.slice(1, message.content.length).split(" ");
    var cmd = args.shift().toLowerCase();
    
    var command = client.commands.get(cmd) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmd));
    
    if (command) command.execute(client, message, args);
}