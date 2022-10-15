const { Deck } = require("./Assets/Deck.js");
const { MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const file = new MessageAttachment('../Images/blackjack.png');

class Blackjack {
    constructor(_user, _bet, _guildUser) {
        this.user = _user;
        this.type = "Blackjack";
        this.bet = _bet;
        this.guildUser = _guildUser;
        
        this.deck;

        this.insured = false;

        this.dealer = {
            cards: [],
            stringBuilder: "",
            totalValue: 0,
            message: {},
            cardsMessage: {}
        }

        this.player = {
            cards: [],
            stringBuilder: "",
            totalValue: 0,
            message: {},
            cardsMessage: {}
        }

        this.embed = {};
        this.embedBuilder;

        this.helpText;
        this.gameId = global.GamesDb.GetId(this);
    }
    CreateHelpText() {
        this.helpText = `
        **Stand:** Hold your total and end your turn.
        **Hit:** Draw another card.
        **Insure:** Verzek. Cremers.
        **Double** Double your bet.
        `
    }

    CreateGame() {
        this.deck = new Deck();
        this.deck.CreateDeck(2);
        this.CreateHelpText()

        this.user.coins -= this.bet;

        this.deck.GetRandomCard(this.player.cards, 2);
        this.deck.GetRandomCard(this.dealer.cards, 2);

        let value = 0;

        for (let card of this.player.cards) {
            this.player.stringBuilder += `${card.emoji}`;
            value = card.value;
            if (card.cardnumber == 1) {
                if ((this.player.totalValue + card.value[1]) > 21) value = card.value[0];
                else value = card.value[1];
            }
            this.player.totalValue += parseInt(value);
        }

        let dealerValue = 0;

        for (let i = 0; i<this.dealer.cards.length; i++) {
            let card = this.dealer.cards[i];
            if(i == 0) this.dealer.stringBuilder += `${card.emoji}`;
            dealerValue = card.value;
            if (card.cardnumber == 1) {
                if ((this.dealer.totalValue + card.value[1]) > 21) dealerValue = card.value[0];
                else dealerValue = card.value[1];
            }
            this.dealer.totalValue += parseInt(dealerValue);
        }

        this.embedBuilder = new MessageEmbed()
                .setColor("#a4eb34")
                .setAuthor(this.gameId, this.guildUser.user.displayAvatarURL())
                .setThumbnail('attachment://blackjack.png')
                .setDescription(`Bet: **${this.bet}**\n\n${this.helpText}`)
                .setTimestamp();

        const row = new MessageActionRow();

        if (this.dealer.cards[0].cardnumber == 1) {
            row.addComponents(
                new MessageButton()
                    .setCustomId('blackjack-Insure-' + this.gameId)
                    .setStyle('SUCCESS')
                    .setLabel('Insure'),

                new MessageButton()
                    .setCustomId('blackjack-Cancel-' + this.gameId)
                    .setStyle('DANGER')
                    .setLabel('Cancel'),
            )
        }
        else {
            row.addComponents(
                new MessageButton()
                        .setCustomId('blackjack-Stand-' + this.gameId)
                        .setStyle('PRIMARY')
                        .setLabel('Stand'),
            
                new MessageButton()
                        .setCustomId('blackjack-Hit-' + this.gameId)
                        .setStyle('SUCCESS')
                        .setLabel('Hit'),
            )

            if (this.user.coins >= this.bet) {
                row.addComponents(
                    new MessageButton()
                            .setCustomId('blackjack-Double-' + this.gameId)
                            .setStyle('DANGER')
                            .setLabel('Double Down')
                )
            }
        }

        this.user.thread.send({ embeds: [this.embedBuilder], components: [row], files: [file] }).then(sentEmbed => { 
            this.embed = sentEmbed; 

            if (this.player.totalValue == 21) this.Blackjack();
        });
    
        this.user.thread.send(`**Your hand** Total: ${this.player.totalValue}`).then(sentMessage => { this.player.message = sentMessage });
        this.user.thread.send(`${this.player.stringBuilder}`).then(sentMessage => { this.player.cardsMessage = sentMessage });
        this.user.thread.send(`**Dealers hand**`).then(sentMessage => { this.dealer.message = sentMessage });
        this.user.thread.send(this.dealer.stringBuilder).then(sentMessage => { this.dealer.cardsMessage = sentMessage });
    }

    Stand() {
        let winner;
        let color;
        let description;
        let lose = false;

        this.dealer.stringBuilder = "";
        while (this.dealer.totalValue < 17) {
            let rndCard = this.deck.GetRandomCard(this.dealer.cards, 1);
            this.dealer.totalValue += parseInt(rndCard.value);
        }
             
        for (let card of this.dealer.cards)
            this.dealer.stringBuilder += `${card.emoji}`;

        if (this.dealer.totalValue > 21) winner = "Player";
        else if (this.player.totalValue > 21) winner = "Dealer";
        else if (this.dealer.totalValue > this.player.totalValue) winner = "Dealer";
        else if (this.dealer.totalValue < this.player.totalValue) winner = "Player";
        else if (this.dealer.totalValue == this.player.totalValue) winner = "Split";

        this.dealer.cardsMessage.edit(this.dealer.stringBuilder);
        this.dealer.message.edit(`**Dealers hand** Total: ${this.dealer.totalValue}`);

        switch(winner) {
            case "Dealer": {
                this.Lose();
                lose = true;
            } break;
            case "Player": {
                color = "#179e15";
                this.user.coins += parseInt(Math.round(this.bet * global.config.settings.multipliers.blackjackWin));
                description = `
                **Won** You won **${Math.round(this.bet * global.config.settings.multipliers.blackjackWin)}** coins\n
                New coin amount: **${this.user.coins}**`;
            } break;
            case "Split": {
                color = "#15439e";
                this.user.coins += parseInt(this.bet);
                description = `
                **Split** You Split with the dealer, You've received **${this.bet}** coins\n
                New coin amount: **${this.user.coins}**`;
            } break;
        }

        if (lose) return;
        this.embedBuilder = new MessageEmbed()
            .setColor(color)
            .setAuthor(this.gameId, this.guildUser.user.displayAvatarURL())
            .setThumbnail('attachment://blackjack.png')
            .setDescription(description)
            .setTimestamp();

        this.embed.edit({ embeds: [this.embedBuilder], components: [], files: [file] }).then(async (sentEmbed) => {
            global.GamesDb.Delete(this);
            await global.UserRepository.UpdateAsync();
        });
    }

    Hit() {
        let card = this.deck.GetRandomCard(this.player.cards, 1);

        let value = 0;
        value = card.value;

        if (card.cardnumber == 1) {
            if ((this.player.totalValue + card.value[1]) > 21) value = card.value[0];
            else value = card.value[1];
        }
        
        this.player.totalValue += parseInt(value);
        this.player.stringBuilder += `${card.emoji}`;

        let sb = `Bet: **${this.bet}**\n\n${this.helpText}`;
        if (this.insured) sb = `Bet: **${this.bet}** ***INSURED***\n\n${this.helpText}`;

        this.embedBuilder = new MessageEmbed()
                .setColor("#a4eb34")
                .setAuthor(this.gameId, this.guildUser.user.displayAvatarURL())
                .setThumbnail('attachment://blackjack.png')
                .setDescription(sb)
                .setTimestamp();

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                    .setCustomId('blackjack-Stand-' + this.gameId)
                    .setStyle('PRIMARY')
                    .setLabel('Stand'),
        
            new MessageButton()
                    .setCustomId('blackjack-Hit-' + this.gameId)
                    .setStyle('SUCCESS')
                    .setLabel('Hit')
        );

        this.embed.edit({ embeds: [this.embedBuilder], components: [row], files: [file] }).then(sentEmbed => { 
            this.embed = sentEmbed;
        });
    
        this.player.message.edit(`**Your hand** Total: ${this.player.totalValue}`).then(sentMessage => { this.player.message = sentMessage });
        this.player.cardsMessage.edit(`${this.player.stringBuilder}`).then(sentMessage => { this.player.cardsMessage = sentMessage });
        this.dealer.message.edit(`**Dealers hand**`).then(sentMessage => { this.dealer.message = sentMessage });
        this.dealer.cardsMessage.edit(this.dealer.stringBuilder).then(sentMessage => { 
            this.dealer.cardsMessage = sentMessage
            if (this.player.totalValue > 21) this.Lose();
        });
    }

    Lose() {
        let sb;

        sb = `**Lost** You lost **${this.bet}** coins\nNew coin amount: **${this.user.coins}**`
        if (this.insured) {
            this.user.coins += parseInt(Math.round(this.bet / 2));
            sb = `**Lost** You were insured, you received **${Math.round(this.bet / 2)}** coins\nNew coin amount: **${this.user.coins}**`
        }

        this.embedBuilder = new MessageEmbed()
            .setColor("#fc2c03")
            .setAuthor(this.gameId, this.guildUser.user.displayAvatarURL())
            .setThumbnail('attachment://blackjack.png')
            .setDescription(sb)
            .setTimestamp();

        this.embed.edit({ embeds: [this.embedBuilder], components: [], files: [file] }).then(async (sentEmbed) => {
            global.GamesDb.Delete(this);
            await global.UserRepository.UpdateAsync();
        });
    }

    Insure() {
        this.insured = true;

        this.embedBuilder = new MessageEmbed()
                .setColor("#a4eb34")
                .setAuthor(this.gameId, this.guildUser.user.displayAvatarURL())
                .setThumbnail('attachment://blackjack.png')
                .setDescription(`Bet: **${this.bet}** ***INSURED***\n\n${this.helpText}`)
                .setTimestamp();

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                    .setCustomId('blackjack-Stand-' + this.gameId)
                    .setStyle('PRIMARY')
                    .setLabel('Stand'),
        
            new MessageButton()
                    .setCustomId('blackjack-Hit-' + this.gameId)
                    .setStyle('SUCCESS')
                    .setLabel('Hit')
            
        );

        this.embed.edit({ embeds: [this.embedBuilder], components: [row], files: [file] }).then(sentEmbed => { 
            this.embed = sentEmbed;
            if (this.player.totalValue == 21) this.Blackjack();
        });
    }

    Cancel() {
        this.embedBuilder = new MessageEmbed()
                .setColor("#a4eb34")
                .setAuthor(this.gameId, this.guildUser.user.displayAvatarURL())
                .setThumbnail('attachment://blackjack.png')
                .setDescription(`Bet: **${this.bet}**\n\n${this.helpText}`)
                .setTimestamp();

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                    .setCustomId('blackjack-Stand-' + this.gameId)
                    .setStyle('PRIMARY')
                    .setLabel('Stand'),
        
            new MessageButton()
                    .setCustomId('blackjack-Hit-' + this.gameId)
                    .setStyle('SUCCESS')
                    .setLabel('Hit'),
        );

        if (this.user.coins >= this.bet) {
            row.addComponents(
                new MessageButton()
                        .setCustomId('blackjack-Double-' + this.gameId)
                        .setStyle('DANGER')
                        .setLabel('Double Down')
            )
        }

        this.embed.edit({ embeds: [this.embedBuilder], components: [row], files: [file] }).then(sentEmbed => { 
            this.embed = sentEmbed;
        });
    }

    DoubleDown() {
        this.user.coins -= parseInt(this.bet);
        this.bet = parseInt(this.bet * 2)

        let card = this.deck.GetRandomCard(this.player.cards, 1);

        let value = 0;
        value = card.value;

        if (card.cardnumber == 1) {
            if ((this.player.totalValue + card.value[1]) > 21) value = card.value[0];
            else value = card.value[1];
        }
        
        this.player.totalValue += parseInt(value);
        this.player.stringBuilder += `${card.emoji}`;

        this.player.message.edit(`**Your hand** Total: ${this.player.totalValue}`).then(sentMessage => {});
        this.player.cardsMessage.edit(`${this.player.stringBuilder}`).then(sentMessage => { });
        this.Stand();
    }

    Blackjack() {
        this.user.coins += parseInt(Math.round(this.bet * global.config.settings.multipliers.blackjackBlackjack));
        this.embedBuilder = new MessageEmbed()
                .setColor("#fcb603")
                .setAuthor(this.gameId, this.guildUser.user.displayAvatarURL())
                .setThumbnail('attachment://blackjack.png')
                .setDescription(`**BLACKJACK!** You won **${Math.round(this.bet * global.config.settings.multipliers.blackjackBlackjack)}** coins\nNew coin amount: **${this.user.coins}**`)
                .setTimestamp();

        this.embed.edit({ embeds: [this.embedBuilder], components: [], files: [file] }).then(async (sentEmbed) => {
            global.GamesDb.Delete(this);
            await global.UserRepository.UpdateAsync();
        });
    }
}

module.exports = { Blackjack }