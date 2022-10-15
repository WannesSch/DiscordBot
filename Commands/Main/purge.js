module.exports = {
    name: 'purge',
    disabled: "true",
    description: "Clear messages! Ex .clear 10 (admin only)",
    async execute(client, message, args) {
        if (message.author.id != "252515845001969664") return;
        if(!args[0]) return message.reply("Please enter the amount of messages to be deleted.");
        if (isNaN(args[0])) return message.reply('Please enter a number.');

        if (args[0] > 100) return message.reply("You cannot delete more than 100 messages.");
        if (args[0] < 1) return message.reply("You must delete more than 1 message.");

        try {
            await message.channel.bulkDelete(args[0], false);
            message.channel.send("Deleted " + args[0] + " messages");
          } catch(error) {
            message.channel.send("Can't delete messages");
          }
    }
}