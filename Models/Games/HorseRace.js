const progressbar = require('string-progressbar');
const { MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Bar } = require('./Assets/bar');


class HorseRace {
    constructor(_user, _bet, _userMessage) {
        this.user = _user;
        this.type = "CarRace";
        this.bet = _bet;

        this.embed = {};
        this.userMessage = _userMessage;
        this.embedBuilder;

        this.bars = [];
        this.multiplier = global.config.settings.multipliers.horserace;

        this.gameId = global.GamesDb.GetId(this);
    }
    CreateRace(client) {
        for (let i = 0; i<5; i++) 
            this.bars.push(new Bar(i + 1, client));

        let gameString = "";

        for (let bar of this.bars) 
            gameString += bar.Get();

        let guildUser = global.Server.guild.members.cache.get(this.user.discordId);

        const file = new MessageAttachment('../Images/horseRace.png');
        const row = new MessageActionRow();
        this.embedBuilder = new MessageEmbed()
                .setColor("#b1fc03")
                .setAuthor(this.gameId, guildUser.user.displayAvatarURL())
                .setThumbnail('attachment://horseRace.png')
                .addField("Game", gameString, false)
                .addField("Bet", `${this.bet}\nPossible coins: **${Math.floor(this.bet * this.multiplier)}**`, false)
                .setTimestamp();


        row.addComponents(
                new MessageButton().setCustomId('carrace-1-' + this.gameId).setStyle('PRIMARY').setLabel('Berlingo'),
                new MessageButton().setCustomId('carrace-2-' + this.gameId).setStyle('PRIMARY').setLabel('Adam'),
                new MessageButton().setCustomId('carrace-3-' + this.gameId).setStyle('PRIMARY').setLabel('Captur'),
                new MessageButton().setCustomId('carrace-4-' + this.gameId).setStyle('PRIMARY').setLabel('Scirocco'),
                new MessageButton().setCustomId('carrace-5-' + this.gameId).setStyle('PRIMARY').setLabel('I.D 3')
                )

        this.user.thread.send({ embeds: [this.embedBuilder], files: [file], components: [row] }).then(sentEmbed => {
            this.embed = sentEmbed;
        });
    }

    UpdateRace(chosenNumber) {
        let guildUser = global.Server.guild.members.cache.get(this.user.discordId);

        let horseInterval = setInterval(() => {
            let bar = this.bars[Math.floor(Math.random() * this.bars.length)]
            bar.MoveForward();
            let gameString = "";
    
            for (let bar of this.bars) 
                gameString += bar.Get();

            const file = new MessageAttachment('../Images/horseRace.png');
            const row = new MessageActionRow();
            this.embedBuilder = new MessageEmbed()
                    .setColor("#b1fc03")
                    .setAuthor(this.gameId, guildUser.user.displayAvatarURL())
                    .setThumbnail('attachment://horseRace.png')
                    .addField("Game", gameString, false)
                    .addField("Bet", `${this.bet}\nPossible coins: **${Math.floor(this.bet * this.multiplier)}**\nYou bet on car ${chosenNumber}`, false)
                    .setTimestamp();

            this.embed.edit({ embeds: [this.embedBuilder], files: [file] }).then(sentEmbed => {
                this.embed = sentEmbed;
            });

            if (bar.hasFinished) {
                clearInterval(horseInterval);

                const file = new MessageAttachment('../Images/horseRace.png');
                this.embedBuilder = new MessageEmbed()
                    .setAuthor(this.gameId, guildUser.user.displayAvatarURL())
                    .setThumbnail('attachment://horseRace.png')
                    .addField("Game", gameString, false)
                    .setTimestamp();

                if (bar.id == chosenNumber) {
                    this.embedBuilder
                        .setColor("#348522")
                        .addField("Won", `Your car won the race! You've won **${this.bet * this.multiplier}** coins`, false)
                    
                    global.Server.Message(null, `**${this.user.userName}** played a game of **CarRace** and won **${this.bet * this.multiplier}** coins`, "#228570", global.Server.eventChannel, false);
                    this.user.coins += Math.floor((this.bet * 30) - this.bet);
                }
                else {
                    this.embedBuilder
                        .setColor("#853122")
                        .addField("Lost", `Your car didn't win the race. You've lost **${this.bet}** coins`, false)
                    
                    global.Server.Message(null, `**${this.user.userName}** played a game of **CarRace** and lost **${this.bet}** coins`, "#228570", global.Server.eventChannel, false);
                    this.user.coins -= Math.floor(this.bet);
                }    

            this.embed.edit({ embeds: [this.embedBuilder], files: [file], components: [] }).then(sentEmbed => {
                global.GamesDb.Delete(this);
                global.UserRepository.UpdateAsync();
            });
            }
        }, 1500);
    }
}

module.exports = { HorseRace }