const { MessageEmbed, Permissions } = require('discord.js');
const { server } = require('../../Classes/Server.js')
const ms = require('ms');

module.exports = {
    name: 'ban',
    disabled: "true",
    description: "Ban Users Ex .ban @Jwakkes 4 (Rank #1 only)\nUsage: .ban <user> <time in minutes> <reason>",
    async execute(client, message, args) {
        if(!message.member.roles.cache.some(role => role.name === '#1')) return users.server.Message("ERROR", "You have to be first on the leaderboard in order to use this command.", null, message, true);
        if (!args[0]) return users.server.Message("ERROR", "Please tag to user you want to ban.", null, message, true);
        if (args[0].indexOf("<@!") < 0) return users.server.Message("ERROR", "Please tag to user you want to ban.", null, message, true);
        
        var userID = args[0].replace('<@!', '').replace('>', '');
        var guildUser = message.guild.members.cache.get(userID);
        if (!guildUser) return users.server.Message("ERROR", "This user doesn't exists.", null, message, true);
        if (guildUser.user.id == message.author.id) return users.server.Message("ERROR", "You tried to ban youself, you fucking retoid.", null, message, true);
        if (guildUser.user.id == "920470204176302111") return users.server.Message("ERROR", "No ban me, you fucking retoid.", null, message, true);

        if (guildUser.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) return users.server.Message("ERROR", "You can't ban this user.", null, message, true);
        if (!args[1]) return users.server.Message("ERROR", "Please enter a time.", null, message, true);
        if (!args[2]) return users.server.Message("ERROR", "Please enter a reason.", null, message, true);
        if (parseInt(args[1]) > 2880) return users.server.Message("ERROR", "You can only ban users for 48 Hours", null, message, true);

        if (ms(args[1])) {
            var sEmbed = new MessageEmbed()
                .setColor("#ab0014")
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setThumbnail(guildUser.user.displayAvatarURL())
                .addField("Banned user", guildUser.user.username, true)
                .addField("\u200B", "\u200B", true)
                .addField("Reason", args[2])
                .addField("Time", args[1] + " Minute(s)")
                .setFooter(`Banned by ${message.author.username}`)
                .setTimestamp();
            
            guildUser.send({ embeds: [sEmbed] })
            setTimeout(() => {
                guildUser.ban({ days: 7, reason: args[2] })
                .then(bannedUser => {
                        server.modChannel.send({ embeds: [sEmbed] });
                        message.channel.send({ embeds: [sEmbed] });
                   
                    setTimeout(() => {
                        try {
                            guildUser.guild.members.unban(userID)
                            .then(user => {
                                var sEmbed = new MessageEmbed()
                                    .setColor("#00522a")
                                    .setThumbnail(user.displayAvatarURL())
                                    .setTitle("Unbanned")
                                    .addField("Unbanned user", user.username, true)
                                    .addField("\u200B", "\u200B", true)
                                    .addField("Reason", 'Time has ran out.')
                                    .addField("Time", "Was banned for " + args[1] + " Minute(s)")
                                    .setFooter(`Banned by ${message.author.username}`)
                                    .setTimestamp();

                                message.channel.send({ embeds: [sEmbed] });
                                server.modChannel.send({ embeds: [sEmbed] });
                            })
                            .catch(console.error);
                        } catch (err) {console.error(err)}
                        
                    }, args[1] * 60 * 1000);
                })
                .catch((err) => {
                    var sEmbed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle("ERROR while unbanning " + user.username)
                        .setDescription(err)
                        .setFooter(`Banned by ${message.author.username}`)
                        .setTimestamp();

                    server.modChannel.send({ embeds: [sEmbed] });
                    console.error(err);
                });
            }, 1000); 
        }
    }
}