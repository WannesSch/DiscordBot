const fs = require('fs');
const lookup = require('country-code-lookup')

class Countries {
    constructor() {
        this.list = [];
    }
    InitCountries() {
        let data = fs.readFileSync("../Data/Countries.txt");
        data = data.toString().split('\n');

        data.forEach(Abbr => {
            var countryObj = lookup.byIso(Abbr);
            this.list.push(new Country(countryObj.country, Abbr, countryObj.region, countryObj.continent, countryObj.capital));
        });
    }
    AddCountry(_country) {
        this.list.push(_country);
    }
    CheckIfCountryExists(name) {
        for (let i = 0; i<this.list.length; i++) {
            if (this.list[i].name.toLowerCase() == name.toLowerCase()) return true;
        }
        return false;
    }
    FindCountryByName(name) {
        var country = null;
        for (let i = 0; i<this.list.length; i++) {
            if (this.list[i].name.toLowerCase() == name.toLowerCase()) country = this.list[i];
        }
        return country;
    }
    FindCountryByAbbr(abbr) {
        var country = null;
        for (let i = 0; i<this.list.length; i++) {
            if (this.list[i].abbr == abbr) country = this.list[i];
        }
        return country;
    }
}

class Country {
    constructor(name, abbr, region, continent, capital) {
        this.name = name;
        this.abbr = abbr;
        this.region = region;
        this.continent = continent;
        this.capital = capital;
    }
}

module.exports = { Countries }