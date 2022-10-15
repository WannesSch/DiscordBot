module.exports = {
    name: 'pause',
    aliases: [],
    utilisation: '{prefix}pause',
    description: "Pause music",
    voiceChannel: true,

    execute(client, message) {
        const queue = player.getQueue(message.guild.id);

        if (!queue) return message.reply(`No music currently playing ${message.author}... try again.`);

        const success = queue.setPaused(true);

        return message.reply(success ? `Current music ${queue.current.title} paused ✅` : `Something went wrong ${message.author}... try again.`);
    },
};