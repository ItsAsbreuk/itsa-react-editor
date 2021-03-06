/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule editOnBlur
 *
 */

'use strict';

var isNode = require('itsa-utils').isNode;

var EditorState = require('./EditorState');
var UserAgent = isNode || require('fbjs/lib/UserAgent');

var getActiveElement = require('fbjs/lib/getActiveElement');

var isWebKit = !isNode && UserAgent.isEngine('WebKit');

function editOnBlur(e) {
  // Webkit has a bug in which blurring a contenteditable by clicking on
  // other active elements will trigger the `blur` event but will not remove
  // the DOM selection from the contenteditable. We therefore force the
  // issue to be certain, checking whether the active element is `body`
  // to force it when blurring occurs within the window (as opposed to
  // clicking to another tab or window).
  if (isWebKit && getActiveElement() === document.body) {
    window && window.getSelection && window.getSelection().removeAllRanges();
  }

  var editorState = this.props.editorState;
  var currentSelection = editorState.getSelection();
  if (!currentSelection.getHasFocus()) {
    return;
  }

  var selection = currentSelection.set('hasFocus', false);
  this.props.onBlur && this.props.onBlur(e);
  this.update(EditorState.acceptSelection(editorState, selection));
}

module.exports = editOnBlur;