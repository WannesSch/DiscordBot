const { Blackjack } = require("../../Models/Games/Blackjack");
const { ChannelType } = require('discord.js');

module.exports = {
    name: 'blackjack',
    disabled: "false",
    description: "Blockjock",
    async execute(client, message, args) {
        let user = await global.UserRepository.GetAsync(message.author.id);

        if (global.isInDevMode) {
            if (user.discordId != global.developerId && user.discordId != "367747959158341634") {
                message.delete(); 
                return global.Server.Message("ERROR", "MAYBE I WORK ON IT", null, message.channel, true);
            }
        }

        if (!user) { message.delete(); return global.Server.Message("ERROR", "No user found.", null, message.channel, true); }

        if (global.GamesDb.CheckIfUserIsInGame(user)) { message.delete(); return global.Server.Message("ERROR", "You're already ingame, wait for your game to finish", null, message.channel, true); }
    
        if (!global.GamesDb.CheckCoinsInput(args[0], user, "Coins")) { message.delete(); return global.Server.Message("ERROR", "Invalid coins input", null, message.channel, true); }

        await user.GetThread(message.channel);

        let game = new Blackjack(user, args[0], global.Server.guild.members.cache.get(user.discordId));
        global.GamesDb.Create(game);

        game.CreateGame();
    }
}