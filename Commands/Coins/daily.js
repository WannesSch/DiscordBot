module.exports = {
    name: 'daily',
    disabled: "false",
    description: "Claim your daily coins.",
    async execute(client, message, args) {
        let user = await global.UserRepository.GetAsync(message.author.id);
        if (!user) return global.Server.Message("ERROR", "No user found.", null, message, true);

        let cooldown = global.config.settings.timeouts.daily * 60 * 60 * 1000;

        if (user.lastDailyClaim == null || (user.lastDailyClaim + cooldown) <= Date.now()) {
            user.coins += global.config.settings.rewards.daily;
            user.lastDailyClaim = Date.now();
            return global.Server.Message("Daily " + user.userName, "You have claimed you daily coins.\nCoins: **" + user.coins + "**", "#06733e", message.channel, false);
        }

        let timeObj = (cooldown - (Date.now() - user.lastDailyClaim));
        let timeleft = msToTime(timeObj);

        await global.UserRepository.UpdateAsync().then(() => {
            return global.Server.Message("Daily " + user.userName, "You already claimed your coins today.\n" + timeleft + " before you can claim your daily coins again.", "#731c06", message.channel, false);
        })
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