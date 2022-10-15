const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'info',
    disabled: "true",
    description: "Check user info Ex .info (@Jwakkes) tag not required.",
    async execute(client, message, args) {
        var sEmbed = new MessageEmbed()

        var guildMember = users.server.guild.members.cache.get(message.author.id);
        var thirdPerson = false;
        if (args.length > 0 && args[0].indexOf("<@!") >= 0) {guildMember = users.server.guild.members.cache.get(args[0].replace('<@!', '').replace('>', '')); thirdPerson = true;}

        if (guildMember == null) {
            sEmbed.setColor('RED')
                .setTitle("Internal Server Error")
                .setDescription("No user found")
                .setTimestamp()

            message.channel.send({ embeds: [sEmbed] });
            return;
        }

        var date = new Date(guildMember.joinedTimestamp);
        const joinDate = ("0" + date.getDate()).slice(-2) + 
                "/" + ("0" + (date.getMonth() + 1)).slice(-2) + 
                "/" + date.getFullYear() + 
                " | " + date.getHours() + 
                ":" + date.getMinutes() + 
                ":" + date.getSeconds();

        var user = users.FindUserByDiscordID(guildMember.user.id);
        if (user == null) {
            sEmbed.setColor('RED')
                .setTitle("Internal Server Error")
                .setDescription("No user found with discordID " + message.author.id)
                .setTimestamp()

            message.channel.send({ embeds: [sEmbed] });
            return;
        }
        
        if (thirdPerson) {
            sEmbed.setColor("#323ca8")
            .setTitle(guildMember.user.username + "'s Info")
            .setThumbnail(guildMember.user.displayAvatarURL())
            .addField("User Info", "Join Date: " + joinDate, true)
            .setTimestamp();
        }
        else {
            sEmbed.setColor("#323ca8")
            .setTitle(guildMember.user.username + "'s Info")
            .setThumbnail(guildMember.user.displayAvatarURL())
            .addField("General user Info", "Nickname: " + guildMember.nickname + "\nJoin Date: " + joinDate + "", false)
            .addField("Server user Info", "Rank: " + user.rank + "\nExperience: " + user.experience + "/" + user.requiredXP + "", false)
            .setTimestamp();
        }

        message.channel.send({ embeds: [sEmbed] })
    }
}