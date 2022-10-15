module.exports = {
    app: {
        px: '.',
        token: 'OTIwNDcwMjA0MTc2MzAyMTEx.GaKmrd.9SW1b0f0inV3aR7LilWlsnfkw4IaKIpdyIx_YU',
        playing: ''
    },

    settings: {
        devmode: false,
        developerId: "252515845001969664",
        multipliers: {
            coinflip: 2,
            dealnodeal1: [1, 1.3, 1.5, 2.5, 5, 10],
            dealnodeal2: [1, 1.5, 2, 3, 10, 20],
            horserace: 5,
            blackjackWin: 2,
            blackjackBlackjack: 3
        },
        timeouts: {
            daily: 24,
            work: 4
        },
        rewards: {
            daily: 1000
        }
    },

    website: {
        port: 8080
    },

    opt: {
        DJ: {
            enabled: false,
            roleName: 'DJ',
            commands: ['back', 'clear', 'filter', 'loop', 'pause', 'resume', 'seek', 'shuffle', 'skip', 'stop', 'volume']
        },
        maxVol: 100,
        loopMessage: false,
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        }
    }
};
