/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
  setupBrowserWindow,
  teardownBrowserWindow,
} from "./setup.js";

import { Ci, Cu, } from "../service/chrome.js";

const { Services } = Cu.import("resource://gre/modules/Services.jsm", {});

// nsIWindowMediatorListener
const WindowListener = {

  /**
   * @param {Window} aXulWindow
   * @returns {void}
   */
  onOpenWindow(aXulWindow) {
    const domWindow = aXulWindow.QueryInterface(Ci.nsIInterfaceRequestor) // eslint-disable-line new-cap
      .getInterface(Ci.nsIDOMWindow);

    // Wait finish loading
    // Use `DOMContentLoaded` to avoid the error.
    // see https://blog.mozilla.org/addons/2014/03/06/australis-for-add-on-developers-2/
    domWindow.addEventListener("DOMContentLoaded", function onLoad(aEvent) {
      const w = aEvent.currentTarget;
      w.removeEventListener("DOMContentLoaded", onLoad, false);
      setupBrowserWindow(w);
    }, false);
  },

  onCloseWindow(/*aXulWindow*/) {}, // eslint-disable-line no-empty-function

  onWindowTitleChange(/*aWindow, aNewTitle*/) {}, // eslint-disable-line no-empty-function
};

function attachWindowListener() {
  Services.wm.addListener(WindowListener);
}

function detachWindowListener() {
  Services.wm.removeListener(WindowListener);
}

export function initializeUIForEachChromeWindow() {
  attachWindowListener();

  const windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    const domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow); // eslint-disable-line new-cap
    setupBrowserWindow(domWindow);
  }
}

export function destroyUIForEachChromeWindow() {
  detachWindowListener();

  const windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    const domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow); // eslint-disable-line new-cap
    teardownBrowserWindow(domWindow);
  }
}