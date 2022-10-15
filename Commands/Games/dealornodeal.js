const { MessageAttachment, MessageEmbed } = require('discord.js');
const { DealOrNoDeal } = require('../../Models/Games/DealNoDeal.js');


module.exports = {
    name: 'dealnodeal',
    disabled: "false",
    description: "Deal or no deal usage: **.dealnodeal <Bet> <Number>**",
    async execute(client, message, args) {
        let user = await global.UserRepository.GetAsync(message.author.id);

        if (global.isInDevMode) {
            if (user.discordId != global.developerId) {
                message.delete(); 
                return global.Server.Message("ERROR", "MAYBE I WORK ON IT", null, message.channel, true);
            }
        }

        if (!user) { message.delete(); return global.Server.Message("ERROR", "No user found.", null, message.channel, true); }

        if (global.GamesDb.CheckIfUserIsInGame(user)) { message.delete(); return global.Server.Message("ERROR", "You're already ingame, wait for your game to finish", null, message.channel, true); }
    
        if (!global.GamesDb.CheckCoinsInput(args[0], user, "Coins")) { message.delete(); return global.Server.Message("ERROR", "Invalid coins input", null, message.channel, true); }

        if (!global.GamesDb.CheckNumberInput(args[1])) { message.delete(); return global.Server.Message("ERROR", "Please enter a (valid) number to bet on.", null, message.channel, true); }

        if (parseInt(args[0]) > 10000) { message.delete(); return global.Server.Message("ERROR", "You can only bet 10000 on deal or no deal.", null, message.channel, true); }

        let guildUser = global.Server.guild.members.cache.get(user.discordId);

        await user.GetThread(message.channel);
        let game = new DealOrNoDeal(user, message, args[0], args[1]);
        global.GamesDb.Create(game);
        game.CreateGame(client);

        let betString = "";
            betString += `Bet: ${game.bet}\n\n`;
            betString += `Possible wins:\n`;
            betString += `Round 1 -> **${Math.floor(game.bet * game.roundMultiplier[1])}**\n`;
            betString += `Round 2 -> **${Math.floor(game.bet * game.roundMultiplier[2])}**\n`;
            betString += `Round 3 -> **${Math.floor(game.bet * game.roundMultiplier[3])}**\n`;
            betString += `Round 4 -> **${Math.floor(game.bet * game.roundMultiplier[4])}**\n`;
            betString += `Round 5 -> **${Math.floor(game.bet * game.roundMultiplier[5])}**`;

        const file = new MessageAttachment('../Images/dealnodeal.png');
        var sEmbed = new MessageEmbed()
                .setColor("#d4a706")
                .setAuthor(game.gameId, guildUser.user.displayAvatarURL())
                .setThumbnail('attachment://dealnodeal.png')
                .addField("Game", game.tileSb, false)
                .addField("Bet", betString, false)
                .setTimestamp();

        user.thread.send({ embeds: [sEmbed], files: [file] }).then(sentEmbed => {
            game.embed = sentEmbed;
            game.CheckRow();
        });

        
    }
}

