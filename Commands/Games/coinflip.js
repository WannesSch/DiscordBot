const { MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Coinflip } = require('../../Models/Games/Coinflip.js');


module.exports = {
    name: 'coinflip',
    disabled: "false",
    description: "Flippin",
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

        let guildUser = global.Server.guild.members.cache.get(user.discordId);

        await user.GetThread(message.channel);
        let game = new Coinflip(user, args[0], message);
        global.GamesDb.Create(game);

        let previousRolls = ``;
        for(let i = 0; i<global.GamesDb.previousCoinflips.length; i++) {
            switch(global.GamesDb.previousCoinflips[i]) {
                case "Green": previousRolls += `${global.Server.Emojis.coins.green}`; break;
                case "Red": previousRolls += `${global.Server.Emojis.coins.red}`; break;
            }
        }
        const file = new MessageAttachment('../Images/coinWhite.png');
        var sEmbed = new MessageEmbed()
                .setColor("#d4a706")
                .setAuthor(game.gameId, guildUser.user.displayAvatarURL())
                .setThumbnail('attachment://coinWhite.png')
                .addField("Bet", "**" + game.bet + "** Coin(s)", false)
                .addField("Bets", `
                    ${global.Server.Emojis.coins.green} Bet x2 **possible coins: ${game.bet * 2}**
                    ${global.Server.Emojis.coins.red} Bet x2 **possible coins: ${game.bet * 2}**` 
                    , false)
                if (global.GamesDb.previousCoinflips.length != 0) sEmbed.addField("Previous flips", `${previousRolls}`, false)
                sEmbed.setTimestamp();

        const row = new MessageActionRow().addComponents(
            new MessageButton()
					.setCustomId('coinflip-Green-' + game.gameId)
					.setStyle('SUCCESS')
                    .setLabel('Green 50%')
                    .setEmoji(global.Server.Emojis.coins.green.id),

            new MessageButton()
					.setCustomId('coinflip-Red-' + game.gameId)
					.setStyle('DANGER')
                    .setLabel('Red 50%')
                    .setEmoji(global.Server.Emojis.coins.red.id)
        );

        
        user.thread.send({ embeds: [sEmbed], components: [row], files: [file] }).then(sentEmbed => {
            game.embed = sentEmbed;
        });

        
    }
}