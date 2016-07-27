/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint-env commonjs */
"use strict";

// eslint-disable-next-line no-unused-vars
const EXPORTED_SYMBOLS = ["createWidget", "destroyWidget"];

const Cu = Components.utils;

const BUTTON_ID = "linkplaces-menu-button";
const PANEL_UI_ID = "PanelUI-linkplaces";
const PLACES_VIEW_ID = "panelMenu_linkplacesMenu";

const { CustomizableUI } = Cu.import("resource:///modules/CustomizableUI.jsm", {});
const { LinkplacesService } = Cu.import("chrome://linkplaces/content/LinkplacesService.js", {});

const { require } = Cu.import("resource://gre/modules/commonjs/toolkit/require.js", {});
const { createToolbarButton, DOM_ID_TOOLBAR_BUTTON, } = require("./ui/LinkplacesChromeToolbar.js");

let registeredWidget = null;
function isRegistered() {
  if (registeredWidget === null) {
    return false;
  }

  const id = registeredWidget.id;
  const registred = CustomizableUI.getWidget(id);
  if (!!registred) {
    return true;
  }
  else {
    return false;
  }
}

function createWidget() {
  // If we call this register method with same id multiple times
  // (e.g. load in each browser window), this method fails to register except 1st time.
  // So we need to call this only once.
  if (isRegistered()) {
    // noop
    return;
  }

  registeredWidget = CustomizableUI.createWidget({
    id: BUTTON_ID,
    type: "view",
    label: LinkplacesService.stringBundle.GetStringFromName("linkplaces.widget.button.label"), // eslint-disable-line new-cap
    viewId: PANEL_UI_ID,
    tooltiptext: LinkplacesService.stringBundle.GetStringFromName("linkplaces.widget.button.tooltip"), // eslint-disable-line new-cap
    defaultArea: CustomizableUI.AREA_PANEL,

    onViewShowing: function (aEvent) {
      const win = aEvent.target.ownerDocument.defaultView;

      const query = LinkplacesService.QUERY_URI;
      const viewId = PLACES_VIEW_ID;
      const rootId = viewId;
      const option = {
        extraClasses: {
          entry: "subviewbutton",
          footer: "panel-subview-footer"
        }
      };

      this._panelMenuView = new win.PlacesPanelMenuView(query, viewId, rootId, option);
    },

    onViewHiding: function (/* aEvent */) {
      this._panelMenuView.uninit();
      this._panelMenuView = null;
    },

  });

  CustomizableUI.createWidget({
    id: DOM_ID_TOOLBAR_BUTTON,
    type: "custom",
    defaultArea: CustomizableUI.AREA_PANEL,
    onBuild(doc) {
      return createToolbarButton(doc.defaultView, LinkplacesService);
    }
  });
}

function destroyWidget() {
  if (!isRegistered()) {
    return;
  }

  const id = registeredWidget.id;
  CustomizableUI.destroyWidget(id);
  registeredWidget = null;
}

this.createWidget = createWidget; // eslint-disable-line no-invalid-this
this.destroyWidget = destroyWidget; // eslint-disable-line no-invalid-this
