const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'leaderboard',
    disabled: "false",
    description: "See leaderboard",
    async execute(client, message, args) {
        let leaderBoard = await global.UserRepository.UpdateLeaderboardAsync();

        var sb = "";
        for(let i = 0; i<10; i++) { sb += "**#" + (i+1) + "** " + leaderBoard[i].userName + " Rank: **" + leaderBoard[i].rank + "** XP: **"+ leaderBoard[i].experience + "**\n";}

        global.Server. Message("LeaderBoard", sb, "#1b5770", message.channel, false);
    }
}