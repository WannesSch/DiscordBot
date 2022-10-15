const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'deposit',
    disabled: "false",
    description: "Deposit coins to your bank.",
    async execute(client, message, args) {
        let user = await global.UserRepository.GetAsync(message.author.id);
        if (!global.GamesDb.CheckCoinsInput(args[0], user, "Coins")) { message.delete(); return global.Server.Message("ERROR", "Invalid coins input", null, message.channel, true); } 
        if (!user) return global.Server.Message("ERROR", "No user found.", null, message, true);

        var guildUser = global.Server.guild.members.cache.get(user.discordId);

        user.bank += parseInt(args[0]);
        user.coins -= parseInt(args[0]);

        var sEmbed = new MessageEmbed()
                .setColor("#d4a706")
                .setAuthor(guildUser.user.username, guildUser.user.displayAvatarURL())
                .addField("Deposit", "You've added **" + args[0] + "** coins to your bank", false)
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