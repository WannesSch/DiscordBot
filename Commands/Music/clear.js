module.exports = {
    name: 'clear',
    aliases: ['cq'],
    utilisation: '{prefix}clear',
    description: "Clear the song queue",
    voiceChannel: true,

    async execute(client, message) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`No music currently playing ${message.author}... try again.`);

        if (!queue.tracks[0]) return message.reply(`No music in the queue after the current one ${message.author}... try again.`);

        await queue.clear();

        message.reply(`The queue has just been cleared`);
    },
};