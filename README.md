# Chrome detab

<img height="32" src="./img/icon-32.png" alt="extension icon" title="extension icon">

Chrome extension to turn the current tab into a minimal pop-up window (and back).

Moves the tab itself so the page is not reloaded and stays the way it is (as oposed to the usual ways like `window.open(location.href,"detab","toolbar=0");`).

Thus, it doesn't need permission to read URLs or page contents, also no scripts are injected into the page.

> [!IMPORTANT]
>
> This extension is (currently) NOT hosted in _Chrome Web Store_ and since loading extension from other sources does not work (since chrome M33 ~ 2014) for security reasons,
> the only way you could/should install this extension is by
>
> 1. getting the root folder of this repo (or `7z` from releases)
> 2. unpack `zip`/`7z`
> 3. turn on dev-mode in <chrome://extensions> (top right)
> 4. click _Load unpacked extension_ (top left)
> 5. find folder location
> 6. click it and then _Select folder_
> 7. ...
> 8. profit
>
> don't trust other sources not mentioned here (<https://github.com/MAZ01001/chrome_detab>)

---

Toggle popup of current window from context menu (on page) or via hotkey <kbd><kbd>alt</kbd>+<kbd>0</kbd></kbd> (can be changed in <chrome://extensions/shortcuts>).

If right-clicking on a link, there are also options to open that link as a popup (with or without incognito mode)

If you click the extension icon (next to the URL bar), it will open all selected tabs as popups (_select multiple tabs with <kbd>ctrl</kbd>/<kbd>shift</kbd>_).

---

Specifically, when a popup is reverted to a normal tab, it looks for the last focused window and inserts it left of the active tab, but if the last window has a different incognito mode, it will show an error instead.
