const fs = require('fs');
const { User } = require('./User');
const { MessageEmbed } = require('discord.js');

class UserRepository {
    constructor() {
        this.DatabasePath = "../Data/UserDb.json";
        this.userList = [];
        this.leaderBoard = [];
    }

    async InitializeAsync() {
        let users = await JSON.parse(fs.readFileSync(this.DatabasePath));
        users.forEach(user => {
            let newUser = new User(
                user.discordId, 
                user.userName, 
                parseInt(user.rank), 
                parseInt(user.experience), 
                parseInt(user.coins), 
                parseInt(user.bank), 
                user.lastDailyClaim,
                user.lastWork
                );
            this.userList.push(newUser);
        });
        this.UpdateAsync();
        this.UpdateLeaderboardAsync();
        return this.userList;
    }

    async UpdateLeaderboardAsync() {
        this.leaderBoard =  this.userList;
        this.leaderBoard = this.leaderBoard.sort(function(a,b) { return b.experience - a.experience;});
        
        return this.leaderBoard;
    }

    async FindUserIndexOnLeaderboard(id) {
        return await this.leaderBoard.findIndex(u => u.discordId === id) + 1;
    }

    GetTopCoins() {
        let topArr = this.userList;
        topArr = topArr.sort((a,b ) => { return b.bank - a.bank;})
        return topArr;
    }

    async GetAllAsync() { 
        this.userList = await JSON.parse(fs.readFileSync(this.DatabasePath));
        return this.userList;
    }

    async GetAsync(id) { return this.userList.filter(u => u.discordId === id)[0] }

    async CreateAsync(User) {
        if (await this.GetAsync(User.discordId) != null) return null;
        this.userList.push(User);
        await this.UpdateAsync();
        return User;
    }

    async DeleteAsync(id) {}

    async UpdateAsync() {
        
        return await fs.writeFileSync(this.DatabasePath, JSON.stringify(this.userList)); 
    }
}

module.exports = { UserRepository };