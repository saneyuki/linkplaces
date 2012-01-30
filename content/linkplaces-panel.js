var LinkplacesPanel = {

	get treeView () {
		delete this.treeView;
		return this.treeView = document.getElementById("linkplaces-view");
	},
	set treeView (v) {},

	get ctxMenu () {
		delete this.ctxMenu;
		return this.ctxMenu = document.getElementById("placesContext");
	},
	set ctxMenu (v) {},

	get service () {
		delete this.service;
		Components.utils.import("resource://linkplaces/linkplaces.js");
		return this.service = LinkplacesService;
	},

	get PREF () {
		delete this.PREF;
		return this.PREF = this.service.PREF;
	},

	get placesController () {
		delete this.placesController;
		let self = this;
		let placesController = new PlacesController(this.treeView);
		placesController._isCommandEnabled = placesController.isCommandEnabled;
		placesController.isCommandEnabled = function (aCmd) {
			switch (aCmd) {
				case "placesCmd_new:bookmark":
				case "placesCmd_new:folder":
				case "placesCmd_createBookmark":// for History
				case "placesCmd_deleteDataHost":// for History
				case "placesCmd_reload":
				case "placesCmd_reloadMicrosummary":
				case "placesCmd_sortBy:name":
					return false;
				default:
					return this._isCommandEnabled(aCmd);
			}
		};
		placesController._doCommand = placesController.doCommand;
		placesController.doCommand = function (aCmd) {
			this._doCommand(aCmd);
			switch (aCmd) {
				case "placesCmd_open":
				case "placesCmd_open:window":
				case "placesCmd_open:tab":
					self.focusSidebarWhenItemsOpened();
					self.service.removeItem(this._view.selectedNode.itemId);
					break;
			}
		};
		return this.placesController = placesController;
	},

	handleEvent: function (aEvent) {
		switch (aEvent.type) {
			case "load":
				this.onLoad();
				break;
			case "unload":
				this.onUnLoad();
				break;
			case "SidebarFocused":
				this.onSidebarFocused();
				break;
		}
	},

	onLoad: function () {
		window.removeEventListener("load", this, false);

		// initialize
		this.initPlacesView();
		this.treeView.controllers.insertControllerAt(0, this.placesController);
		this.overrideCmdOpenMultipleItem();

		window.addEventListener("unload", this, false);
		window.addEventListener("SidebarFocused", this, false);
	},

	onUnLoad: function() {
		window.removeEventListener("unload", this, false);
		window.removeEventListener("SidebarFocused", this, false);

		this.setMouseoverURL("");

		// finalize
		this.treeView.controllers.removeControllerAt(0);
		this.placesController = null;

		this.treeView = null;
		this.ctxMenu  = null;
	},

	onSidebarFocused: function () {
		this.treeView.focus();
	},

	initPlacesView: function() {
		let historySvc = this.service.historySvc;

		let query = historySvc.getNewQuery();
		let linkplacesFolder = this.service.folder;
		query.setFolders([linkplacesFolder], 1);
		//query.searchTerms = "";
		query.onlyBookmarked = true;

		let queryOpts = historySvc.getNewQueryOptions();
		queryOpts.queryType = queryOpts.QUERY_TYPE_BOOKMARKS;//queryType=1

		let placesQuery = historySvc.queriesToQueryString([query], 1, queryOpts);

		this.treeView.place = placesQuery;
	},

	overrideCmdOpenMultipleItem: function () {
		let cmdValue = <![CDATA[
			var triggerNode = LinkplacesPanel.ctxMenu.triggerNode;
			var controller = PlacesUIUtils.getViewForNode(triggerNode).controller;
			LinkplacesPanel.openSelectionInTabs(controller, event);
		]]>;
		["placesContext_openContainer:tabs",
		 "placesContext_openLinks:tabs"].forEach(function(aElm){
		 	 document.getElementById(aElm).setAttribute("oncommand", cmdValue.toString());
		});
	},

	// Based on "chrome://browser/content/bookmarks/sidebarUtils.js"
	handleTreeClick: function (aEvent, aGutterSelect) {
		// When right button click
		if (aEvent.button == 2) {
			return;
		}

		let tree = aEvent.target.parentNode;
		let treeBoxObj = tree.treeBoxObject;
		let row = {}, col = {}, obj = {};
		treeBoxObj.getCellAt(aEvent.clientX, aEvent.clientY, row, col, obj);

		if (row.value == -1 ||  obj.value == "twisty") {
			return;
		}

		// whether mouse in opening item area or not.
		let mouseInGutter = false;
		let cellX = {}, cellY = {}, cellW = {}, cellH = {};
		if (aGutterSelect) {
			treeBoxObj.getCoordsForCellItem(row.value, col.value, "image", cellX, cellY, cellW, cellH);

			let isRTL = (window.getComputedStyle(tree, null).direction == "rtl");
			if (isRTL) {
				mouseInGutter = (aEvent.clientX > cellX.value);
			}
			else {
				mouseInGutter = (aEvent.clientX < cellX.value);
			}
		}

		let modifKey = (aEvent.ctrlKey || aEvent.metaKey) || aEvent.shiftKey;
		let isContainer = treeBoxObj.view.isContainer(row.value);
		let openInTabs = isContainer &&// Is the node container?
		                 // Is event is middle-click, or left-click with ctrlkey?
		                 (aEvent.button == 1 || (aEvent.button == 0 && modifKey)) &&
		                 //Does the node have child URI node?
		                 PlacesUtils.hasChildURIs(treeBoxObj.view.nodeForTreeIndex(row.value));

		if (aEvent.button == 0 && isContainer && !openInTabs) {
			treeBoxObj.view.toggleOpenState(row.value);
			return;
		}
		else if (!mouseInGutter && aEvent.originalTarget.localName == "treechildren") {
			if (openInTabs) {
				treeBoxObj.view.selection.select(row.value);
				PlacesUIUtils.openContainerNodeInTabs(tree.selectedNode, aEvent);
				this.focusSidebarWhenItemsOpened();
				this.service.removeItem(tree.selectedNode.itemId);
			}
			else if (!isContainer) {
				treeBoxObj.view.selection.select(row.value);
				this.openNodeWithEvent(tree.selectedNode, aEvent, this.treeView);
			}
		}
	},

	handleTreeKeyPress: function (aEvent) {
		if (aEvent.keyCode == KeyEvent.DOM_VK_RETURN) {
			let node = aEvent.target.selectedNode;
			if (PlacesUtils.nodeIsURI(node)) {
				this.openNodeWithEvent(node, aEvent, this.treeView);
			}
		}
	},

	handleTreeMouseMove: function (aEvent) {
		if (aEvent.target.localName != "treechildren") {
			return;
		}

		let tree = aEvent.target.parentNode;
		let treeBoxObj = tree.treeBoxObject;
		let row = {}, col = {}, obj = {};
		treeBoxObj.getCellAt(aEvent.clientX, aEvent.clientY, row, col, obj);

		if (row.value != -1) {
			let node = tree.view.nodeForTreeIndex(row.value);
			if (PlacesUtils.nodeIsURI(node)) {
				this.setMouseoverURL(node.uri);
			}
			else {
				this.setMouseoverURL("");
			}
		}
		else {
			this.setMouseoverURL("");
		}
	},

	setMouseoverURL: function (aURI) {
		let XULBrowserWindow = window.top.XULBrowserWindow;
		if (XULBrowserWindow) {
			XULBrowserWindow.setOverLink(aURI, null);
		}
	},

	openNodeWithEvent: function (aNode, aEvent, aView) {
		let where = this.whereToOpenLink(aEvent, aNode.uri);

		PlacesUIUtils.openNodeIn(aNode, where, aView);

		this.focusSidebarWhenItemsOpened();

		this.service.removeItem(aNode.itemId);
	},

	whereToOpenLink: function (aEvent, aURI) {
		let rv = "";
		if (this.isBookmarklet(aURI)) {
			rv = "current";//for bookmarklet
		}
		else {
			let where = whereToOpenLink(aEvent);
			switch (where) {
				case "current":
					rv = this.PREF.openLinkToWhere;
					break;
				default:
					rv = where;
					break;
			}
		}
		return rv;
	},

	isBookmarklet: function (aURI) {
		return (aURI.indexOf("javascript:") == 0) ? true : false;
	},

	openSelectionInTabs: function(aController, aEvent) {
		aController.openSelectionInTabs(aEvent);

		this.focusSidebarWhenItemsOpened();

		if (aController && aController.isCommandEnabled("placesCmd_delete")) {
			aController.doCommand("placesCmd_delete");
		}
	},

	focusSidebarWhenItemsOpened: function () {
		if (this.PREF.focusWhenItemsOpened_Sidebar) {
			this.treeView.focus();
		}
	},

};
window.addEventListener("load", LinkplacesPanel, false);