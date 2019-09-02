# Always Clear Downloads in Chrome 1.9
A Google Chrome Extension to always clear the downloads list of all completed downloads.

An updated version of the popular extension - now compatible with new Chrome versions!

This Google Chrome extension makes up for the fact that Chrome does not have an option to keep its download list clear at all times. You can clear the downloads list yourself by hand, but Chrome currently doesn't have an option to automatically clear it for you. This extension does it for you automatically.

This extension works in a very simple way: Every few seconds, the downloads list is cleared out for you. Don't worry, the files you downloaded are still there, and in-progress downloads are not harmed. Chrome's internal list simply gets cleaned up for you every five seconds. 


==== Please note! ====

There is an unfixed bug in the Google Chrome API which causes this extension to always reset the downloads folder to the default folder. This is a bug in the Chrome API, not a bug in the "Always Clear Downloads in Chrome" extension.

For instance, if you configure Chrome's default download folder to "c:\downloads" in Chrome's Advanced Settings, then this extension will keep resetting the folder to be that. If you download a file to a different target location using "Save link as...", and pick a different location such as "c:\other\folder" then instead of that new location being the new default, this extension will cause downloads to go back to "c:\downloads" on the next download.

This might not be expected, but it's how the Chrome API works. You might get around this by simply disabling the download shelf instead - instead of clearing the downloads every few seconds. Or increase the clearing interval to an hour, in case you have to download a lot of files to a specific folder.


Changes : 

Version 1.9
-- Fixes issue where the download shelf is not disabled after a Chrome restart, unless you re-checked the option manually

Version 1.8
-- Fixes initial load with default settings

Version 1.7
-- The shelf will clear after active downloads have finished

Version 1.6
-- Switched to Chrome's own storage engine

Version 1.5
-- Fixes for disabling the shelf

Version 1.4
-- Switched to use newer Chrome APIs
-- Small fixes

Version 1.3
-- Added options page
-- You can now set how often the downloads will be cleared
-- You can enable/disable the extension in the options
-- You can now disable the download shelf



Please enjoy.

You can find and install this extension at the [Chrome Web Store](https://chrome.google.com/webstore/detail/efoelbbfbknfhpmgclpcdbkoieedkkai).

If you love it, please [donate to support this extension](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=67TZLSEGYQFFW). Thank you <3
