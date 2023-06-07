import { fetchLocations } from "./api/fetchLocations.js"
import { fetchOpenSlots } from "./api/fetchOpenSlots.js"

const ALARM_JOB_NAME = "DROP_ALARM" // Name must be unique per alarm created

let cachedPrefs = {};

chrome.runtime.onInstalled.addListener(details => {
    fetchLocations()
    // console.log("onInstalled reason:", details.reason)
})

chrome.runtime.onMessage.addListener(data => {
    const{ event, prefs } = data // Destructuring
    switch (event) {  
        case 'onStop':
            handleOnStop(); // Calls 'handleOnStop'
            //console.log("On Stop In Background")
            break;
        case 'onStart':
            handleOnStart(prefs); // Calls 'handleOnStart'
            //console.log("On start in background")
            console.log("Prefs recieved", prefs)
            break;
        default:
            break;
    }
})

// Triggered when start button is clicked from popup.js & calls 'onStart' function
const handleOnStop = () => {
    console.log("On stop in background")
    setRunningStatus(false);
    stopAlarm();
    cachedPrefs = {} // Clear the cachedPrefs when users clicks 'Stop'
}

// Creates alarm
const handleOnStart = (prefs) => { // Triggered when start button is clicked from popup.js & calls 'onStart' function
    console.log("prefs recieved:", prefs)
    cachedPrefs = prefs
    chrome.storage.local.set(prefs) // Stores data to be pulled later
    setRunningStatus(true);
    createAlarm(); // Calls 'createAlarm' function
}

const setRunningStatus = (isRunning) => {
    chrome.storage.local.set({ isRunning })
}

// Determines if alarm already exists & either does/doesn't run a new alarm accordingly
const createAlarm = () => {
    chrome.alarms.get(ALARM_JOB_NAME, existingAlarm => {
        if (!existingAlarm) { // if alarm doesn't exist, then create alarm
            chrome.alarms.create(ALARM_JOB_NAME, { periodInMinutes: 1.0 })
        }
    }) 

}

const stopAlarm = () => {
    chrome.alarms.clearAll()
}

// Runs the alarm at specified interval of 1min
chrome.alarms.onAlarm.addListener(() => {
    console.log("onAlarm scheduled code running...")
    fetchOpenSlots(cachedPrefs)
})

