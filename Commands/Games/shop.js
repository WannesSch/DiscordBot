const { MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'shop',
    disabled: "true",
    description: "Exchange your coins for XP",
    async execute(client, message, args) {
        var user = users.FindUserByDiscordID(message.author.id);
        if (!user) return users.server.Message("ERROR", "No user found.", null, message, true);
        if (user.isShopping) return users.server.Message("ERROR", "You already started an exchange.", null, message, true);

        if(!args[0]) return users.server.Message("ERROR", "Give a amount of coins.", null, message, true);
        if (isNaN(args[0])) return users.server.Message("ERROR", "Amount must be a number.", null, message, true);
        args[0] = parseInt(args[0]);
        if(args[0] > user.coins) return users.server.Message("ERROR", "You dont have enough coins.", null, message, true);

    
        var amountOfXp = Math.ceil(parseInt(args[0] / 2))

        var guildUser = users.server.guild.members.cache.get(user.discordid);
        var sEmbed = new MessageEmbed()
                .setColor("#068f4f")
                .setAuthor(guildUser.user.username + " Shop", guildUser.user.displayAvatarURL())
                .addField("Amount of coins", args[0] + "", false)
                .addField("Amount of XP", amountOfXp + "", false)
                .addField("\u200B", "\u200B", false)
                .addField("Confirm", "Press **YES** to confirm your transaction\nPress **NO** to cancel transaction", false)
                .setTimestamp();


                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                            .setCustomId('shop-Confirm-' + user.discordid + "-" + args[0])
                            .setStyle('SUCCESS')
                            .setLabel('YES'),

                    new MessageButton()
                            .setCustomId('shop-Reject-' + user.discordid + "-" + args[0])
                            .setStyle('DANGER')
                            .setLabel('NO')
                    );
        
                
                message.channel.send({ embeds: [sEmbed], components: [row] }).then(sentEmbed => {
                    user.isShopping = true;
                    users.UpdateJSON();
                });
    }
}