/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule editOnBeforeInput
 *
 */

// When nothing is focused, Firefox regards two characters, `'` and `/`, as
// commands that should open and focus the "quickfind" search bar. This should
// *never* happen while a contenteditable is focused, but as of v28, it
// sometimes does, even when the keypress event target is the contenteditable.
// This breaks the input. Special case these characters to ensure that when
// they are typed, we prevent default on the event to make sure not to
// trigger quickfind.
'use strict';

var isNode = require('itsa-utils').isNode;

var BlockTree = require('./BlockTree');
var DraftModifier = require('./DraftModifier');
var EditorState = require('./EditorState');
var UserAgent = isNode || require('fbjs/lib/UserAgent');

var getEntityKeyForSelection = require('./getEntityKeyForSelection');
var isSelectionAtLeafStart = require('./isSelectionAtLeafStart');
var nullthrows = require('fbjs/lib/nullthrows');

var FF_QUICKFIND_CHAR = '\'';
var FF_QUICKFIND_LINK_CHAR = '\/';
var isFirefox = !isNode && UserAgent.isBrowser('Firefox');

function mustPreventDefaultForCharacter(character) {
  return isFirefox && (character == FF_QUICKFIND_CHAR || character == FF_QUICKFIND_LINK_CHAR);
}

/**
 * Replace the current selection with the specified text string, with the
 * inline style and entity key applied to the newly inserted text.
 */
function replaceText(editorState, text, inlineStyle, entityKey) {
  var contentState = DraftModifier.replaceText(editorState.getCurrentContent(), editorState.getSelection(), text, inlineStyle, entityKey);
  return EditorState.push(editorState, contentState, 'insert-characters');
}

/**
 * When `onBeforeInput` executes, the browser is attempting to insert a
 * character into the editor. Apply this character data to the document,
 * allowing native insertion if possible.
 *
 * Native insertion is encouraged in order to limit re-rendering and to
 * preserve spellcheck highlighting, which disappears or flashes if re-render
 * occurs on the relevant text nodes.
 */
function editOnBeforeInput(e) {
  var chars = e.data;

  // In some cases (ex: IE ideographic space insertion) no character data
  // is provided. There's nothing to do when this happens.
  if (!chars) {
    return;
  }

  // Allow the top-level component to handle the insertion manually. This is
  // useful when triggering interesting behaviors for a character insertion,
  // Simple examples: replacing a raw text ':)' with a smile emoji or image
  // decorator, or setting a block to be a list item after typing '- ' at the
  // start of the block.
  if (this.props.handleBeforeInput && this.props.handleBeforeInput(chars)) {
    e.preventDefault();
    return;
  }

  // If selection is collapsed, conditionally allow native behavior. This
  // reduces re-renders and preserves spellcheck highlighting. If the selection
  // is not collapsed, we will re-render.
  var editorState = this.props.editorState;
  var selection = editorState.getSelection();

  if (!selection.isCollapsed()) {
    e.preventDefault();
    this.update(replaceText(editorState, chars, editorState.getCurrentInlineStyle(), getEntityKeyForSelection(editorState.getCurrentContent(), editorState.getSelection())));
    return;
  }

  var mayAllowNative = !isSelectionAtLeafStart(editorState);
  var newEditorState = replaceText(editorState, chars, editorState.getCurrentInlineStyle(), getEntityKeyForSelection(editorState.getCurrentContent(), editorState.getSelection()));

  if (!mayAllowNative) {
    e.preventDefault();
    this.update(newEditorState);
    return;
  }

  var anchorKey = selection.getAnchorKey();
  var anchorTree = editorState.getBlockTree(anchorKey);

  // Check the old and new "fingerprints" of the current block to determine
  // whether this insertion requires any addition or removal of text nodes,
  // in which case we would prevent the native character insertion.
  var originalFingerprint = BlockTree.getFingerprint(anchorTree);
  var newFingerprint = BlockTree.getFingerprint(newEditorState.getBlockTree(anchorKey));

  if (mustPreventDefaultForCharacter(chars) || originalFingerprint !== newFingerprint || nullthrows(newEditorState.getDirectionMap()).get(anchorKey) !== nullthrows(editorState.getDirectionMap()).get(anchorKey)) {
    e.preventDefault();
  } else {
    // The native event is allowed to occur.
    newEditorState = EditorState.set(newEditorState, {
      nativelyRenderedContent: newEditorState.getCurrentContent()
    });
  }

  this.update(newEditorState);
}

module.exports = editOnBeforeInput;