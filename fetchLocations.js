 const LOCATION_ENDPOINT = "https://ttp.cbp.dhs.gov/schedulerapi/locations/?temporary=false&inviteOnly=false&operational=true&serviceName=Global%20Entry"

 export const fetchLocations = () => {
    fetch(LOCATION_ENDPOINT)
        .then(response => response.json())
        .then(data => {
            // Filter the data to only return the needed data
            const filteredLocations = data.map(loc => ({
                "id": loc.id,
                "name": loc.name,
                "shortName": loc.shortName,
                "tzData": loc.tzData
            }));
            filteredLocations.sort((a, b) => a.name.localeCompare(b.name)); // Sorts data in alphabetical order
            chrome.storage.local.set({ locations: filteredLocations }) // Saves additional data: locations
            console.log(filteredLocations);
        })
        .catch(error => {
            console.log(error);
        })
 }