const express = require("express");
const ports = require("../ports.json")
const stream = express();

const pagesROOT = __dirname + "/pages/"

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

stream.listen(ports.stream)