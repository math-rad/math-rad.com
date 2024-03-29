const express = require("express");
const subdomain = require("express-subdomain");
const sesession = require("express-session");

const fs = require("fs");
const UUID = require("uuid");

const ports = require("../ports.json");


const API = express.Router()
const CDN = express.Router();
const STREAM = express.Router();

const service = express()

async function init_API() {
    const errorStrings = require("./api/errorStrings.json")
    const version = "v3.0";

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
                } catch (error) {
                    // to do
                }


            }

            case "auth": {
                const token = query.token;
            }
        }
    })

}

async function init_CDN() {
    const errorStrings = require("./cdn/errorStrings.json")

    const fileROOT = `${__dirname}/cdn/file/`
    const indexROOT = `${__dirname}/cdn/indexes/`

    const stringify = JSON.stringify

    function updateFileIndex() {
        fs.writeFileSync("file-index.json", stringify(fileIndex))
    }

    CDN.get("/*", (request, response) => {
        const components = request.path.substring(1).split('/')
        console.log(components[0])

        switch (components[0]) {
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
}

async function init_stream() {
    const pagesROOT = `${__dirname}/stream/pages/`

    stream.get("/", (request, response) => response.redirect("/home"))
    stream.get("/home", (request, response) => {
        response.sendFile("home.html", {
            "root": pagesROOT
        })
    })


    stream.get("/watch", (request, response) => {
        response.sendFile("watch.html", {
            "root": pagesROOT
        })
    })

    stream.get("/*", (request, response) => {
        response.sendFile("unknown.html", {
            "root": pagesROOT
        })
    })

}

async function main() {
   await init_API();
   console.log("started api.math-rad.com");

   await init_CDN();
   console.log("started cdn.math-rad.com");

   await init_stream();
   console.log("started stream.math-rad.com");

   service.use(subdomain("api", API))
   service.use(subdomain("cdn", CDN))
   service.use(subdomain("stream", STREAM))
   service.listen(ports.subdomain)

   console.log(`Listening on port: ${ports.subdomain}`)



   console.log("subdomain server is ready and active!");
}
main();
