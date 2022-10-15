class Coin {
    constructor(_color) {
        this.color = _color;
        this.coinMultiplier = global.config.settings.multipliers.coinflip;
        this.percentage = 50;
    }
}

module.exports = { Coin }