const express = require("express")
const fs = require("fs")
const cors = require("cors")

const ports = require("./ports.json")
const configurations = require("./configurations.json")
const internalIndex = require("./cdn/internal/index.json")

const policy = configurations.CORS.policy

const root = express()

root.get("/", cors(policy), (request, response) => {
    response.redirect("home")
})

root.get("/home", cors(policy), (request, response) => {
    response.sendFile(`${__dirname}/${internalIndex["static-root-webpage"]}`)
})

root.get("/test", cors(policy), (request, response) => {
   response.send("hi!");
})





root.listen(ports.root)
