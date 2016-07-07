"user strict";

const isNode = require("itsa-utils").isNode,
    Button = require("itsa-react-button"),
    RichUtils = isNode || require("../rich-utils");

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
