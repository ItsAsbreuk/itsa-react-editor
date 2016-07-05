"user strict";

const isNode = (typeof global!=="undefined") && ({}.toString.call(global)==="[object global]") && (!global.document || ({}.toString.call(global.document)!=="[object HTMLDocument]")),
    Button = require("itsa-react-button"),
    RichUtils = isNode || require("./rich-utils");

const handleBoldClick = editorState => {
    return RichUtils.toggleInlineStyle(editorState, "BOLD");
};

const handleItalicClick = editorState => {
    return RichUtils.toggleInlineStyle(editorState, "ITALIC");
};

const handleUnderscoreClick = editorState => {
    return RichUtils.toggleInlineStyle(editorState, "UNDERLINE");
};

const toolbarItems = [
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
];

module.exports = () => {
    return toolbarItems;
};
