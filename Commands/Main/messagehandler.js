const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'messagehandler',
    disabled: 'false',
    description: "Message Handler.",
    async execute(client, message, args) {
        if (message.author.bot) return;
        let user = await global.UserRepository.GetAsync(message.author.id)
        if (user == null) return;
        await user.AddExperienceToUser(message, false, 1);
    }
}