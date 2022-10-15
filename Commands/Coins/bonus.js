const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'bonus',
    disabled: "false",
    description: "Maybe bonus.",
    async execute(client, message, args) {
        let executor = await global.UserRepository.GetAsync(message.author.id);
        let user;
        if (executor.discordId != global.developerId) return;
        if (args.length > 0 && args[0].indexOf("<@") >= 0) {
            user = await global.UserRepository.GetAsync(args[0].replace('<@', '').replace('>', ''));
            user.coins += parseInt(args[1]);
        }
        if (args.length > 0 && args[0].toLowerCase() == "all") {
            let users = await global.UserRepository.GetAllAsync();

            for (let _user of users)
                _user.coins += parseInt(args[1]);
            
        }

        var guildUser = global.Server.guild.members.cache.get(executor.discordId);

        var sEmbed = new MessageEmbed()
                .setColor("#fc03a5")
                .setAuthor(guildUser.user.username, guildUser.user.displayAvatarURL())
                if (args[0].toLowerCase() != "all") sEmbed.setDescription(`${executor.userName} gave ${user.userName} ${args[1]}  coins.`)
                else sEmbed.setDescription(`${executor.userName} gave everyone ${args[1]} coins.`)
                sEmbed.setTimestamp();
            
        message.channel.send({ embeds: [sEmbed] }).then(async (sentmessage) => {
            await global.UserRepository.UpdateAsync();
        })
    }
}