const express = require("express")
const fs = require("fs")
const cors = require("cors")

const ports = require("./ports.json")
const configurations = require("./configurations.json")

const internalIndex = require("./files/internal/index.json")

const cdn = express()

const policy = configurations.CORS.policy

function serve() {

}
cdn.get("/internal/*", cors(policy), (request, response) => {
    const index = request.path.substring(1).split('/')[1]
    const path = `${__dirname}/${internalIndex[index]}`
    if (fs.existsSync(path)) {
        response.sendFile(path, {
            "headers": {
                
            }
        })
        console.log(path)
    }
})

cdn.get("/favicon.ico", cors(policy), (request, response) => {
    response.send(response.sendFile("http://cdn.math-rad.com/internal/favicon"))
})

cdn.get("/error", cors(policy), (request, response) => {

})

cdn.listen(ports.cdn)