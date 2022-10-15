const { Shop } = require('../../Models/Games/Shop.js');
const { MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'shop',
    disabled: "false",
    description: "Exchange your coins for XP",
    async execute(client, message, args) {
        let user = await global.UserRepository.GetAsync(message.author.id);

        if (global.isInDevMode) {
            if (user.discordId != global.developerId) {
                message.delete(); 
                return global.Server.Message("ERROR", "MAYBE I WORK ON IT", null, message.channel, true);
            }
            if (message.channel.id != global.Server.modChannel.id) { 
                message.delete(); return global.Server.Message("ERROR", "You can only use this command in #mod", null, message.channel, true); 
            }
        }
        else {
            if (message.channel.id != global.Server.gamesChannel.id) { 
                message.delete(); return global.Server.Message("ERROR", "You can only use this command in #games", null, message.channel, true); 
            }
        }

        if (!user) { message.delete(); return global.Server.Message("ERROR", "No user found.", null, message.channel, true); }
        if (global.GamesDb.CheckIfUserIsInGame(user)) { message.delete(); return global.Server.Message("ERROR", "You're already ingame, wait for your game to finish", null, message.channel, true); }
    
        if (!global.GamesDb.CheckCoinsInput(args[0], user, "Coins")) { message.delete(); return global.Server.Message("ERROR", "Invalid coins input", null, message.channel, true); } 


        let game = new Shop(user, args[0], message, Math.ceil(parseInt(args[0] / 4)));
        global.GamesDb.Create(game);

        let guildUser = global.Server.guild.members.cache.get(user.discordId);
        game.embedBuilder = new MessageEmbed()
                .setColor("#068f4f")
                .setAuthor(guildUser.user.username + " Shop", guildUser.user.displayAvatarURL())
                .addField("Amount of coins", game.bet + "", false)
                .addField("Amount of XP", game.amountOfXp + "", false)
                .addField("\u200B", "\u200B", false)
                .addField("Confirm", "Press **YES** to confirm your transaction\nPress **NO** to cancel transaction", false)
                .setTimestamp();


                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                            .setCustomId('shop-Confirm-' + game.gameId)
                            .setStyle('SUCCESS')
                            .setLabel('YES'),

                    new MessageButton()
                            .setCustomId('shop-Reject-' + game.gameId)
                            .setStyle('DANGER')
                            .setLabel('NO')
                    );
        
                
                message.channel.send({ embeds: [game.embedBuilder], components: [row] }).then(sentEmbed => { game.embed = sentEmbed; });
    }
}