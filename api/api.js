const express = require("express");
const ports = require("../ports.json")
const errorStrings = require("./errorStrings.json")
const UUID = require("uuid");

const version = "v2.0";

const API = express();

const notImplemented = (_, response) => response.status(501).send("not implemented yet")

/**
 * 
 * @param {express.Request} request 
 */
function getComponents(request) {
    const path = request.path.split('/')
    path.shift();
    return [path.shift(), path, request.query]
}

API.get("/", (request, response) => {
    response.send("api.math-rad.com endpoint. " + version)
})

API.get("/error", notImplemented)

API.get("/stream/join", notImplemented)

API.get("/version", (_, response) => response.send(version))

API.get("/debug/*", (request, response) => {
    const [method, path, query] = getComponents(request)
    switch(path.shift()) {
        case "ip": {
            response.send(request.ip)
            break
        }
    }
})

API.get("/generate/*", (request, response) => {
    const [method, path, query] = getComponents(request)

    switch(path.shift()) {
        case "string": {
            switch(path.shift()) {
                case "UUID": {
                   const version = query.v
                   const quantity = query.quantity || 1
                   const gen = UUID[version];
                   const UUIDs = [];
                   if (!gen) {
                    const errorInfo = errorStrings["uuidbadversion"];
                    response.status(errorInfo.code).send(errorInfo.content)
                   }
                   for (let i = 0; i++ < quantity;) {
                    try {
                        UUIDs.push(gen())
                    } catch (err) {
                        response.status(500).send("failed to generate uuid " + err)
                    }
                   }
                   response.send(JSON.stringify(UUIDs))
                   break
                }
            }
            break
        }
    }
})

API.get("/discord/*", (request, response) => {
    const [method, path, query] = getComponents(request)
    response.send(
        `
        <html>
            <head>
                <meta property="og:title" content="${query.title}">
                <meta property="og:description" content="${query.description}">
            </head>
        </html>
        `
    )
})

API.listen(ports.api);
console.log("api.math-rad.com is ready!")