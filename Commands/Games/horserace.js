const { MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { HorseRace } = require('../../Models/Games/HorseRace.js');


module.exports = {
    name: 'carrace',
    disabled: "false",
    description: "CarRace usage: **.carrace <Bet>**",
    async execute(client, message, args) {
        let user = await global.UserRepository.GetAsync(message.author.id);

        if (global.isInDevMode) {
            if (user.discordId != global.developerId) {
                message.delete(); 
                return global.Server.Message("ERROR", "MAYBE I WORK ON IT", null, message.channel, true);
            }
        }

        if (!user) { message.delete(); return global.Server.Message("ERROR", "No user found.", null, message.channel, true); }
        
        if (global.GamesDb.CheckIfUserIsInGame(user)) { message.delete(); return global.Server.Message("ERROR", "You're already ingame, wait for your game to finish", null, message.channel, true); }
    
        if (!global.GamesDb.CheckCoinsInput(args[0], user, "Coins")) { message.delete(); return global.Server.Message("ERROR", "Invalid coins input", null, message.channel, true); }

        if (parseInt(args[0]) > 3000) { message.delete(); return global.Server.Message("ERROR", "You can only bet 3000 on a horse.", null, message.channel, true); }
        await user.GetThread(message.channel);
        let game = new HorseRace(user, args[0], message);
        game.CreateRace(client);
        global.GamesDb.Create(game);
        
    }
}

