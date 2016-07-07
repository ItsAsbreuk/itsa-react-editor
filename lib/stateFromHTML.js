"use strict";

const DraftJsImportElement = require("./draft-js-import-element/main"),
    stateFromElement = DraftJsImportElement.stateFromElement;

function parseHTML(html) {
    let doc, parser;
    if (window && (typeof window.DOMParser !== "undefined")) {
        parser = new window.DOMParser();
        doc = parser.parseFromString(html, "text/html");
    }
    else {
        doc = document.implementation.createHTMLDocument("");
        doc.documentElement.innerHTML = html;
    }
    return doc.body;
}

module.exports = function stateFromHTML(html, options) {
    let parser = (options && options.parser) ? options.parser : parseHTML,
        element = parser(html);
    return stateFromElement(element, options);
};
