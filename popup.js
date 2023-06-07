// Elements
const locationIdElement = document.getElementById("locationId")
const startDateElement = document.getElementById("startDate")
const endDateElement = document.getElementById("endDate")

// Button Elements
const startButton = document.getElementById("startButton")
const stopButton = document.getElementById("stopButton")

// Span listeners
const runningSpan = document.getElementById("runningSpan")
const stoppedSpan = document.getElementById("stoppedSpan")

// Error message variables
const locationIdError = document.getElementById("locationIdError")
const startDateError = document.getElementById("startDateError")
const endDateError = document.getElementById("endDateError")

// Hides 'Running' tag
const hideElement = (elem) => {
    elem.style.display = ''
}

// Hides 'Start/Stop' buttons when already started
const showElement = (elem) => {
    elem.style.display = 'none'
}

// Disables buttons
const disableElement = (elem) => {
    elem.disabled = true
}

const enableElement = (elem) => {
    elem.disabled = false
}

const handleOnStartState = () => {
    // Spans
    showElement(stoppedSpan)
    hideElement(runningSpan)
    // Buttons
    disableElement(startButton)
    enableElement(stopButton)
    // Inputs (disables inputs while program is running)
    disableElement(locationIdElement)
    disableElement(startDateElement)
    disableElement(endDateElement)
}

const handleOnStopState = () => {
    // Spans
    showElement(runningSpan)
    hideElement(stoppedSpan)
    // Buttons
    disableElement(stopButton)
    enableElement(startButton)
    // Inputs (enable inputs while program is running)
    enableElement(locationIdElement)
    enableElement(startDateElement)
    enableElement(endDateElement)
}

// Validates the inputs before running functions
const performOnStartValidations = () => {
    if (locationIdElement.value) { // if input is valid
        showElement(locationIdError);
    } else {
        hideElement(locationIdError)
    }

    if (startDateElement.value) {
        showElement(startDateError)
    } else {
        hideElement(startDateError)
    }

    if (endDateElement.value) {
        showElement(endDateError)
    } else {
        hideElement(endDateError)
    }

    return locationIdElement.value && startDateElement.value && endDateElement.value
}

// When user hits the start button, send a message to background.js * after validating!!!
startButton.onclick = function() {
    const allFieldsValid = performOnStartValidations(); // validate all user inputs

    if (allFieldsValid) {
        handleOnStartState(); // Switches 'Stop' to 'Start'  when 'Start' button is clicked
        const prefs = {
            locationId: locationIdElement.value,
            startDate: startDateElement.value,
            endDate: endDateElement.value,
            tzData: locationIdElement.options[locationIdElement.selectedIndex].getAttribute('data-tz')
        }
        chrome.runtime.sendMessage({ event: 'onStart', prefs }) // When start button is click, send message to background.js
    }
}

// When user hits the stop button, send a message to background.js
stopButton.onclick = function() {
    handleOnStopState(); // Switches 'Start' to 'Stop'  when 'Stop' button is clicked
    chrome.runtime.sendMessage({ event: 'onStop'}) // When start button is click, send message to background.js
}

// Returns a stored object with all the values requested
chrome.storage.local.get(["locationId", "startDate", "endDate", "locations", "isRunning"], (result) => {
    const { locationId, startDate, endDate, locations, isRunning } = result;

    setLocations(locations);

    if (locationId) {
        locationIdElement.value = locationId
    }

    if (startDate) {
        startDateElement.value = startDate
    }

    if (endDate) {
        endDateElement.value = endDate
    }

    if (isRunning) {
        handleOnStartState();
    } else {
        handleOnStopState();
    }
    //console.log("Running status:", isRunning)
    //console.log(locations); // Tests if 'locations' is being stored 
});

/*
    {
        "id" : 5005,
        "name" : "El Paso Enrollment Center",
        "shortName" : "El Paso Enrollment Center",
        "tzData" : "America/Denver"
    }
*/
const setLocations = (locations) => {  // Populates the popup location dropdown menu with the locations saved locally
    locations.forEach(location => {
        let optionElement = document.createElement("option"); // creates option element
        optionElement.value = location.id 
        optionElement.innerHTML = location.name
        optionElement.setAttribute('data-tz', location.tzData)
        locationIdElement.appendChild(optionElement);
    })
}
    