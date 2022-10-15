const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'top',
    disabled: "false",
    description: "Check coins top",
    async execute(client, message, args) {
        let topUserList = await global.UserRepository.GetTopCoins();

        var sb = "";
        for(let i = 0; i<10; i++) { sb += "**#" + (i+1) + "** " + topUserList[i].userName + " Bank: **" + topUserList[i].bank + "**\n";}

        var sEmbed = new MessageEmbed()
                .setColor("#1aa2c7")
                .addField("Top Coins in bank", sb, true)
                .addField("\u200B", "\u200B", true)
                if (global.GamesDb.topCoinflip.user != null) sEmbed.addField("Top Earning coinflip", "**" + global.GamesDb.topCoinflip.user.userName + "**\tCoins won: **" + global.GamesDb.topCoinflip.coins + "**")
                sEmbed.setTimestamp();
            
        message.channel.send({ embeds: [sEmbed] })
    }
}