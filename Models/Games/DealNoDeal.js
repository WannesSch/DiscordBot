// 16 nummers
// --- / ---- / ---- / --- / - / -
// Inzet 50:
// - ronde 1 (nummer zit er niet bij) -> cashen voor 100 (inzet x2) of verder spelen met 150 (inzet x3) 
// - ronde 2 (nummer zit niet bij) -> cashen voor 150 (inzet x3) of verder spelen met 250 (inzet x5)
// - ronde 3 (nummer zit niet bij) -> cashen voor 250 (inzet x5) of verder spelen voor 500 (inzet x10)
// - ronde 4 (nummer zit niet bij) -> cashen voor 500 (inzet x10) of verder spelen voor 1000 (inzet x20)
// - ronde 5 (nummer zit niet bij) -> een van 2 cases kiezen -> fout = gg juist = 1000 coins (inzet x20)

const { MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

class DealOrNoDeal {
    constructor(_user, _userMessage, _bet, _chosenNumber) {
        this.user = _user;
        this.type = "Deal No Deal";
        this.bet = _bet;
        this.chosenNumber = parseInt(_chosenNumber);

        this.rows = {
            one: [],
            two: [],
            three: [],
            four: [],
            five: []
        }
        this.numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        this.round = 1;
        this.roundMultiplier = [];

        this.gameId = global.GamesDb.GetId(this);
        this.embed = {};
        this.userMessage = _userMessage;
        this.embedBuilder;

        this.emojiList;
        this.tileSb =  null;

    }

    CreateGame(client) {
        if (this.bet > 2000) this.roundMultiplier = global.config.settings.multipliers.dealnodeal1;
        else this.roundMultiplier = global.config.settings.multipliers.dealnodeal2;

        this.numberArray = global.GamesDb.ShuffleArray(this.numberArray);
        let index = 0;

        for (let number of this.numberArray) {
            switch (true) {
                case (index < 3): this.rows.one.push(number); break;
                case (index < 7): this.rows.two.push(number); break;
                case (index < 11): this.rows.three.push(number); break;
                case (index < 14): this.rows.four.push(number); break;
                case (index < 16): this.rows.five.push(number); break; 
            }


            index++;
        }
        this.InitializeEmoji(client);
    }

    GetEmojiByNumber(number) {
        let emoji = null;
        switch (number) {
            case 1: emoji = this.emojiList.one; break;
            case 2: emoji = this.emojiList.two; break;
            case 3: emoji = this.emojiList.three; break;
            case 4: emoji = this.emojiList.four; break;
            case 5: emoji = this.emojiList.five; break;
            case 6: emoji = this.emojiList.six; break;
            case 7: emoji = this.emojiList.seven; break;
            case 8: emoji = this.emojiList.eight; break;
            case 9: emoji = this.emojiList.nine; break;
            case 10: emoji = this.emojiList.ten; break;
            case 11: emoji = this.emojiList.eleven; break;
            case 12: emoji = this.emojiList.twelve; break;
            case 13: emoji = this.emojiList.tirteen; break;
            case 14: emoji = this.emojiList.fourteen; break;
            case 15: emoji = this.emojiList.fifteen; break;
            case 16: emoji = this.emojiList.sixteen; break;
        }

        return emoji;
    }

    InitializeEmoji(client) {
        this.emojiList = global.Server.Emojis.dealnodeal;

        this.tileSb =  `${this.GetEmojiByNumber(this.rows.one[0])} ${this.GetEmojiByNumber(this.rows.one[1])} ${this.GetEmojiByNumber(this.rows.one[2])}
                        ${this.emojiList.blank} ${this.emojiList.blank} ${this.emojiList.blank} ${this.emojiList.blank}
                        ${this.emojiList.blank} ${this.emojiList.blank} ${this.emojiList.blank} ${this.emojiList.blank}
                        ${this.emojiList.blank} ${this.emojiList.blank} ${this.emojiList.blank}
                        ${this.emojiList.blank} ${this.emojiList.blank}`;
    }

    CheckRow() {
        let lost = false;
        switch(this.round) {
            case 1: if (this.rows.one.includes(this.chosenNumber)) lost = true; break;
            case 2: if (this.rows.two.includes(this.chosenNumber)) lost = true; break;
            case 3: if (this.rows.three.includes(this.chosenNumber)) lost = true; break;
            case 4: if (this.rows.four.includes(this.chosenNumber)) lost = true; break;
        }

        let guildUser = global.Server.guild.members.cache.get(this.user.discordId);

        const file = new MessageAttachment('../Images/dealnodeal.png');
        this.embedBuilder = new MessageEmbed()

        if (lost) {
            this.user.coins -= parseInt(this.bet);
            this.embedBuilder.setColor("#f54b42")
            .setAuthor(this.gameId, guildUser.user.displayAvatarURL())
            .setThumbnail('attachment://dealnodeal.png')
            .addField("Lost", `You lost **${this.bet}** Coins\nNew Coin amount: **${this.user.coins}**`, false)
            .addField("Game", this.tileSb, false)
            .setTimestamp();

            setTimeout(() => {
                this.embed.edit({embeds: [this.embedBuilder], files: [file], components: [] }).then(sentMssage => { 
                    global.Server.Message(null, `**${this.user.userName}** played a game of **Deal Or No Deal** and lost **${this.bet}** coins`, "#653f8f", global.Server.eventChannel, false);
                    global.GamesDb.Delete(this);
                    global.UserRepository.UpdateAsync();
                });
            }, 1000) 
        }
        else {
            if (this.round == 5) {
                this.embedBuilder.setColor("#425df5")
                .setAuthor(this.gameId, guildUser.user.displayAvatarURL())
                .setThumbnail('attachment://dealnodeal.png')
                .addField("Game", this.tileSb, false)
                .setTimestamp();

                const row = new MessageActionRow();

                row.addComponents(
                    new MessageButton()
                        .setCustomId('dealnodeal-Left-' + this.gameId)
                        .setStyle('PRIMARY')
                        .setLabel('Left'),
            
                    new MessageButton()
                        .setCustomId('dealnodeal-Right-' + this.gameId)
                        .setStyle('PRIMARY')
                        .setLabel('Right')
                    );
                
                setTimeout(() => {
                    this.embed.edit({embeds: [this.embedBuilder], files: [file], components: [row] }).then(sentEmbed => { this.embed = sentEmbed; });
                }, 1000) 

                return;
            }

            
            let betString = "";
                betString += `Bet: ${this.bet}\n\n`;
                betString += `Possible wins:\n`;
                betString += `Round 1 -> **${Math.floor(this.bet * this.roundMultiplier[1])}**\n`;
                betString += `Round 2 -> **${Math.floor(this.bet * this.roundMultiplier[2])}**\n`;
                betString += `Round 3 -> **${Math.floor(this.bet * this.roundMultiplier[3])}**\n`;
                betString += `Round 4 -> **${Math.floor(this.bet * this.roundMultiplier[4])}**\n`;
                betString += `Round 5 -> **${Math.floor(this.bet * this.roundMultiplier[5])}**`;

            this.embedBuilder.setColor("#d4a706")
            .setAuthor(this.gameId, guildUser.user.displayAvatarURL())
            .setThumbnail('attachment://dealnodeal.png')
            .addField("Game", this.tileSb, false)
            .addField("Deal", `Deal from bank: **${(Math.floor(this.bet * this.roundMultiplier[this.round]))}** coins`, false)
            .addField("Bets", betString, false)
            .setTimestamp();

            const row = new MessageActionRow();

            row.addComponents(
                new MessageButton()
                    .setCustomId('dealnodeal-Deal-' + this.gameId)
                    .setStyle('SUCCESS')
                    .setLabel('Deal'),
        
                new MessageButton()
                    .setCustomId('dealnodeal-NoDeal-' + this.gameId)
                    .setStyle('DANGER')
                    .setLabel('No Deal')
                );
            
            setTimeout(() => {
                this.embed.edit({embeds: [this.embedBuilder], files: [file], components: [row] }).then(sentEmbed => { this.embed = sentEmbed; });
            }, 1000) 
        }
    }

    NoDeal() {
        this.round++;

        if (this.round != 5 )this.EditTileSb();

        let guildUser = global.Server.guild.members.cache.get(this.user.discordId);

        const file = new MessageAttachment('../Images/dealnodeal.png');
        this.embedBuilder = new MessageEmbed()
                .setColor("#d4a706")
                .setAuthor(this.gameId, guildUser.user.displayAvatarURL())
                .setThumbnail('attachment://dealnodeal.png')
                .addField("Game", this.tileSb, false)
                .addField("Bet", this.bet, false)
                .setTimestamp();

        
        setTimeout(() => {
            this.embed.edit({embeds: [this.embedBuilder], files: [file]}).then(sentEmbed => {
                this.embed = sentEmbed;
                this.CheckRow();
            });
        }, 1000) 
    }

    Deal() {
        this.RevealAllTiles();
        let guildUser = global.Server.guild.members.cache.get(this.user.discordId);

        const file = new MessageAttachment('../Images/dealnodeal.png');
        this.embedBuilder = new MessageEmbed()

        this.user.coins += parseInt(((Math.floor(this.bet * this.roundMultiplier[this.round]) - this.bet)));
        this.embedBuilder.setColor("#8a2759")
        .setAuthor(this.gameId, guildUser.user.displayAvatarURL())
        .setThumbnail('attachment://dealnodeal.png')
        .addField("Cashed", `You cashed out for ** ${Math.floor(this.bet * this.roundMultiplier[this.round])}** Coins\nNew Coin amount: **${this.user.coins}**`, false)
        .addField("Game", this.tileSb, false)
        .setTimestamp();

        setTimeout(() => {
            this.embed.edit({embeds: [this.embedBuilder], files: [file], components: [] }).then(sentEmbed => { 
                global.Server.Message(null, `**${this.user.userName}** played a game of **Deal Or No Deal** and made a deal with the bank for **${(this.bet * this.roundMultiplier[this.round])}** coins`, "#653f8f", global.Server.eventChannel, false);
                global.GamesDb.Delete(this); 
                global.UserRepository.UpdateAsync();
            });
        }, 1000) 
    }

    SuddenDeath(userChoice) {
        let userChoiceNumber = null;
        this.EditTileSb();

        if (userChoice == "Left") userChoiceNumber = this.rows.five[0];
        if (userChoice == "Right") userChoiceNumber = this.rows.five[1];

        let guildUser = global.Server.guild.members.cache.get(this.user.discordId);

        const file = new MessageAttachment('../Images/dealnodeal.png');
        this.embedBuilder = new MessageEmbed()

        if (userChoiceNumber != this.chosenNumber) {
            this.user.coins -= parseInt(this.bet);
            this.embedBuilder.setColor("#f54b42")
            .setAuthor(this.gameId, guildUser.user.displayAvatarURL())
            .setThumbnail('attachment://dealnodeal.png')
            .addField("Lost", `You lost **${this.bet}** Coins\nNew coin amount **${this.user.coins}**`, false)
            .addField("Game", this.tileSb, false)
            .setTimestamp();

            setTimeout(() => {
                this.embed.edit({embeds: [this.embedBuilder], files: [file], components: [] }).then(sentEmbed => {  
                    global.Server.Message(null, `**${this.user.userName}** played a game of **Deal Or No Deal** and lost **${this.bet}** coins`, "#653f8f", global.Server.eventChannel, false);
                    global.GamesDb.Delete(this);
                    global.UserRepository.UpdateAsync();
                });
            }, 1000) 
            return;
        }
        
        this.user.coins += parseInt(((this.bet * this.roundMultiplier[this.round]) - this.bet));

        this.embedBuilder.setColor("#278a28")
            .setAuthor(this.gameId, guildUser.user.displayAvatarURL())
            .setThumbnail('attachment://dealnodeal.png')
            .addField("Won", "You won **" + (this.bet * this.roundMultiplier[this.round]) + "** Coins", false)
            .addField("Game", this.tileSb, false)
            .setTimestamp();

            setTimeout(() => {
                this.embed.edit({embeds: [this.embedBuilder], files: [file], components: [] }).then(sentEmbed => {  
                    global.Server.Message(null, `**${this.user.userName}** played a game of **Deal Or No Deal** and won **${parseInt((this.bet * this.roundMultiplier[this.round]))}** coins`, "#653f8f", global.Server.eventChannel, false);
                    global.GamesDb.Delete(this);
                    global.UserRepository.UpdateAsync();
                });
            }, 1000) 
    }

    EditTileSb() {
        switch(this.round) {
            case 1: {
                this.tileSb =  `${this.GetEmojiByNumber(this.rows.one[0])} ${this.GetEmojiByNumber(this.rows.one[1])} ${this.GetEmojiByNumber(this.rows.one[2])}
                ${this.this.emojiList.blank} ${this.this.emojiList.blank} ${this.this.emojiList.blank} ${this.this.emojiList.blank}
                ${this.this.emojiList.blank} ${this.this.emojiList.blank} ${this.this.emojiList.blank} ${this.this.emojiList.blank}
                ${this.this.emojiList.blank} ${this.this.emojiList.blank} ${this.emojiList.blank}
                ${this.emojiList.blank} ${this.emojiList.blank}`;
                break;
            }
            case 2: {
                this.tileSb =  `${this.GetEmojiByNumber(this.rows.one[0])} ${this.GetEmojiByNumber(this.rows.one[1])} ${this.GetEmojiByNumber(this.rows.one[2])}
                ${this.GetEmojiByNumber(this.rows.two[0])} ${this.GetEmojiByNumber(this.rows.two[1])} ${this.GetEmojiByNumber(this.rows.two[2])} ${this.GetEmojiByNumber(this.rows.two[3])}
                ${this.emojiList.blank} ${this.emojiList.blank} ${this.emojiList.blank} ${this.emojiList.blank}
                ${this.emojiList.blank} ${this.emojiList.blank} ${this.emojiList.blank}
                ${this.emojiList.blank} ${this.emojiList.blank}`;
                break;
            }
            case 3: {
                this.tileSb =  `${this.GetEmojiByNumber(this.rows.one[0])} ${this.GetEmojiByNumber(this.rows.one[1])} ${this.GetEmojiByNumber(this.rows.one[2])}
                ${this.GetEmojiByNumber(this.rows.two[0])} ${this.GetEmojiByNumber(this.rows.two[1])} ${this.GetEmojiByNumber(this.rows.two[2])} ${this.GetEmojiByNumber(this.rows.two[3])}
                ${this.GetEmojiByNumber(this.rows.three[0])} ${this.GetEmojiByNumber(this.rows.three[1])} ${this.GetEmojiByNumber(this.rows.three[2])} ${this.GetEmojiByNumber(this.rows.three[3])}
                ${this.emojiList.blank} ${this.emojiList.blank} ${this.emojiList.blank}
                ${this.emojiList.blank} ${this.emojiList.blank}`;
                break;
            }
            case 4: {
                this.tileSb =  `${this.GetEmojiByNumber(this.rows.one[0])} ${this.GetEmojiByNumber(this.rows.one[1])} ${this.GetEmojiByNumber(this.rows.one[2])}
                ${this.GetEmojiByNumber(this.rows.two[0])} ${this.GetEmojiByNumber(this.rows.two[1])} ${this.GetEmojiByNumber(this.rows.two[2])} ${this.GetEmojiByNumber(this.rows.two[3])}
                ${this.GetEmojiByNumber(this.rows.three[0])} ${this.GetEmojiByNumber(this.rows.three[1])} ${this.GetEmojiByNumber(this.rows.three[2])} ${this.GetEmojiByNumber(this.rows.three[3])}
                ${this.GetEmojiByNumber(this.rows.four[0])} ${this.GetEmojiByNumber(this.rows.four[1])} ${this.GetEmojiByNumber(this.rows.four[2])}
                ${this.emojiList.blank} ${this.emojiList.blank}`;
                break;
            }
            case 5: {
                this.tileSb =  `${this.GetEmojiByNumber(this.rows.one[0])} ${this.GetEmojiByNumber(this.rows.one[1])} ${this.GetEmojiByNumber(this.rows.one[2])}
                ${this.GetEmojiByNumber(this.rows.two[0])} ${this.GetEmojiByNumber(this.rows.two[1])} ${this.GetEmojiByNumber(this.rows.two[2])} ${this.GetEmojiByNumber(this.rows.two[3])}
                ${this.GetEmojiByNumber(this.rows.three[0])} ${this.GetEmojiByNumber(this.rows.three[1])} ${this.GetEmojiByNumber(this.rows.three[2])} ${this.GetEmojiByNumber(this.rows.three[3])}
                ${this.GetEmojiByNumber(this.rows.four[0])} ${this.GetEmojiByNumber(this.rows.four[1])} ${this.GetEmojiByNumber(this.rows.four[2])}
                ${this.GetEmojiByNumber(this.rows.five[0])} ${this.GetEmojiByNumber(this.rows.five[1])}`;
                break;
            }
        }
    }

    RevealAllTiles() {
        this.tileSb =  `${this.GetEmojiByNumber(this.rows.one[0])} ${this.GetEmojiByNumber(this.rows.one[1])} ${this.GetEmojiByNumber(this.rows.one[2])}
                        ${this.GetEmojiByNumber(this.rows.two[0])} ${this.GetEmojiByNumber(this.rows.two[1])} ${this.GetEmojiByNumber(this.rows.two[2])} ${this.GetEmojiByNumber(this.rows.two[3])}
                        ${this.GetEmojiByNumber(this.rows.three[0])} ${this.GetEmojiByNumber(this.rows.three[1])} ${this.GetEmojiByNumber(this.rows.three[2])} ${this.GetEmojiByNumber(this.rows.three[3])}
                        ${this.GetEmojiByNumber(this.rows.four[0])} ${this.GetEmojiByNumber(this.rows.four[1])} ${this.GetEmojiByNumber(this.rows.four[2])}
                        ${this.GetEmojiByNumber(this.rows.five[0])} ${this.GetEmojiByNumber(this.rows.five[1])}`;
    }
}

module.exports = { DealOrNoDeal }