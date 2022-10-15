

class Bar {
    constructor(_id, _client) {
        this.id = _id;
        this.horsePosition = 0;
        this.string = `${this.GetEmojiById()}${`⚪${"▬".repeat(5)}`.repeat(4)}🏁\n\n`;
        this.hasFinished = false;
    }

    Get() { return this.string }

    MoveForward() {
        this.horsePosition++;

        switch(this.horsePosition) {
            case 1: this.string = `▬${this.GetEmojiById()}▬▬▬▬▬⚪▬▬▬▬▬⚪▬▬▬▬▬⚪▬▬▬▬▬🏁\n\n`; break;
            case 2: this.string = `▬⚪▬▬▬▬▬${this.GetEmojiById()}▬▬▬▬▬⚪▬▬▬▬▬⚪▬▬▬▬▬🏁\n\n`; break;
            case 3: this.string = `▬⚪▬▬▬▬▬⚪▬▬▬▬▬${this.GetEmojiById()}▬▬▬▬▬⚪▬▬▬▬▬🏁\n\n`; break;
            case 4: this.string = `▬⚪▬▬▬▬▬⚪▬▬▬▬▬⚪▬▬▬▬▬${this.GetEmojiById()}▬▬▬▬▬🏁\n\n`; break;
            case 5: {
                this.hasFinished = true;
                this.string = `▬⚪▬▬▬▬▬⚪▬▬▬▬▬⚪▬▬▬▬▬⚪▬▬▬▬▬${this.GetEmojiById()}\n\n`; 
                break;
            }
        }
    }

    GetEmojiById() {
        let emoji = null;
        switch(this.id) {
            case 1: emoji = global.Server.Emojis.cars.berlingo; break;
            case 2: emoji = global.Server.Emojis.cars.adam; break;
            case 3: emoji = global.Server.Emojis.cars.captur; break;
            case 4: emoji = global.Server.Emojis.cars.scirocco; break;
            case 5: emoji = global.Server.Emojis.cars.id3; break;
        }
        return emoji;
    }
}

module.exports = { Bar }
