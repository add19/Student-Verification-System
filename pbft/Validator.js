const Wallet = require("./Wallet");

class Validators{
    constructor(totalValidators){
        this.list = this.generateAddresses(totalValidators);
    }

    generateAddresses(totalValidators){
        var list = [];
        for(var i=0; i<totalValidators; i++){
            list.push(new Wallet("NODE" + i).getPublicKey());
        }
        return list;
    }

    checkValidatorValid(validator){
        return this.list.includes(validator);
    }
}

module.exports = Validators;