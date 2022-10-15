const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    disabled: "false",
    description: "Get a list of commands",
    async execute(client, message, args) {
        var sb = "";

        const load_command_dir = (dirs) => {
            var dir = `../${dirs}`;
            const command_files  = fs.readdirSync(`../Commands/${dirs}`).filter(file => file.endsWith('.js'));
            if (command_files.length != 0) sb += `\n**${dirs}**\n`;
            command_files.forEach(file => {
                var command = require(`../${dirs}/${file}`);
                if (command.name == "messagehandler") return;
                if (command.disabled == "true") return;
                if (command.name) sb += `**.${command.name}** ${command.description}\n`;
                else return;
            });
        }
        
        [ "Main", "Games", "Coins"].forEach(e => load_command_dir(e));
        global.Server.Message("**Help**", sb, "#c22139", message.channel, false);
    }
}