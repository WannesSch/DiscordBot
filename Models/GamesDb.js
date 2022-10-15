class GamesDb {
    constructor() {
        this.gameList = [];
        this.previousCoinflips = [];
        this.topCoinflip = {
            user: null,
            coins: 0
        }
    }

    Create(game) { this.gameList.push(game); };

    Delete(game) { 
        this.gameList.splice(this.gameList.indexOf(game), 1); 
    };

    GetGameById(id) { return this.gameList.filter(g => g.gameId == id)[0]; }

    GetId(game) { return game.type + "/" + game.user.userName + "#" + this.GenerateString(5); }

    GenerateString(length) {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ )
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
    
        return result;
    }

    CheckCoinsInput(input, user, type) {
        if (!input) return false;
        if (isNaN(input)) return false;
        if (!isFinite(input)) return false;
        input = parseInt(input);
    
        if (input <= 0) return false;
        if (type == "Bank")
            if (input > user.bank) return false;

        if (type == "Coins") 
            if (input > user.coins) return false;

    
        return true;
    }

    CheckIfUserIsInGame(user) {
        for (let game of this.gameList) {
            if (game.user == user) return true;
        }
        return false;
    }

    CheckNumberInput(input) {
        if (!input) return false;
        if (isNaN(input)) return false;
        if (!isFinite(input)) return false;
        input = parseInt(input);
    
        if (input <= 0 || input > 16) return false;

        return true;
    }

    ShuffleArray(array) {
        let currentIndex = array.length,  randomIndex;
      
        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }
}

module.exports = { GamesDb };