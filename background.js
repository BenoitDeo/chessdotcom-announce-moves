let enabled = false;

chrome.action.onClicked.addListener((tab) => {
    enabled = !enabled;

    chrome.storage.local.set({ enabled: enabled }, () => {
        const iconPath = enabled ? {
            "16": "icon16.png",
            "48": "icon48.png",
            "64": "icon64.png",
            "128": "icon128.png"
        } : {
            "16": "icon16_disabled.png",
            "48": "icon48_disabled.png",
            "64": "icon64_disabled.png",
            "128": "icon128_disabled.png"
        };

        chrome.action.setIcon({ path: iconPath });
        chrome.action.setTitle({ title: enabled ? 'Disable announcements on Chess.com' : 'Enable move announcements on Chess.com' });
        chrome.tabs.reload(tab.id);  // Reload the tab to apply changes
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ enabled: false });
});