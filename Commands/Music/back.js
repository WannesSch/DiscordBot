module.exports = {
    name: 'back',
    aliases: ['previous'],
    description: "Play the previous song.",
    utilisation: '{prefix}back',
    voiceChannel: true,

    async execute(client, message) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`No music currently playing ${message.author}... try again.`);

        if (!queue.previousTracks[1]) return message.reply(`There was no music played before ${message.author}... try again.`);

        await queue.back();

        message.reply(`Playing the **previous** track`);
    },
};