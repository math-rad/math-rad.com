const express = require("express");
const fs = require("fs")
const errorStrings = require("./errorStrings.json")
const ports = require("../ports.json")
const cdn = express()

const fileROOT = `${__dirname}/file/`
const indexROOT = `${__dirname}/indexes/`

const stringify = JSON.stringify

function updateFileIndex() {
    fs.writeFileSync("file-index.json", stringify(fileIndex))
}

cdn.get("/*", (request, response) => {
    const components = request.path.substring(1).split('/')
    console.log(components[0])
   
    switch(components[0]) {
        case "file": {
            const path = `./file/${components[1]}`
            if (!fs.existsSync(path)) {
                response.redirect(`/error?e=invalidfile&c=${components[1]}&url=${request.url}`)
                break
            }
            response.sendFile(components[1], {
                "root": fileROOT
            });
            break 
        }

        case "index": {
            const index = components[1]
            const path = `./indexes/${index}.json`
            if (!fs.existsSync(path)) {
                response.redirect(`/error?e=badindex&c=${index}&url=${request.url}`)
                break
            }
            const fileInfo = require(path)
            response.sendFile(fileInfo.path, {
                "root": `${__dirname}/file/`
            })
            break
        }

        case "error": {
            console.log("i got an error!")
            const errorIndex = request.query.e
            const errorInfo = errorStrings[errorIndex]
            if (!errorInfo) {
                request.redirect(`/error?e=invaliderror&c=${errorIndex}`)
                break
            }
            response.status(errorInfo.code).send(
                `error: <b>${errorInfo.code}</b>
                ${errorInfo.content && `<p>${errorInfo.content}</p>`}
                ${errorInfo.suggestion && `<p>${errorInfo.suggestion}</p>` || ''}
                ${request.query.c && `<p>regarding <q>${request.query.c}</q> from <q>${request.query.url}</q> </p>`}`
            )

            break
        }

        default: {
            response.redirect(`/error?e=path&c=${components[0]}&url=${request.originalUrl}`)
            break
        }
    }
})

cdn.listen(ports.cdn)

console.log("cdn.math-rad.com is ready!")
console.log(`PORT: ${ports.cdn}`)