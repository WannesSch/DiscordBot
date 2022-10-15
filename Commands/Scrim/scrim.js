const { scrims, Scrim } = require("../../Classes/Scrims");
const { MessageEmbed } = require('discord.js');
const { VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
    name: 'scrim',
    disabled: "true",
    description: "Start a scrim",
    async execute(client, message, args) {
        if (message.member?.voice.channel == null) return message.reply("You have to be in a voicechannel to start a scrim.");
        if(!args[0]) return message.reply("Please select a game **CSGO | Valorant ** <Ex. .Scrim csgo>");

        var scrim = scrims.AddScrim(message, args[0]);
    
        var callback = scrim.Scramble(message.member?.voice.channel);
        if (callback[0]) scrim.SetupScrim(message.guild);


        var sb = "";
        sb += "";


        message.channel.send({ embeds: [callback[1]] });
        console.log(scrims)
    }
}