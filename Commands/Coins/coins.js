const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'coins',
    disabled: "false",
    description: "Check your coins.",
    async execute(client, message, args) {
        let user = await global.UserRepository.GetAsync(message.author.id);
        if (args.length > 0 && args[0].indexOf("<@") >= 0) user = await global.UserRepository.GetAsync(args[0].replace('<@', '').replace('>', ''));

        if (!user) return global.Server.Message("ERROR", "No user found.", null, message, true);

        var guildUser = global.Server.guild.members.cache.get(user.discordId);

        var sEmbed = new MessageEmbed()
                .setColor("#42065c")
                .setAuthor(guildUser.user.username, guildUser.user.displayAvatarURL())
                .addField("Coins", user.coins + "", true)
                .addField("\u200B", "\u200B", true)
                .addField("Commands", 
                    "Use **.withdraw** to withdraw coins from your bank\n" +
                    "Use **.deposit** to deposit coins to your bank" 
                )
                .setTimestamp();
            
        message.channel.send({ embeds: [sEmbed] })
    }
}