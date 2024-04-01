const { clear } = require("console");
const fs = require("fs");
const UUID = require("uuid");

class token {
    constructor(clearance, data) {
        const tokenContent = UUID.v4();

        this.date = Date.now();
        this.clearance = clearance;
        this.data = data;
    }
}