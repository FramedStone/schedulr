// service-worker.js is a file that runs background scripts which does not
// require any user interaction to execute.

import { getToken } from './auth-flow.js';
import { getCalIds } from './cal-list-query.js';

// Navigate user to 'schedulr' website's usage part when 
// the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
        url: "https://www.mmuschedulr.com/#usage",
    });
});

// Listener to know when to query for user's calendar list
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "queryCalList") {
        console.log("Received message in service-worker.js");

        getToken()
            .then((token) => {
                return getCalIds(token);
            })
            .then((calJson) => {
                console.log("Calendars queried:", calJson);
                chrome.runtime.sendMessage({
                    action: "calData",
                    data: calJson
                });
            })
            .catch((error) => {
                console.log("Error querying calendars:", error);
                window.alert("Error querying calendars:", error);
            });

        return true;
    }
});
