const { MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Coin } = require('../../Models/Games/Assets/Coin.js');


class Coinflip {
    constructor(_user, _bet, _userMessage) {
        this.user = _user;
        this.type = "Coinflip";
        this.gameId = global.GamesDb.GetId(this);
        this.embed = {};
        this.userMessage = _userMessage;
        this.bet = _bet;
        this.embedBuilder;
    }

    Flip(pickedColor) {
        this.user.coins -= this.bet;
        var coinArr = [new Coin("Red"), new Coin("Green")];

        let weightedArr = global.GamesDb.ShuffleArray([].concat(...coinArr.map((obj) => Array(obj.percentage).fill(obj))));
        let rndCoin = weightedArr[Math.floor(Math.random() * weightedArr.length)]

        var won = false;
        if (pickedColor == rndCoin.color) won = true;

        var guildUser = global.Server.guild.members.cache.get(this.user.discordId);

        const file = new MessageAttachment('../Images/coin' + rndCoin.color + '.png');
        this.embedBuilder = new MessageEmbed()
            if (won) this.embedBuilder.setColor("#468f3f")
            else this.embedBuilder.setColor("#8f3f3f")
            this.embedBuilder.setAuthor(this.gameId, guildUser.user.displayAvatarURL())
            .setThumbnail('attachment://coin' + rndCoin.color + '.png')
            .addField("Bet", this.bet + "", false)

        if (won) {
            this.user.coins += parseInt(this.bet * 2);
            this.embedBuilder.addField("Won", this.bet + " x2 (**" + parseInt(this.bet * rndCoin.coinMultiplier) + "**)\nNew coin amount: **" + this.user.coins + "**", false)
            global.GamesDb.topCoinflip.user = this.user;
            global.GamesDb.topCoinflip.coins = parseInt(this.bet * rndCoin.coinMultiplier);
        }
        else this.embedBuilder.addField("Lost", "-**" + this.bet + "**\nNew coin amount: **" + this.user.coins + "**", false)

        this.embedBuilder.setTimestamp();

        this.embed.edit({embeds: [this.embedBuilder], files: [file], components: [] }).then(async (msg) => {
            await global.UserRepository.UpdateAsync();
            if (global.GamesDb.previousCoinflips.length == 10) global.GamesDb.previousCoinflips.shift();
            global.GamesDb.previousCoinflips.push(rndCoin.color);
            let result = "";
            if (won) result = `**Won** ${this.bet * rndCoin.coinMultiplier} Coins`;
            else result = `**Lost** ${this.bet} Coins`;

            global.Server.Message(null, `**${this.user.userName}** played a game of coinflip and ${result}`, "#653f8f", global.Server.eventChannel, false);
            global.GamesDb.Delete(this);
        })
    }
}

module.exports = { Coinflip }