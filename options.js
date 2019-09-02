var settings;
var messageTimeout;

// if (settings == undefined) {
//     settings = {
//         enabled: false,
//         how_often: 15,
//         disable_shelf: false
//     };
// }

window.onload = function () {
  try {
    chrome.storage.sync.get(['enabled', 'how_often', 'disable_shelf'], function (loadedSettings) {
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
          if (!!localStorage["settings"]) {
            try {
              oldSettings = JSON.parse(localStorage["settings"]);
              if (typeof oldSettings == 'object') {
                settings = oldSettings;
                if (typeof settings.enabled === "undefined") settings.enabled = false;
                if (typeof settings.disable_shelf === "undefined") settings.disable_shelf = false;
                if (typeof settings.how_often === "undefined") settings.how_often = 30;
              }
            } catch (err) {
              console.log(err);
            }
          }
          saveSettings();
        }
      } else {
        settings = {
          enabled: false,
          how_often: 30,
          disable_shelf: false
        };
      }
      setup();
    });
    // if(!!localStorage["settings"]) {
    //   settings = JSON.parse(localStorage["settings"]);
    //   console.log(settings);
    //   if(typeof settings.disable_shelf === "undefined") settings.disable_shelf = false;
    // }else{
    //   settings = {
    //       enabled: false,
    //       how_often: 15,
    //       disable_shelf: false
    //   };
    // }
  } catch (err) {
    console.log(err);
  }
};

setup = function () {
  var enabled = document.getElementById("enabled");
  var howOften = document.getElementById("how_often");
  var disableShelf = document.getElementById("disable_shelf");
  if (settings.enabled) {
    enabled.checked = true;
  }
  if (settings.how_often) {
    howOften.value = settings.how_often;
  }
  if (settings.disable_shelf) {
    disableShelf.checked = true;
  }
  disableShelf.addEventListener("change", function (e) {
    disableShelfRequest();
  });
  enabled.addEventListener("change", function (e) {
    settings.enabled = !!e.target.checked;
    saveSettings();
    notify();
  });
  howOften.addEventListener("change", function (e) {
    settings.how_often = e.target.value;
    saveSettings();
    notify();
  });
};

function disableShelfRequest() {
  // chrome.permissions.request({
  //   permissions: ['downloads', 'downloads.shelf']
  // }, function(granted) {
  //   // The callback argument will be true if the user granted the permissions.
  //   if (granted) {
  var disableShelf = document.getElementById("disable_shelf");
  settings.disable_shelf = !!disableShelf.checked;
  chrome.downloads.setShelfEnabled(!settings.disable_shelf);
  saveSettings();
  notify();
  // console.log("yes, have it", granted);
  //   } else {
  //       var disableShelf = document.getElementById("disable_shelf");
  //       settings.disable_shelf = false;
  //       disableShelf.checked = false;
  //       saveSettings();
  //       notify("We don't have the permission to change the download shelf, sorry!");
  //     console.log("no, don't have it", granted);
  //   }
  // });
}

function saveSettings() {
  chrome.storage.sync.set(settings, function (s) {
    console.log("saved");
  });
}

function notify(msg) {
  if (!msg) {
    msg = "Changes saved";
  }
  var message = document.getElementById("message");
  message.innerHTML = msg;
  message.style.opacity = 1;
  if (!!messageTimeout) clearTimeout(messageTimeout);
  messageTimeout = setTimeout(hideNotify, 3000);
}

function hideNotify() {
  var message = document.getElementById("message");
  message.style.opacity = 0.01;
}

