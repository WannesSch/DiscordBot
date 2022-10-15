
module.exports = (Discord, client, interaction) => {
    interaction.deferUpdate()
        .then()
        .catch(console.error);
    if(interaction.isCommand()) {
        if(interaction.commandName === 'play') {
           const channel = interaction.member.voice.channel;
           const song = interaction.options.getString('song');

           music.play({
               interaction: interaction,
               channel: channel,
               song: song
           });
        };
    };
    
    if (interaction.customId.indexOf("coinflip-") >= 0) {
        let game = global.GamesDb.GetGameById(interaction.customId.split('-')[2]);
        if (interaction.user.id != game.user.discordId) return;
        game.Flip(interaction.customId.split('-')[1])
        interaction.message.components[0].components.forEach(button => { button.disabled = true; });;
        game.embed.edit({ embeds: [game.embedBuilder], components: [interaction.message.components[0]]}).then(sentEmbed => { });
    }

    if (interaction.customId.indexOf("dealnodeal-") >= 0) {
        let game = global.GamesDb.GetGameById(interaction.customId.split('-')[2]);
        if (interaction.user.id != game.user.discordId) return;
        let userChoice = interaction.customId.split('-')[1];
        if (userChoice == "Deal") game.Deal();
        else if (userChoice == "NoDeal") game.NoDeal();
        else game.SuddenDeath(userChoice);
        interaction.message.components[0].components.forEach(button => { button.disabled = true; });;
        game.embed.edit({ embeds: [game.embedBuilder], components: [interaction.message.components[0]]}).then(sentEmbed => { });
    }

    if (interaction.customId.indexOf("carrace-") >= 0) {
        let game = global.GamesDb.GetGameById(interaction.customId.split('-')[2]);
        if (interaction.user.id != game.user.discordId) return;
        let userChoice = interaction.customId.split('-')[1];
        game.UpdateRace(userChoice);
        interaction.message.components[0].components.forEach(button => { button.disabled = true; });;
        game.embed.edit({ embeds: [game.embedBuilder], components: [interaction.message.components[0]]}).then(sentEmbed => { });
    }

    if (interaction.customId.indexOf("shop-") >= 0) {
        var btn = interaction.customId.split('-')[1]
        let game = global.GamesDb.GetGameById(interaction.customId.split('-')[2]);
        if (interaction.user.id != game.user.discordId) return;
        game.Shop(btn);

        interaction.message.components[0].components.forEach(button => { button.disabled = true; });
        game.embed.edit({ embeds: [game.embedBuilder], components: [interaction.message.components[0]]}).then(sentEmbed => { });
    }

    if (interaction.customId.indexOf("blackjack-") >= 0) {
        let btn = interaction.customId.split('-')[1]
        let game = global.GamesDb.GetGameById(interaction.customId.split('-')[2]);
        if (interaction.user.id != game.user.discordId) return;

        switch(btn) {
            case "Stand": game.Stand(); break;
            case "Hit": game.Hit(); break;
            case "Insure": game.Insure(); break;
            case "Double": game.DoubleDown(); break;
            case "Cancel": game.Cancel(); break;
        }
    
        interaction.message.components[0].components.forEach(button => { button.disabled = true; });;
        game.embed.edit({ embeds: [game.embedBuilder], components: [interaction.message.components[0]]}).then(sentEmbed => { });
    }
}
