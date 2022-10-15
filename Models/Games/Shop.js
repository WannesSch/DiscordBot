const { MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

class Shop {
    constructor(_user, _bet, _userMessage, _amountOfXp) {
        this.user = _user;
        this.type = "Shop";
        this.bet = _bet;
        this.amountOfXp = _amountOfXp;
        this.userMessage = _userMessage;
        this.embed = {};
        this.embedBuilder;
        this.gameId = global.GamesDb.GetId(this);
    }
    Shop(choice) {
        if (choice == "Confirm") {
            this.user.coins -= this.bet;
            this.user.experience += this.amountOfXp;

            setTimeout(() => {
                this.userMessage.delete();
                this.embed.delete();

                global.GamesDb.Delete(this); 
                global.UserRepository.UpdateAsync();
            }, 2000);
        }
        else if (choice == "Reject") {
            this.userMessage.delete();
            this.embed.delete();
            global.GamesDb.Delete(this); 
        }
    }
}

module.exports = { Shop }