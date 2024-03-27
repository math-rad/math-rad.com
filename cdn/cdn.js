const express = require("express");
const fs = require("node:fs")
const errorStrings = require("./errorStrings.json")
const ports = require("../ports.json")
const cdn = express()

const stringify = JSON.stringify

function updateFileIndex() {
    fs.writeFileSync("file-index.json", stringify(fileIndex))
}

cdn.get("/*", (request, response) => {
    const components = request.url.substring(1).split('/')
    switch(components[0]) {
        case "file": {
            const path = `files/${components[1]}`
            if (!fs.existsSync(path)) {
                response.redirect(`error?e=invalidfile&c=${components[1]}`)
                break
            }
            break 
        }

        case "index": {
            const index = components[1]
            const path = `indexes/${index}.json`
            if (!fs.existsSync(path)) {
                response.redirect(`error?e=badindex&c=${index}`)
                break
            }
            const fileInfo = require(path)
            response.sendFile(fileInfo.path)
            break
        }

        case "error": {
            const errorIndex = request.query.e
            const errorInfo = errorStrings[errorIndex]
            if (!errorInfo) {
                request.redirect(`error?e=invaliderror&c=${errorIndex}`)
                break
            }

            response.status(errorInfo.code).send(
                `error: <b>${errorInfo.code}</b>\n,
                ${errorInfo.content}\n
                ${errorInfo.suggestion && errorInfo.suggestion || ''}\n
                ${request.query.c && `regarding "${request.query.c}"`}\n
                ${request.query.url && `original url: ${request.query.url}`}
                `
            )

            break
        }

        default: {
            response.redirect(`error?e=path&c=${components[0]}&url=${request.originalUrl}`)
        }
    }
})

cdn.listen(ports.cdn)