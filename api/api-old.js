const express = require("express");
const ports = require("../ports.json")
const API = express()

// 3/26/2024 11:13 PM; yeah I attempted to bring my old code from cloudflare on to here, but it's tedious and late and I don't feel like revamping. luckikly there isn't too much functionality yet.

var API_VERSION = "v3";
var URLS = {
  "Access-Control-Allow-Origin": "https://math-rad.com",
  "PastebinAPIEndpoint": "https://pastebin.com/api/api_post.php"
};
var headerPresets = {
  "html": { "Content-Type": "text/html" },
  "urlencoded": { "Content-Type": "application/x-www-form-urlencoded" }
};
var headerIDs = { "ip": "CF-Connecting-IP", "requestURL": "referer" };
var logs = [];

function hookLogs(f) {
  return (...args) => {
    logs.push(args);
    f(...args);
  };
}

console.log = hookLogs(console.log);
console.error = hookLogs(console.error);
console.warn = hookLogs(console.warn);
console.debug = hookLogs(console.debug);






var APICallbacks = {
  "version": async () => API_VERSION,
  "debug": async (fetchdata, url, searchParams, path, method, headers) => {
    const [request, env, ctx] = fetchdata;
    const rootstorage = env.rootstorage;
    switch (path[1]) {
      case "ip":
        return new headers.get(headerIDs.ip);
      case "logs":
        console.log("asdf");
        return new Response(JSON.stringify(logs));
      case "test":
        return "";
      case "do": {

      }
    }
  },
  "start": async (fetchdata, url, searchParams, path, method, headers) => {
    const [request, env, ctx] = fetchdata;
    const logs2 = env.logs;
    await logs2.put("ip-" + headers.get(headerIDs.ip), "***")
    return new `debug info:\n - noted headers:\n\t referer: ${headers.get(headerIDs.requestURL)}\n\t cd-connecting-ip: ${headers.get(headerIDs.ip)}\n\t Cookie: ${headers.get("cookie")}\n\t from: ${headers.get("from")}`
  },
  "generate": async (fetchdata, url, searchparams, path, method, headers) => {
    const [request, env, ctx] = fetchdata;
    switch (path[1]) {
      case "string": {
        switch (path[2]) {
          case "UUID": {
            const parameters = Object.fromEntries(searchparams.entries());
            const version = parameters.version;
            const quantity = parameters.quantity || 1;
            if (!UUIDLib[version]) {
              return new Response('Please provide a valid version, e.g., "v1"');
            }
            const generator = UUIDLib[version];
            const results = [];
            for (let i = 0; i < quantity; i++) {
              try {
                results.push(generator(parameters));
              } catch (err) {
                return new Response("Failed to generate UUID: " + err);
              }
            }
            return new Response(JSON.stringify(results));
          }
        }
      }
    }
  },
  "discord": async (fetchdata, url, searchParams, path, method, headers) => {
    const [request, env, ctx] = fetchdata;
    switch (path[1]) {
      case "hello": {
        const ip = request.headers.get(headerIDs.ip);
        await env.cdn.put(`logged-ip:${ip}`, "0");
        return new Response(`<html>
            <head>
              <meta property="og:title" content="${ip}">
              <meta property="og:description" content="\`\`\`json
    {}
    \`\`\`">
            </head>
            <body>
              <h1>Hello, ${ip}</h1>
            </body>
            </html>`, {
          "headers": headerPresets.html
        });
      }
    }
  },
  "paste": async (fetchdata, url, searchParams, path, method, headers) => {
    const [request, env, ctx] = fetchdata;
    switch (path[1]) {
      case "direct":
        const developerKey = searchParams.get("key");
        const content = searchParams.get("content");
        if (developerKey && content) {
          const link = await (await fetch(URLS.PastebinAPIEndpoint, {
            "method": "POST",
            "headers": headerPresets.urlencoded,
            "body": `api_option=paste&api_dev_key=${developerKey}&api_paste_code=${encodeURIComponent(content)}`
          })).text();
          return new Response(
            `<a href="${link}">${link}</a>`,
            {
              headers: headerPresets.html,
              status: 200
            }
          );
        }
        return new Response('Please provide both "key" and "content" as query parameters.');
      case "formdata":
        var formdata;
        try {
          formdata = await request.formData();
        } catch (ERROR) {
          return new Response("Unable to get formdata: " + ERROR);
        }
        const FDContent = formdata.get("content");
        const FDDeveloperKey = formdata.get("key");
        if (FDContent && FDDeveloperKey) {
          const link = await (await fetch(URLS.PastebinAPIEndpoint, {
            "method": "POST",
            "headers": headerPresets.urlencoded,
            "body": `api_option=paste&api_dev_key=${FDDeveloperKey}&api_paste_code=${encodeURIComponent(FDContent)}`
          })).text();
          return new Response(link, {
            "status": 200
          });
        }
        return new Response('Please provide both "key" and "content" as fields in formdata');
      default:
        return new Response("Invalid subdirectory of /paste, use direct or formdata.");
    }
  }

};


API.get("/*", async (request, response) => {
  const path = request.path.split('/')
  path.shift()
  const APICallback = APICallbacks[path[0]];
  if (APICallback) {
    const response = await APICallback([request], url, searchParams, path, method, headers);
    response.headers.set("Access-Control-Allow-Origin", "https://math-rad.com")
    return response;
  }

  response.send("math-rad.com API endpoint.");
})

API.listen(ports.api)