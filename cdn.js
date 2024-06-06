const express = require("express")
const fs = require("fs")

const ports = require("./ports.json")
const configurations = require("./configurations.json")

const internalIndex = require("./cdn/internal/index.json")

const cdn = express()

function serve() {

}

cdn.get("/internal/*", (request, response) => {
    const index = request.path.substring(1).split('/')[1]
    const path = `${__dirname}/${internalIndex[index]}`
    if (fs.existsSync(path)) {
        response.sendFile(path)
        console.log(path)
    }
})

cdn.get("favicon.ico", (request, response) => {
    response.send(response.sendFile("http://cdn.math-rad.com/internal/favicon"))
})

cdn.get("/error", (request, response) => {

})

cdn.listen(ports.cdn)