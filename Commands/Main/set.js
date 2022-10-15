module.exports = {
    name: 'set',
    disabled: "true",
    description: "Soon",
    async execute(client, message, args) {
        if(message.author.id != "252515845001969664")   return users.server.Message("ERROR", "You can't use this command", null, message, true);
        if (!args[0])                                   return users.server.Message("ERROR", "Select a type <coins/bank>", null, message, true);
        if (!args[1])                                   return users.server.Message("ERROR", "Tag a user to set coins/bank", null, message, true);
        if (!args[2])                                   return users.server.Message("ERROR", "Give a amount", null, message.channel, true);
        if (isNaN(args[2]))                             return users.server.Message("ERROR", "Amount needs to be a number", null, message, true);

        if (args[1] == "*") {
            if (args[0] != "coins") {
                if (args[0] != "bank") return users.server.Message("ERROR", "Type is not coins or bank.", null, message, true);
                return users.server.Message("ERROR", "Type is not coins or bank.", null, message, true);
            }
            users.userList.forEach(user => {
                if (args[0] == 'coins') user.coins = parseInt(args[2]);
                else if (args[0] == 'bank') user.bank = parseInt(args[2]);
            });
            users.server.Message(args[0], "Everyone's " + args[0] + "  are set to " + args[2], "#149c2d", message, true);
            users.UpdateJSON();
        }
        else {
            var user = users.FindUserByDiscordID(args[1].replace('<@!', '').replace('>', ''));
            if (!user) return users.server.Message("ERROR", "No user found.", null, message, true);
    
            if (args[0] == 'coins') user.coins = parseInt(args[2]);
            else if (args[0] == 'bank') user.bank = parseInt(args[2]);
            else return users.server.Message("ERROR", "Type is not coins or bank.", null, message, true);
            users.server.Message(args[0] + " " + user.name, user.name + "' " + args[0] + " are set to " + args[2], "#149c2d", message, true);
            users.UpdateJSON();
        }
    }
}