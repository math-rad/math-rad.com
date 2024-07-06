const express = require("express")
const fs = require("fs")
const cors = require("cors")

const ports = require("./ports.json")
const configurations = require("./configurations.json")

const internalIndex = require("./files/internal/index.json")

const files = express()

const policy = configurations.CORS.policy

function serve() {

}
files.get("/internal/*", cors(policy), (request, response) => {
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

files.get("/favicon.ico", cors(policy), (request, response) => {
    response.send(response.sendFile("http://cdn.math-rad.com/internal/favicon"))
})

files.get("/error", cors(policy), (request, response) => {

})

files.listen(ports.cdn)

console.log(`files.math-rad.com is now active on port:" ${ports.files}`)