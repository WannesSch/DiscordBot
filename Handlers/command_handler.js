const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = (client, Discord) => {
    const load_command_dir = (dirs) => {
        const command_files  = fs.readdirSync(`../Commands/${dirs}`).filter(file => file.endsWith('.js'));

        command_files.forEach(file => {
            var command = require(`../Commands/${dirs}/${file}`);
            if (command.disabled == "true") return;
            if (command.name) client.commands.set(command.name, command);
            else return;
        });
    }
    
    ["Games", "Main", "Coins"].forEach(e => load_command_dir(e));
}