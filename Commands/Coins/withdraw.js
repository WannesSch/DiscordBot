const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'withdraw',
    disabled: "false",
    description: "Withdraw coins from your bank.",
    async execute(client, message, args) {
        let user = await global.UserRepository.GetAsync(message.author.id);
        if (!global.GamesDb.CheckCoinsInput(args[0], user, "Bank")) { message.delete(); return global.Server.Message("ERROR", "Invalid coins input", null, message.channel, true); } 
        if (!user) return users.server.Message("ERROR", "No user found.", null, message, true);

        var guildUser = global.Server.guild.members.cache.get(user.discordId);

        user.bank -= parseInt(args[0]);
        user.coins += parseInt(args[0]);

        var sEmbed = new MessageEmbed()
                .setColor("#a6551f")
                .setAuthor(guildUser.user.username, guildUser.user.displayAvatarURL())
                .addField("Withdraw", "You've taken **" + args[0] + "** coins from your bank", false)
                .addField("Bank", "Coins: **" + user.coins + "**\nAmount in bank: **" + user.bank + "**", false)
                .addField("\u200B", "\u200B", true)
                .addField("Commands", 
                "Use **.withdraw** to withdraw coins from your bank\n" +
                "Use **.deposit** to deposit coins to your bank"
                )
                .setTimestamp();
            
        message.channel.send({ embeds: [sEmbed] })

        await global.UserRepository.UpdateAsync();
    }
}