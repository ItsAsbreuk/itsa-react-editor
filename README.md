[![Build Status](https://travis-ci.org/ItsAsbreuk/itsa-react-editor.svg?branch=master)](https://travis-ci.org/ItsAsbreuk/itsa-react-editor)

React editor, based upon Facebook's Draft.js.

I've built this Component, because I like `Draft.js`, but experienced problems when using it together with serverside rendering and webpack. Also, I wanted to have a higher level Component, that has several features by default and that has a `Toolbar` integrated and automatic reset the focus to the editor after the toolbar is used.

Currently only a predefined toolbar with simple BIU buttons, but you can easily extend (see examples). No test yet.

Feel free to use this Component, or use Facebook's awesome Draft.js, if you want a more low-level Editor, which will need more setup.

**Note** As from version `15.1.0` the toolbar-helpers return a function that needs to be invoked. This is, because future toolbars mey accept a config.

## How to use:

Below are some setups. You can retrieve the Html of the editor (f.e. when you want to save the content), by means of componentInstance.getHtml().

#### Simple usage
```js
"use strict";

require("itsa-react-button/css/component.scss");
require("itsa-react-editor/css/component.scss");

let editor;

const React = require("react"),
    ReactDOM = require("react-dom"),
    Editor = require("itsa-react-editor"),
    toolbarBIU = require("itsa-react-editor/helpers/toolbar/biu")(); // invoke!

const handleStateChange = editorState => {
    props.editorState = editorState;
    renderEditor();
};

let props = {
    editable: true,
    initialHtml: 'Hey <strong>Look here!</strong><br>I am initial text...',
    minHeight: '200px',
    onChange: function(cb) {
        // you can use the cb.getHtml function to generate the HTML of the editor.
        // However, update the editor with onChangeState!
        console.warn(cb.getHtml());
    },
    onChangeState: handleStateChange,
    toolbarItems: toolbarBIU
};

var renderEditor = () => {
    editor = ReactDOM.render(
        <Component {...props} />,
        document.getElementById("component-container")
    );
};

renderEditor();

// editor.getHtml() will return the editor's content
```

#### Extended usage with own buttons
Make sure that the button-callbacks return a new editorState:

```js
"use strict";

require("itsa-react-button/css/component.scss");
require("itsa-react-editor/css/component.scss");

let editor;

const React = require("react"),
    ReactDOM = require("react-dom"),
    Editor = require("itsa-react-editor"),
    Button = require("itsa-react-button"),
    RichUtils = require("itsa-react-editor/helpers/rich-utils");

const handleStateChange = editorState => {
    props.editorState = editorState;
    renderEditor();
};

const handleBoldClick = editorState => {
    return RichUtils.toggleInlineStyle(editorState, "BOLD");
};

const handleItalicClick = editorState => {
    return RichUtils.toggleInlineStyle(editorState, "ITALIC");
};

const handleUnderscoreClick = editorState => {
    return RichUtils.toggleInlineStyle(editorState, "UNDERLINE");
};

let props = {
    editable: true,
    initialHtml: 'Hey <strong>Look here!</strong><br>I am initial text...',
    minHeight: '200px',
    onChange: function(cb) {
        // you can use the cb.getHtml function to generate the HTML of the editor.
        // However, update the editor with onChangeState!
        console.warn(cb.getHtml());
    },
    onChangeState: handleStateChange,
    toolbarItems: [
        {
            component: Button,
            props: {
                buttonText: "B",
                className: "toolbar-btn",
                onClick: handleBoldClick
            }
        },
        {
            component: Button,
            props: {
                buttonText: "I",
                className: "toolbar-btn",
                onClick: handleItalicClick
            }
        },
        {
            component: Button,
            props: {
                buttonText: "U",
                className: "toolbar-btn",
                onClick: handleUnderscoreClick
            }
        }
    ]
};

var renderEditor = () => {
    editor = ReactDOM.render(
        <Component {...props} />,
        document.getElementById("component-container")
    );
};

renderEditor();

// editor.getHtml() will return the editor's content
```

## About the css

You need the right css in order to make use of `itsa-react-editor`. There are 2 options:

1. You can use the css-files inside the `css`-folder.
2. You can use: `Component = require("itsa-react-editor/lib/component-styled.jsx");` and build your project with `webpack`. This is needed, because you need the right plugin to handle a requirement of the `scss`-file.


[View live example](http://projects.itsasbreuk.nl/react-components/itsa-editor/component.html)

[API](http://projects.itsasbreuk.nl/react-components/itsa-editor/api/)