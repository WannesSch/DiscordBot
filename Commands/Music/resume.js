module.exports = {
    name: 'resume',
    aliases: ['rs'],
    utilisation: '{prefix}resume',
    description: "Continue playing songs",
    voiceChannel: true,

    execute(client, message) {
        const queue = player.getQueue(message.guild.id);

        if (!queue) return message.reply(`No music currently playing ${message.author}... try again.`);

        const success = queue.setPaused(false);

        return message.reply(success ? `Current music ${queue.current.title} resumed ✅` : `Something went wrong ${message.author}... try again.`);
    },
};