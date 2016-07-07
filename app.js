"use strict";

require("itsa-react-button/css/component.scss");

const React = require("react"),
    ReactDOM = require("react-dom"),
    Component = require("./lib/component-styled.jsx"),
    toolbarBIU = require("./helpers/toolbars/biu")(); // invoke!

const handleStateChange = editorState => {
    props.editorState = editorState;
    renderEditor();
};

let props = {
    editable: false,
    initialHtml: 'Hello World!',
    minHeight: '200px',
    onChange: function(cb) {
        console.warn(cb.getHtml());
    },
    onChangeState: handleStateChange,
    toolbarItems: toolbarBIU
};

var renderEditor = () => {
    ReactDOM.render(
        <Component {...props} />,
        document.getElementById("component-container")
    );
};

renderEditor();