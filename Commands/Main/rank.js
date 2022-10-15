const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'rank',
    description: "Check user rank Ex .rank (@Jwakkes) tag not required.",
    async execute(client, message, args) {
        let sEmbed = new MessageEmbed()
        let user = await global.UserRepository.GetAsync(message.author.id);
        var thirdPerson = false;
        if (args.length > 0 && args[0].indexOf("<@") >= 0) { user = await global.UserRepository.GetAsync(args[0].replace('<@', '').replace('>', '')); thirdPerson = true;}
        if (user == null) {
            sEmbed.setColor('RED')
                .setTitle("Internal Server Error")
                .setDescription("No user found with discordID " + message.author.id)
                .setTimestamp()

            message.channel.send({ embeds: [sEmbed] });
            return;
        }
        sEmbed.setColor("PURPLE")
        .setTitle("**Rank " + user.userName + "**")

        if (thirdPerson) sEmbed.setDescription(user.userName + "' rank is **" + user.rank + ".** Which is **#" + await global.UserRepository.FindUserIndexOnLeaderboard(user.discordId) + "** on the leaderboard.\n\n" + user.experience + "/" + user.requiredExperience + " (" + parseInt(user.requiredExperience - user.experience) + "XP required to rank up)")
        else sEmbed.setDescription("Your rank is **" + user.rank + ".** Which makes you **#" + await global.UserRepository.FindUserIndexOnLeaderboard(user.discordId) + "** on the leaderboard.\n\n" + user.experience + "/" + user.requiredExperience + " (" + parseInt(user.requiredExperience - user.experience) + "XP required to rank up)")
        sEmbed.setTimestamp();

        message.channel.send({ embeds: [sEmbed] });
    }
}