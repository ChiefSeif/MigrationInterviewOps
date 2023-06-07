// Fetch the list of open interviews at a location in a give date period
export const fetchOpenSlots = (result) =>{
    console.log(result);
    // https://ttp.cbp.dhs.gov/schedulerapi/locations/9240/slots?startTimestamp=2023-02-11T00%3A00%3A00&endTimestamp=2023-03-22T00%3A00%3A00
    const { locationId, startDate, endDate } = result;
    // Set up dynamic end points
    const appointmentUrl = 'https://ttp.cbp.dhs.gov/schedulerapi/locations/${locationId}/slots?startTimestamp=${startDate}T00%3A00%3A00&endTimestamp=${endDate}T00%3A00%3A00' // String interpralation
    fetch(appointmentUrl)
    .then(response => response.json()) // Recieve a response and transform to json so it can be manipulated
    // Find all active appointments
    // When response is transformed, recieve in chained '.then' 
    // '.filter' function returns every element in the list
    .then(data => data.filter(slot => slot.active > 0)) // Tell function whether or not to keep in list. we only want ones greater than 0
    .then(data => console.log(data))
    .catch(error=> console.log(error))
}