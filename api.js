const express = require("express")
const subdomain = require("express-subdomain")
const fs = require("fs")
const UUID = require("uuid")

const ports = require("./ports.json")
const API = express.Router()
const APIApp = express()

const version = "v4.0";

const notImplemented = (_, response) => response.status(501).send("not implemented yet")

const TEMP = {} // Place holder storage for unverified users 

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
    switch (path.shift()) {
        case "ip": {
            response.send(`<p>${request.ip}</p><p>${request.ips}</p>`)
            break
        }
    }
})

API.get("/generate/*", (request, response) => {
    const [method, path, query] = getComponents(request)

    switch (path.shift()) {
        case "string": {
            switch (path.shift()) {
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

API.get("/discord", (request, response) => {
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

API.post("/user/*", (request, response) => {
    const components = request.path.split('/')
    components.shift();

    const method = components.shift();

    const body = request.body
    const headers = request.headers
    const query = request.query

    const username = body.username
    const password = body.password
    const traceIP = request.ip;

    switch (method) {


        case "signup": {
            const authToken = UUID.v4()

            fs.writeFileSync(`${__dirname}/storage/tokens/${authToken}.txt`, username)
            fs.writeFileSync(`${__dirname}/storage/users/${username}.json`, JSON.stringify({
                "username": password,
                "ip": traceIP,
                "tokens": {
                    authToken: true
                }
            }))

            response.send({
                "auth-token": authToken
            })
        }

        case "login": {
            
        }

        case "logout": {
            try {
                const authToken = headers.token;
                const tokenPath = `${__dirname}/storage/tokens/${authToken}.txt`
                const user = fs.readFileSync(tokenPath)
                fs.unlink(tokenPath)
                if (user) {
                    const userpath = `${__dirname}/storage/users/${user}`
                    const userInfo = fs.readFileSync(userpath, {
                        "encoding": "utf8",
                        "flag": "r"
                    })
                    if (userInfo) {
                        const parsedUserInfo = JSON.parse(userInfo)
                        parsedUserInfo.tokens[authToken] = null
                        fs.writeFile(userpath, JSON.stringify(parsedUserInfo))
                    }
                }
            } catch(error) {
                // to do
            }
            
           
        }

        case "auth": {
            const token = query.token;
        }
    }
})

APIApp.use(subdomain("api", API))
APIApp.listen(ports.api)

console.log("api.math-rad.com is ready!")
console.log(`PORT: ${ports.api}`)