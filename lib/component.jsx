"use strict";

/**
 * React editor, based upon Facebook's Draft.js.
 *
 *
 *
 * <i>Copyright (c) 2016 ItsAsbreuk - http://itsasbreuk.nl</i><br>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 *
 * @module component.jsx
 * @class Editor
 * @since 15.0.0
*/

require("itsa-jsext/lib/object");

let DraftJS, Editor, EditorState, RichUtils, stateToHTML, stateFromHTML;

const utils = require("itsa-utils"),
    isNode = utils.isNode,
    React = require("react"),
    PropTypes = React.PropTypes,
    async = utils.async,
    Form = require("itsa-react-form"),
    MAIN_CLASS = "itsa-editor",
    MAIN_CLASS_PREFIX = MAIN_CLASS+"-",
    CLASS_TOOLBAR = MAIN_CLASS_PREFIX+"toolbar",
    CLASS_EDITOR_AREA = MAIN_CLASS_PREFIX+"editarea",
    CLASS_EDITOR_FLOAT_CONTAINER = MAIN_CLASS_PREFIX+"float-container",
    CLASS_WITH_TOOLBAR = MAIN_CLASS_PREFIX+"with-toolbar";

if (!isNode) {
    DraftJS = require("./draft-js/Draft");
    Editor = DraftJS.Editor;
    EditorState = DraftJS.EditorState;
    RichUtils = DraftJS.RichUtils;
    stateToHTML = require("./stateToHTML");
    stateFromHTML = require("./stateFromHTML");
}

const Component = React.createClass({

    propTypes: {
        /**
         * Decorator for the editor
         *
         * @property decorator
         * @type Object
         * @since 15.0.3
        */
        decorator: PropTypes.object,

        /**
         * Whether the editor is `editable`
         *
         * @property editable
         * @type Boolean
         * @default true
         * @since 15.0.0
        */
        editable: PropTypes.bool,

        /**
         * The Component's editor-state. This is am important property: it needs to be reset
         * every time the editable-area is changed, by listening to the `onChangeState` property.
         *
         * @property editorState
         * @type Object
         * @since 15.0.0
        */
        editorState: PropTypes.object,

        /**
         * The initial content of the editor.
         *
         * @property initialHtml
         * @type String
         * @since 15.0.0
        */
        initialHtml: PropTypes.string,

        /**
         * To specify a minimum height of the editable area.
         * You best need this property, because min-height cannot be set on the Component-class (this doesn't work).
         * Using classes would mean you'll need to set a deeper div
         * where you would need nested classes, to prevent all other editors having the same min-height.
         *
         * @property minHeight
         * @type String
         * @since 15.0.0
        */
        minHeight: PropTypes.string,

        /**
         * Callback whenever the editable-content is changed.
         *
         * @property onChange
         * @type Function
         * @since 15.0.0
        */
        onChange: PropTypes.func,

        /**
         * The callback for the editor's state-change. This is the most important property: it needs to handle
         * state-changes, by re-defining the property `editorState` every time the editable-area is changed.
         *
         * The callback recieves one argument: the new `editorState`
         *
         * @property onChangeState
         * @type Function
         * @since 15.0.0
        */
        onChangeState: PropTypes.func.isRequired,

        /**
         * An array with the definition of the toolbar-items.
         * Because it uses the structure of `itsa-react-form`, you can read more about this
         * feature here: https://www.npmjs.com/package/itsa-react-form
         *
         * @property toolbarItems
         * @type Array
         * @since 15.0.0
        */
        toolbarItems: PropTypes.array
    },

    /**
     * Callbcak when the component will mount.
     * Will backup the value of `this.props.initialHtml`.
     *
     * @method componentWillMount
     * @since 15.0.0
     */
    componentWillMount() {
        const instance = this,
            props = instance.props;
        instance._initialHtml = props.initialHtml;
        instance._decorator = props.decorator;
    },

    /**
     * Empties the editor's content
     *
     * @method empty
     * @private
     * @since 15.1.0
     */
    empty() {
        const newEditorState = EditorState.createEmpty();
        this._handleEditorChange(newEditorState);
    },

    /**
     * Gets the initial props.
     *
     * @method getDefaultProps
     * @return Object
     * @since 15.0.0
     */
    getDefaultProps() {
        return {editable: true};
    },

    /**
     * Will set the focus on the editable area.
     *
     * @method focus
     * @since 15.0.0
     */
    focus() {
        const editor = this.refs.editor;
        editor && editor.focus();
    },

    /**
     * Generates the `html` of the editable area.
     *
     * @method getHtml
     * @return String
     * @since 15.0.0
     */
    getHtml() {
        const props = this.props,
            propsEditorState = props.editorState,
            html = props.initialHtml;
        if (propsEditorState) {
            return stateToHTML(this.props.editorState.getCurrentContent());
        }
        // not edited yet: return default:
        return html || "";
    },

    /**
     * React render-method --> renderes the Component.
     *
     * @method render
     * @return ReactComponent
     * @since 15.0.0
     */
    render() {
        let classname = MAIN_CLASS,
            editor, toolbar, editorState, styles;
        const instance = this,
            props = instance.props,
            disabled = !props.editable,
            minHeight = props.minHeight,
            decorator = props.decorator,
            toolbarItems = props.toolbarItems && props.toolbarItems.itsa_deepClone(),
            html = props.initialHtml,
            propsClass = props.className;
        if (instance._initialHtml!==html) {
            // need to reset the content
            editorState = EditorState.createWithContent(stateFromHTML(html), decorator);
            instance._initialHtml = html;
            instance._decorator = decorator;
            // `Editor` will automatically inform the external state of the changes
        }
        if (instance._decorator!==decorator) {
            // need to reset the content
            editorState = (html ? EditorState.createWithContent(stateFromHTML(html), decorator) : EditorState.createEmpty(decorator));
            instance._decorator = decorator;
            // `Editor` will automatically inform the external state of the changes
        }
        else {
            editorState = isNode ||
                          props.editorState ||
                          (html ? EditorState.createWithContent(stateFromHTML(html), decorator) : EditorState.createEmpty(decorator));
        }
        propsClass && (classname+=" "+propsClass);
        if (isNode || disabled) {
            minHeight && (styles={minHeight: minHeight});
            editor = <div
                className="DraftEditor-root"
                dangerouslySetInnerHTML={{__html: instance.getHtml()}}
                style={styles} />;
        }
        else {
            editor = <Editor
                editorState={editorState}
                handleKeyCommand={instance._handleKeyCommand}
                minHeight={minHeight}
                onChange={instance._handleEditorChange}
                ref="editor" />;
        }
        if (toolbarItems) {
            toolbarItems.forEach(item => {
                let itemProps = item.props;
                // we need to manipulate the callbacks:
                itemProps && itemProps.itsa_each((val, prop) => {
                    if (typeof val==='function') {
                         itemProps[prop] = function() {
                            let newState;
                            if (editorState) {
                                newState = val.apply(instance, Array.prototype.concat.apply(editorState, arguments));
                                newState && instance._handleToolbarStateChange(newState);
                            }
                         }
                    }

                });
            });
            toolbar = <Form
                className={CLASS_TOOLBAR}
                disabled={disabled}
                items={toolbarItems} />;
            classname += " "+CLASS_WITH_TOOLBAR;
        }
        disabled && (classname+=" disabled");
        return (
            <div className={classname}>
                {toolbar}
                <div className={CLASS_EDITOR_FLOAT_CONTAINER}>
                    <div className={CLASS_EDITOR_AREA}>
                        {editor}
                    </div>
                </div>
            </div>
        );
    },

    /**
     * Resets the editor's content to its initial value, specified with `this.props.initialHtml`
     * (or empty if undefined)
     *
     * @method reset
     * @private
     * @since 15.1.0
     */
    reset() {
        const instance = this,
            initialHtml = instance._initialHtml,
            newEditorState = initialHtml ?
                             EditorState.createWithContent(stateFromHTML(initialHtml)) :
                             EditorState.createEmpty();
        instance._handleEditorChange(newEditorState);
    },

    /**
     * Will call `this.props.onChangeState`.
     * Note that `this.props.onChangeState` is responsible for reset this new state, by passing it through
     * to new `this.props.editorState`.
     *
     * Will also call `this.props.onChange` if specified.
     *
     * @method _handleEditorChange
     * @param editorState {Object}
     * @private
     * @since 15.0.0
     */
    _handleEditorChange(editorState) {
        const instance = this,
            props = instance.props,
            onChange = props.onChange;
        props.onChangeState(editorState);
        if (onChange) {
            // go async, to enable the changes to be effected
            async(() => {
                onChange({component: instance, getHtml: instance.getHtml});
            });
        }
    },

    /**
     * Processes keyboard-commands and will set the new state by calling `_handleEditorChange`.
     *
     * @method _handleKeyCommand
     * @param command {String}
     * @private
     * @since 15.0.0
     */
    _handleKeyCommand(command) {
        const newState = RichUtils.handleKeyCommand(this.props.editorState, command);
        if (newState) {
            this._handleEditorChange(newState);
            return true;
        }
        return false;
    },

    /**
     * Processes state-changes that are generated by the toolbar.
     * Will set the new state by calling `_handleEditorChange`.
     *
     * Also, refocusses the editable area.
     *
     * @method _handleToolbarStateChange
     * @return ReactComponent
     * @private
     * @since 15.0.0
     */
    _handleToolbarStateChange(newState) {
        this._handleEditorChange(newState);
        async(() => this.focus());
    }

});

module.exports = Component;
