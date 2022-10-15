
class Jobs {
    constructor() {
        this.jobArr = [];
    }

    InitializeJobs() {
        let jobs = [
            ["Cleaning lady", 250, 40],
            ["9-5 Slave (Jekkes, Peppah)", 500, 33],
            ["Phone stealer", 1000, 15],
            ["Drug dealer", 2000, 10],
            ["Bankrobber", 5000, 2]
        ];

        for (let _job of jobs) { this.jobArr.push(new Job(_job[0], _job[1], _job[2])); }
    }

    GetRandomJobByWeight() {
        let weightedArr = [].concat(...this.jobArr.map((obj) => Array(obj.percentage).fill(obj))); 
        return weightedArr[Math.floor(Math.random() * weightedArr.length)]
    }
}

class Job {
    constructor(_name, _coins, _percentage) {
        this.name = _name;
        this.coins = _coins;
        this.percentage = _percentage;
    }
}

module.exports = { Jobs }