const maxVol = 100;

module.exports = {
    name: 'volume',
    aliases: ['vol'],
    utilisation: `{prefix}volume [1-${maxVol}]`,
    description: "Set bot volume 1-100",
    voiceChannel: true,

    execute(client, message, args) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`No music currently playing ${message.author}... try again.`);

        const vol = parseInt(args[0]);

        if (!vol) return message.reply(`The current volume is ${queue.volume} 🔊\n*To change the volume enter a valid number between **1** and **${maxVol}**.*`);

        if (queue.volume === vol) return message.reply(`The volume you want to change is already the current one ${message.author}... try again.`);

        if (vol < 0 || vol > maxVol) return message.reply(`The specified number is not valid. Enter a number between **1** and **${maxVol}** ${message.author}... try again.`);

        const success = queue.setVolume(vol);

        return message.reply(success ? `The volume has been modified to **${vol}**/**${maxVol}**% 🔊` : `Something went wrong ${message.author}... try again.`);
    },
};