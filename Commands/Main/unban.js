const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unban',
    disabled: "true",
    description: "Unban users Ex .ban @Jwakkes",
    async execute(client, message, args) {
        if(!message.member.roles.cache.some(role => role.name === '#1')) return message.reply("You have to be first on the leaderboard in order to use this command.");
    }
}