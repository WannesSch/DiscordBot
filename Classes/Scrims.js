const { MessageEmbed } = require('discord.js');

class Scrims {
    constructor() {
        this.list = [];
    }
    AddScrim(msg, game) {
        var scrim = new Scrim(this.GetID(), msg, game);
        this.list.push(scrim);
        return scrim;
    }
    GetID() {
        var id = 0;
        for (let i = 0; i<this.list.length; i++) {
            if (this.list[i].id == id) id++;
        }
        return id;
    }
    FindScrimByID(id) {
        var scrim = null;
        for (let i = 0; i<this.list.length; i++) {
            if (this.list[i].id == id) scrim = this.list[i];
        }
        return scrim;
    }
    FindScrimByMsgID(id) {
        var scrim = null;
        for (let i = 0; i<this.list.length; i++) {
            if (this.list[i].botmsg.id == id) scrim = this.list[i];
        }

        return scrim;
    }
    RemoveScrim(scrim) {
        this.list.splice(this.list.indexOf(scrim), 1);
    }
}
var scrims = new Scrims();
class Scrim {
    constructor(id, usermsg, game) {
        this.server;
        this.id = id;
        this.game = game;

        this.usermsg = usermsg;
        this.botmsg;

        this.channels = {
            Lobby: null,
            Team1: null,
            Team2: null
        }

        this.StringBuilder = {
            Team1: "",
            Team2: ""
        }

        this.Teams = {
            Team1: [],
            Team2: []
        }
    }
    SetupScrim(server) {
        this.server = server;

        server.channels.create("Scrim#" + this.id + " Team 1", {type: "GUILD_VOICE"}).then(channel => {
            channel.setParent("836756284795256896"); //Voice id
            this.channels.Team1 = channel;
        }).catch(console.error);
        server.channels.create("Scrim#" + this.id + " Team 2", {type: "GUILD_VOICE"}).then(channel => {
            channel.setParent("836756284795256896"); //Voice id
            this.channels.Team2 = channel;
        }).catch(console.error);

    }
    Scramble(userchannel) {
        this.channels.Lobby = userchannel;
        var connectedMembers = [];

        this.channels.Lobby.members.forEach(function(guildMember) {connectedMembers.push(guildMember);})

        if (connectedMembers.length > 10) {
            var sEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle("Scrim " + this.game + " #" + this.id)
                .setDescription("There are more than 10 members in this channel.")
                .setTimestamp()

            return [false, sEmbed];
        }
        var lowestDifference = 999;
        var savedResults  = [];
        var index = 0;
        for (let i = 0; i < 50; i++) {
            var results = this.CalculateBestTeams(connectedMembers, this.game);
            var difference = results[0];
            if (difference < lowestDifference) {
                lowestDifference = difference;
                index = i;
            }
            savedResults.push(results);
        }

        var perfectResults = savedResults[index];

        this.Teams.Team1 = perfectResults[1];
        this.Teams.Team2 = perfectResults[2];  

        for (let i = 0; i<this.Teams.Team1.length; i++) {
            if (this.Teams.Team1[i].nickname != null) this.StringBuilder.Team1 += this.Teams.Team1[i].nickname + " ";
            else this.StringBuilder.Team1 += this.Teams.Team1[i].user.username + " ";
        }

        for (let i = 0; i<this.Teams.Team2.length; i++) {
            if (this.Teams.Team2[i].nickname != null) this.StringBuilder.Team2 += this.Teams.Team2[i].nickname + " ";
            else this.StringBuilder.Team2 += this.Teams.Team2[i].user.username + " ";
        }

        var sb = "";
        sb += "**Difference:** " + lowestDifference + "\n";
        sb += "**Team 1:** " + this.StringBuilder.Team1 + "\n";
        sb += "**Team 2:** " + this.StringBuilder.Team2 + "\n";
        sb += "Click ✅ to confirm teams, and start scrim.\n\n";

        var sEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle("Scrim " + this.game + " #" + this.id)
                .setDescription(sb)
                .setTimestamp()

        return [true, sEmbed];
    }
    StartScrim() {

    }
    EndScrim() {

    }
    CalculateBestTeams(array, game) {
        var t1 = [];
        var t2 = [];
        var tempArr = array;
        var difference = 0;
        var team1Elo = 0;
        var team2Elo = 0;
    
        this.Shuffle(tempArr);
    
        for (let i = 0; i<(tempArr.length/2); i++) 
            t1.push(tempArr[i]);
    
        for (let i = 0; i<tempArr.length; i++) 
            if (!t1.includes(tempArr[i])) t2.push(tempArr[i]);
    
        for (let i = 0; i<t1.length; i++) 
            team1Elo += this.GetSkillLevel(t1[i].user.id, game)
    
        for (let i = 0; i<t2.length; i++)
            team2Elo += this.GetSkillLevel(t2[i].user.id, game)
    
        difference = Math.abs(team1Elo - team2Elo);
    
    
        return [difference, t1, t2];
    }
    Shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
      
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
    }
    GetSkillLevel(userid, game) {
        var skillLevel;
        if (game == "csgo") {
            switch(userid) {
                case "252515845001969664": skillLevel = 6; break; //jwakkes
                case "294566379405836288": skillLevel = 4; break; //Sem
                case "142361655664181248": skillLevel = 4; break; //Jens
                case "253606131006570496": skillLevel = 2; break; //Sennyk
                case "214768888997478400": skillLevel = 3; break; //Sennoko
                case "213383194039287808": skillLevel = 3; break; //Shwa
                case "215090944385482752": skillLevel = 5; break; //Rising
                case "511245474179579905": skillLevel = 4; break; //Woedi
                case "219390996817903616": skillLevel = 3; break; //Toesj
                case "329527338327080960": skillLevel = 3; break; //Pieter
                case "522735875281387521": skillLevel = 2; break; //Dries
                case "314831748414570496": skillLevel = 2; break; //Sammy
                case "367747959158341634": skillLevel = 3; break; //bpost
                case "213374980350672907": skillLevel = 4; break; //Peppah
                case "203909615233007616": skillLevel = 3; break; //Wout haling
                case "238273888717373440": skillLevel = 3; break; //Evvi
                case "141635549449551872": skillLevel = 5; break; //Daan
                case "297448723753992192": skillLevel = 2; break; //Casper
                case "292741206063054859": skillLevel = 2; break; //Fin
                case "298462880024756244": skillLevel = 2; break; //Michiel
                case "252516221482696704": skillLevel = 2; break; //Elias
                case "472923385438142465": skillLevel = 1; break; //Yannick
                case "356190730395582474": skillLevel = 6; break; //pedro
                default: skillLevel = 2;
            }
        }
        else if (game == "valorant") {
            switch(userid) {
                case "252515845001969664": skillLevel = 2; break; //jwakkes
                case "294566379405836288": skillLevel = 5; break; //Sem
                case "142361655664181248": skillLevel = 5; break; //Jens
                case "253606131006570496": skillLevel = 5; break; //Sennyk
                case "214768888997478400": skillLevel = 3; break; //Sennoko
                case "213383194039287808": skillLevel = 3; break; //Shwa
                case "215090944385482752": skillLevel = 3; break; //Rising
                case "511245474179579905": skillLevel = 2; break; //Woedi
                case "219390996817903616": skillLevel = 2; break; //Toesj
                case "329527338327080960": skillLevel = 1; break; //Pieter
                case "522735875281387521": skillLevel = 1; break; //Dries
                case "314831748414570496": skillLevel = 1; break; //Sammy
                case "367747959158341634": skillLevel = 2; break; //bpost
                case "213374980350672907": skillLevel = 4; break; //Peppah
                case "203909615233007616": skillLevel = 2; break; //Wout haling
                case "238273888717373440": skillLevel = 2; break; //Evvi
                default: skillLevel = 2;
            }
        }
        return skillLevel;
    }
}
module.exports = { scrims, Scrim }