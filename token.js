const fs = require("fs");
const UUID = require("uuid");

class token {
    constructor(tokenType) {
        this.content = UUID.v4()
        this.type = tokenType;
        this.dateOfCreation = Date.now();


    }
}