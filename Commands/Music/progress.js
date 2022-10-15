module.exports = {
    name: 'progress',
    aliases: ['pbar'],
    utilisation: '{prefix}progress',
    description: "Get the progress of current playing song",
    voiceChannel: true,

    async execute(client, message) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`No music currently playing ${message.author}... try again.`);

        const progress = queue.createProgressBar();
        const timestamp = queue.getPlayerTimestamp();

        if (timestamp.progress == 'Infinity') return message.reply(`Playing a live, no data to display`);

        message.channel.send(`${progress} (**${timestamp.progress}**%)`);
    },
};