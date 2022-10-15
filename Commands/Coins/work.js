const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'work',
    disabled: "false",
    description: "Work for coins. **Jobs:**\n- Cleaning lady **[150 Coins]**\n- 9-5 Slave (Jekkes, Peppah) **[250 Coins]**\n- Steal phone **[500 Coins]**\n- Sell drugs **[1000 Coins]**\n- Rob a bank **[5000 Coins]**",
    async execute(client, message, args) {
        let user = await global.UserRepository.GetAsync(message.author.id);
        if (!user) return global.Server.Message("ERROR", "No user found.", null, message, true);

        let cooldown = global.config.settings.timeouts.work * 60 * 60 * 1000;

        if (user.lastWork == null || (user.lastWork + cooldown) <= Date.now()) {
            let randomJob = global.Jobs.GetRandomJobByWeight();
            user.coins += randomJob.coins;
            user.lastWork = Date.now();
            return global.Server.Message("Work " + user.userName, "You have worked as a " + randomJob.name + ". You've gained **" + randomJob.coins + "** coins.", "#30c296", message.channel, false);
        }

        let timeObj = (cooldown - (Date.now() - user.lastWork));
        let timeleft = msToTime(timeObj);

        await global.UserRepository.UpdateAsync().then(() => {
            return global.Server.Message("Work " + user.userName, "You already worked.\n**" + timeleft + "** before you can work again.", "#731c06", message.channel, false);
        })

        
        console.log();
    }
}


function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds;
  }