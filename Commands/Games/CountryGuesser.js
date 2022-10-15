const { MessageAttachment, MessageEmbed } = require('discord.js');
//const sharp = require("sharp");
const { Game } = require('../../Classes/Games');
const { server } = require('../../Classes/Server');


module.exports = {
    name: 'guess',
    disabled: "true",
    description: "false",
    async execute(client, message, args) {
        let game = games.FindGameByUser(message.author.id);
            console.log(game)
        if (!game) {
            game = new Game(games.GetID(), "WorldGuesser", message.author, 0);
            games.StartGame(game);
            const thread = await message.channel.threads.create({
                name: game.type + ' #' + game.id,
                autoArchiveDuration: 60,
                reason: 'Started game ' + game.type + "#" + game.id,
            });
            thread.members.add(message.author.id);

            game.WorldGuesser(thread);
        }
        else {
            args = args.join(" ");
            game.CheckGuess(args);
        }
    }
}