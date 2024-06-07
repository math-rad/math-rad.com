const express = require("express")
const fs = require("fs")

const ports = require("./ports.json")
const configurations = require("./configurations.json")
const internalIndex = require("./cdn/internal/index.json")

const root = express()

root.get("/", (request, response) => {
    response.redirect("home")
})

root.get("/home", (request, response) => {
    response.sendFile(`${__dirname}/${internalIndex["static-root-webpage"]}`)
})





root.listen(ports.root)