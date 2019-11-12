
// Chrome's downloads will be cleared out every 15 seconds.
var interval;
var settings;
var reloadInterval;
var reInit = (1.5 * 60 * 60 * 1000);
// The initialization routine is called only once.

onload = setTimeout(loadEverything, 1000);

chrome.storage.onChanged.addListener(function (changes, namespace) {
	console.log("storage changed");
	loadEverything();
});

function loadEverything() {
	console.log("load everything");

	chrome.storage.sync.get(['enabled', 'how_often', 'disable_shelf'], function (loadedSettings) {
		console.log(JSON.stringify(loadedSettings));
		if (loadedSettings) {
			settings = loadedSettings;
			var firstLoad = false;
			if (typeof settings.disable_shelf === "undefined") {
				settings.disable_shelf = false;
				firstLoad = true;
			}
			if (typeof settings.enabled === "undefined") {
				settings.enabled = false;
				firstLoad = true;
			}
			if (typeof settings.how_often === "undefined") {
				settings.how_often = 30;
				firstLoad = true;
			}
			if (!!firstLoad) {
				saveSettings();
			}
		} else {
			settings = {
				enabled: false,
				how_often: 30,
				disable_shelf: false
			};
		}
		chrome.downloads.setShelfEnabled(!settings.disable_shelf);
		init();
	});
	setupContextMenus();
}

function setupContextMenus() {
	chrome.contextMenus.removeAll();

	chrome.contextMenus.create({
		title: "Change Options",
		"contexts": ["browser_action"],
		onclick: function (info, tab) {
			chrome.tabs.create({ url: 'options.html' });
		}
	});

	chrome.contextMenus.create({
		title: "Donate to keep Extensions Alive",
		"contexts": ["browser_action"],
		onclick: function (info, tab) {
			chrome.tabs.create({ url: 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=67TZLSEGYQFFW' });
		}
	});

	chrome.contextMenus.create({
		title: "Leave a review",
		"contexts": ["browser_action"],
		onclick: function (info, tab) {
			chrome.tabs.create({ url: 'https://chrome.google.com/webstore/detail/always-clear-downloads-in/efoelbbfbknfhpmgclpcdbkoieedkkai' });
		}
	});

	chrome.contextMenus.create({
		title: "Report an issue",
		"contexts": ["browser_action"],
		onclick: function (info, tab) {
			chrome.tabs.create({ url: 'https://github.com/stefanXO/Always-Clear-Downloads/issues' });
		}
	});

	chrome.contextMenus.create({
		title: "Send a suggestion",
		"contexts": ["browser_action"],
		onclick: function (info, tab) {
			chrome.tabs.create({ url: 'https://github.com/stefanXO/Always-Clear-Downloads/issues' });
			chrome.tabs.create({ url: 'mailto:markus+acd@stefanxo.com' });
		}
	});
}

function saveSettings() {
	chrome.storage.sync.set(settings, function (s) {
		console.log("saved");
	});
}

reloadInterval = setInterval(init, reInit);

function init() {
	// Set the interval at which the downloads will be erased.
	clearTimeout(interval);
	interval = setTimeout(clearDownloads, settings["how_often"] * 1000);

	if(settings["how_often"] * 1000 >= reInit) {
		clearInterval(reloadInterval);
		var newReInit = (settings["how_often"] * 1000 * 3) + 1;
		reloadInterval = setInterval(init, newReInit);
	}else {
		clearInterval(reloadInterval);
		reloadInterval = setInterval(init, reInit);
	}
};

function clearDownloads() {
	clearTimeout(interval);
	interval = setTimeout(clearDownloads, settings["how_often"] * 1000);

	chrome.downloads.setShelfEnabled(!settings.disable_shelf);

	if (!settings.enabled) return;

	// Debug message only. Remove for actual runtime.
	// alert ("About to remove Downloads");

	// Perform the clearing of the browsing data. (0 means everything.)

	chrome.browsingData.removeDownloads({ "since": 0 });
	if (!settings.disable_shelf) {
		chrome.downloads.search({ state: "in_progress", limit: 1 }, function (items) {
			if (items.length > 0) {
				// we have running downloads
				// don't clear anything
			} else {
				chrome.downloads.setShelfEnabled(false);
				chrome.downloads.setShelfEnabled(true);
			}
		});
	}
	chrome.downloads.erase({ state: "complete" });

	// Debug message only. Remove for actual runtime.
	// alert ("Downloads cleared!");
};

function openOrFocusOptionsPage() {
	var optionsUrl = chrome.extension.getURL('options.html');
	chrome.tabs.query({}, function (extensionTabs) {
		var found = false;
		for (var i = 0; i < extensionTabs.length; i++) {
			if (optionsUrl == extensionTabs[i].url) {
				found = true;
				console.log("tab id: " + extensionTabs[i].id);
				chrome.tabs.update(extensionTabs[i].id, { "selected": true });
			}
		}
		if (found == false) {
			chrome.tabs.create({ url: "options.html" });
		}
	});
}
chrome.extension.onConnect.addListener(function (port) {
	var tab = port.sender.tab;
	// This will get called by the content script we execute in
	// the tab as a result of the user pressing the browser action.
	port.onMessage.addListener(function (info) {
		var max_length = 1024;
		if (info.selection.length > max_length) info.selection = info.selection.substring(0, max_length);
		openOrFocusOptionsPage();
	});
});

chrome.browserAction.onClicked.addListener(function (tab) {
	openOrFocusOptionsPage();
});

