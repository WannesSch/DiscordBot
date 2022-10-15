const { Card } = require('./Card.js');

class Deck {
    constructor() {
        this.cardNumbers = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "1" ]
        this.symbols = ["hearts", "spades", "diamonds", "clubs"];
        this.cards = [];
        
    }
    CreateDeck(amount) {
        for (let a = 0; a<amount; a++) {
            for (let i = 0; i<this.symbols.length; i++) {
                for (let j = 0; j<this.cardNumbers.length; j++) {
                    let value = this.GetCardValue(this.cardNumbers[j]);
                    let emoji = this.GetEmoji([this.cardNumbers[j], this.symbols[i]]);
                    this.cards.push(new Card(emoji, this.cardNumbers[j], value))
                }
                    
            }
        }
    }
    GetCardValue(cardNumber) {
        let value = 0;

        if (cardNumber <= 10 && cardNumber != "1") value = parseInt(cardNumber);
        if (cardNumber == "J" || 
            cardNumber == "Q" ||
            cardNumber == "K") value = 10;
        if (cardNumber == "1") value = [1, 11];

        return value;
    }
    GetRandomCard(cardArr, amount) {
        let card = null;
        for (let i = 0; i<amount; i++) {
            card = this.cards[Math.floor(Math.random() * this.cards.length)]
            cardArr.push(card);
            this.cards.splice(this.cards.indexOf(card), 1);
        }

        return card;
    }
    GetEmoji(arr) {
        let list;

        switch(arr[1]) {
            case "hearts": list = global.Server.Emojis.cards.hearts; break;
            case "spades": list = global.Server.Emojis.cards.spades; break;
            case "diamonds": list = global.Server.Emojis.cards.diamonds; break;
            case "clubs": list = global.Server.Emojis.cards.clubs; break;
        }

        let emoji;

        switch(arr[0]) {
            case "2": emoji = list.two; break;
            case "3": emoji = list.three; break;
            case "4": emoji = list.four; break;
            case "5": emoji = list.five; break;
            case "6": emoji = list.six; break;
            case "7": emoji = list.seven; break;
            case "8": emoji = list.eight; break;
            case "9": emoji = list.nine; break;
            case "10": emoji = list.ten; break;
            case "J": emoji = list.jack; break;
            case "Q": emoji = list.queen; break;
            case "K": emoji = list.king; break;
            case "1": emoji = list.ace; break;
        }

        return emoji;
    }
}

module.exports = { Deck }