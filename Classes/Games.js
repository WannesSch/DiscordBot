const { MessageAttachment, MessageEmbed } = require('discord.js');
const progressbar = require('string-progressbar');
const sharp = require("sharp")
const fs = require('fs');

class Games {
    constructor() {
        this.activeGames = [];
    }
    StartGame(game) {
        this.activeGames.push(game);
    }
    EndGame(game) {
        game.ended = true;
        //this.activeGames.splice(this.activeGames.indexOf(game), 1);
    }
    FindGameByID(id) {
        var game = null;

        for (let i = 0; i<this.activeGames.length; i++) 
            if (this.activeGames[i].id == id) game = this.activeGames[i];

        return game;
    }
    GetID() {
        var id = 0;

        for (let i = 0; i<this.activeGames.length; i++) 
            if (this.activeGames[i].id == id) id++;

        return id;
    }
    FindGameByUser(userid) {
        var game = null;
        for (let i = 0; i<this.activeGames.length; i++)
            if (this.activeGames[i].user.id == userid) game = this.activeGames[i];
        
        return game;
    }
}

class Game {
    constructor(id, type, user, bet) {
        this.id = id;
        this.type = type;
        this.user = user;
        this.embed;
        this.bet = bet;
        this.userMsg = {};
        this.embedBuilder;
        this.ended = false;
        this.guessChannel = {};
    }
    Flip(pickedColor) {
        
    }
    async WorldGuesser(thread) {
        let id = this.id
        let sEmbed = {};
        fs.copyFile('../Images/worldmap_new_3.svg', '../Images/WorldGuesser/worldmap_game_' + this.id + '.svg', () => {});

        let inputFilePath = '../Images/WorldGuesser/worldmap_game_' + this.id + '.svg';
        let outputFilePath = '../Images/WorldGuesser/worldmap_game_' + this.id + '.png';

        
            await sharp(inputFilePath)
            .png()
            .toFile(outputFilePath)
            .then(function(info) {
                const file = new MessageAttachment(outputFilePath);
                sEmbed = new MessageEmbed()
                        .setColor("#6e15ad")
                        .setAuthor("WorldGuesser Game #" + id)
                        .addField("Progress", "" + progressbar.splitBar(100, 2, [25]))
                        .addField("WorldMap", "\u200B")
                        .setImage('attachment://worldmap_game_' + id + '.png')
                        .setTimestamp();
                        
                thread.send({ embeds: [sEmbed], files: [file] }).then(sentEmbed => {
                    var game = games.FindGameByID(id);
                    game.embed = sentEmbed;
                })
            })
            .catch(function(err) {
                console.log(err)
            })
        
    }
    CheckGuess(guess) {
        if (!countries.CheckIfCountryExists(guess)) return;
        let country = countries.FindCountryByName(guess);

        let color = "";

        switch (country.continent) {
            case "Asia": color = "#ff5e00"; break;
            case "Europe": color = "#860000"; break;
            case "Africa": color = "#d4b500"; break;
            case "Americas": color = "#235f32"; break;
            case "Oceania": color = "#5f235a"; break;
        }

        this.ChangeCountryColor(country.abbr, color);
    }
    ChangeCountryColor(countryAbbr, color) {
        let embed = this.embed;
        let id = this.id;
        let count = this.count;

        let data = fs.readFileSync('../Images/WorldGuesser/worldmap_game_' + this.id + '.svg');
        data = data.toString().split("\n");

        for(let i = 0; i<data.length; i++)
            if (data[i].indexOf('id="country-' + countryAbbr + '"') >= 0) data[i] = data[i].replace('fill="#51abcb"', 'fill="' + color + '"');

        fs.writeFile('../Images/WorldGuesser/worldmap_game_' + this.id + '.svg', data.join('\n'), function (err) {
            if (err) return console.log(err); 
            
            sharp('../Images/WorldGuesser/worldmap_game_' + id + '.svg')
                    .png()
                    .toFile('../Images/WorldGuesser/worldmap_game_' + id +'.png')
                    .then(function(info) {
                        console.log(info)
                        const file = new MessageAttachment('../Images/WorldGuesser/worldmap_game_' + id + '.png');
                        let sEmbed = new MessageEmbed()
                                .setColor("#6e15ad")
                                .setAuthor("WorldGuesser Game #" + id)
                                .addField("Progress", "" + progressbar.splitBar(100, 2, [25]))
                                .addField("WorldMap", "\u200B")
                                .setImage('attachment://worldmap_game_' + id + '.png')
                                .setTimestamp();
                                
                        embed.edit({ embeds: [sEmbed], files: [file] }).then(sentEmbed => {
                            var game = games.FindGameByID(id);
                            game.embed = sentEmbed;
                        })
                    })
                    .catch(function(err) {
                        console.log(err)
                    })
        });
    }
}

module.exports = { Games, Game }