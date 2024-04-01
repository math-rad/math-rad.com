const express = require("express")

const root = express();

root.get("/", (request, response) => response.sendFile("home.html", {
    "root": `${__dirname}/`
}))

root.listen(8000)

