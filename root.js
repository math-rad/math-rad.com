const express = require("express")
const fs = require("fs")
const cors = require("cors")

const ports = require("./ports.json")
const configurations = require("./configurations.json")
const internalIndex = require("./files/internal/index.json")

const policy = configurations.CORS.policy

const root = express()

root.get("/", cors(policy), (request, response) => {
    response.redirect("home")
})

root.get("/home", cors(policy), (request, response) => {
    response.sendFile(`${__dirname}/${internalIndex["static-root-webpage"]}`)
})


root.listen(ports.root)

console.log(`math-rad.com is now active on port: ${ports.root}`);