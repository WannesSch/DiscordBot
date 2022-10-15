const { QueryType } = require('discord-player');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'play',
    aliases: ['p'],
    utilisation: '{prefix}play [song name/URL]',
    description: "Play music",
    voiceChannel: true,

    async execute(client, message, args) {
        if (!args[0]) return message.reply(`Please enter a valid search ${message.author}... try again.`);

        const res = await player.search(args.join(' '), {
            requestedBy: message.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return message.reply(`No results found ${message.author}... try again.`);

        const queue = await player.createQueue(message.guild, {
            metadata: message.channel
        });

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            await player.deleteQueue(message.guild.id);
            return message.reply(`I can't join the voice channel ${message.author}... try again.`);
        }

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);
        const track = queue.current;
        
        const methods = ['disabled', 'track', 'queue'];

        const timestamp = queue.getPlayerTimestamp();
        const trackDuration = timestamp.progress == 'Infinity' ? 'infinity (live)' : track.duration;
        const progress = queue.createProgressBar();
        
        if (!queue.playing) {
            await queue.play();
            var sEmbed = new MessageEmbed()
                .setColor("#1364cf")
                .setAuthor(track.title, message.author.avatarURL({ dynamic: true }))
                .setImage(track.thumbnail)
                .addField("Info", `Volume **${queue.volume}**%\nDuration **${trackDuration}**\nLoop mode **${methods[queue.repeatMode]}**\nRequested by ${track.requestedBy}`)
                .addField("Bar", `${progress} (**${timestamp.progress}**%)`)
                .setFooter('Choupaware music', client.user.displayAvatarURL({ size: 1024, dynamic: true }))
                .setTimestamp();

            message.channel.send({ embeds: [sEmbed] });
            message.delete(1000);
        }
    },
};