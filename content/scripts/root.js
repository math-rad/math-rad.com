// Script: root.js
// Created: 6/12/2024
// Description: utility functions & other functionality

async function extractSource(url) {
    return await fetch(url).then(response => response.text())
}

function codeblockLang(content, language) {
    return`
            <code>${hljs.highlight(content, {
                    "language": language
                }).value}
            </code>`
}

function codeblock(content) {
    return `
    <code>${content}</code>
    `
}

async function codeblockLangSource(url, language) {
    return  codeblockLang(await extractSource(url), language)
}

async function codeblockSource(url) {
    return codeblock(await extractSource(url))
}

async function codeblockLangSourceToElement(url, language, id) {
    document.getElementById(id).innerHTML = await codeblockLangSource(url, language)
}

async function codeblockSourceToElement(url, id) {
    document.getElementById(id).innerHTML = await codeblockSource(url)
}
