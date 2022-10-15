module.exports = {
    name: 'skip',
    aliases: ['sk'],
    utilisation: '{prefix}skip',
    description: "Skip current song",
    voiceChannel: true,

    execute(client, message) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`No music currently playing ${message.author}... try again.`);

        const success = queue.skip();

        return message.reply(success ? `Current music ${queue.current.title} skipped ✅` : `Something went wrong ${message.author}... try again.`);
    },
};