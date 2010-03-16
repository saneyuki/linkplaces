var LinkplacesPanel = {

	PREF_DOMAIN: "",

	PREF: {
		
	},

	_prefBranch: null,
	get prefBranch() {
		if (!this._prefBranch) {
			this._prefBranch = new Preferences(this.PREF_DOMAIN);
		}
		return this._prefBranch;
	},

	_bkmSvc: null,
	get bkmSvc() {
		if (!this._bkmSvc) {
			this._bkmSvc = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"]
			               .getService(Components.interfaces.nsINavBookmarksService);
		}
		return this._bkmSvc;
	},

	_histSvc: null,
	get histSvc() {
		if (!this._histSvc) {
			this._histSvc = Components.classes["@mozilla.org/browser/nav-history-service;1"]
			                .getService(Ci.nsINavHistoryService);
		}
		return this._histSvc;
	},

	handleEvent: function (aEvent) {
		switch (aEvent.type) {
			case "load":
				this.onLoad();
				break;
			case "unload":
				this.onUnLoad();
				break;
		}
	},

	observe: function (aSubject, aTopic, aData) {
		if (aTopic == "nsPref:changed") {
			this.prefObserve(aSubject, aData);
		}
	},

	prefObserve: function (aSubject, aData) {
		
	},

	onLoad: function () {
		window.removeEventListener("load", this, false);
		window.addEventListener("unload", this, false);

		//Import JS Utils module
		Components.utils.import("resource://linkplaces/Utils.js");
		Components.utils.import("resource://linkplaces/linkplaces.js");

		//this.prefBranch.observe("", this);
		//this.initPref();

		this.initPlacesView();
	},

	initPlacesView: function() {
		var query = this.histSvc.getNewQuery();
		var unfiledBookmarksFolder = this.bkmSvc.unfiledBookmarksFolder;
		query.setFolders([unfiledBookmarksFolder], 1);
		//query.searchTerms = "";
		query.onlyBookmarked = true;

		var queryOpts = this.histSvc.getNewQueryOptions();
		queryOpts.queryType = queryOpts.QUERY_TYPE_BOOKMARKS;//queryType=1

		var placesQuery = this.histSvc.queriesToQueryString([query], 1, queryOpts);

		var tree = document.getElementById("linkplaces-view");
		tree.place = placesQuery;
	},

	initPref: function () {
		var allPref = this.prefBranch.prefSvc.getChildList("", {});
		allPref.forEach(function(aPref) {
			this.prefObserve(null, aPref);
		}, this);
	},

	onUnLoad: function() {
		window.removeEventListener("unload", this, false);
	},

	// Based on "chrome://browser/content/bookmarks/sidebarUtils.js"
	handleTreeKeyPress: function (aEvent) {
		if (aEvent.keyCode == KeyEvent.DOM_VK_RETURN) {
			PlacesUIUtils.openNodeIn(aTree.selectedNode, "tab");
			LinkplacesService.removeItem(aTree.selectedNode.itemId);
		}
	},

	handleTreeClick: function (aEvent, aGutterSelect) {
		// When right button click
		if (aEvent.button == 2) {
			return;
		}

		var tree = aEvent.target.parentNode;
		var treeBoxObj = tree.treeBoxObject;
		var row = new Object();
		var col = new Object();
		var obj = new Object();
		treeBoxObj.getCellAt(aEvent.clientX, aEvent.clientY, row, col, obj);

		if (row.value == -1 ||  obj.value == "twisty") {
			return;
		}

		// whether mouse in opening item area or not.
		var mouseInGutter = false;
		var cellX = new Object();
		var cellY = new Object();
		var cellW = new Object();
		var cellH = new Object();
		if (aGutterSelect) {
			treeBoxObj.getCoordsForCellItem(row.value, col.value, "image", cellX, cellY, cellW, cellH);

			var isRTL = (window.getComputedStyle(tree, null).direction == "rtl");
			if (isRTL) {
				mouseInGutter = (aEvent.clientX > cellX.value);
			}
			else {
				mouseInGutter = (aEvent.clientX < cellX.value);
			}
		}

		var isContainer = treeBoxObj.view.isContainer(row.value);

		if (!mouseInGutter && !isContainer && aEvent.originalTarget.localName == "treechildren") {
			treeBoxObj.view.selection.select(row.value);
			PlacesUIUtils.openNodeIn(tree.selectedNode, "tab");
			LinkplacesService.removeItem(tree.selectedNode.itemId);
		}
	},

	handleTreeMouseMove: function (aEvent) {
		if (aEvent.target.localName != "treechildren") {
			return;
		}

		var tree = aEvent.target.parentNode;
		var treeBoxObj = tree.treeBoxObject;
		var row = (new Object()), col = (new Object()), obj = (new Object());
		treeBoxObj.getCellAt(aEvent.clientX, aEvent.clientY, row, col, obj);

		if (row.value == -1) {
			this.clearURLFromStatusBar();
		}
		else {
			var cell = tree.view.nodeForTreeIndex(row.value);
			if (PlacesUtils.nodeIsURI(cell)) {
				window.top.XULBrowserWindow.setOverLink(cell.uri, null);
			}
			else {
				this.clearURLFromStatusBar();
			}
		}
	},

	clearURLFromStatusBar: function () {
		window.top.XULBrowserWindow.setOverLink("", null);
	},

};
window.addEventListener("load", LinkplacesPanel, false);
