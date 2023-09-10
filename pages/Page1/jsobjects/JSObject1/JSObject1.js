export default {
  generateTimeSlots: (rawData, date, duration) => {
    const startDateTime = moment.tz(`${date} 10:00`, 'YYYY-MM-DD HH:mm', 'Europe/Warsaw');
    const endDateTime = moment.tz(`${date} 22:00`, 'YYYY-MM-DD HH:mm', 'Europe/Warsaw');
    const callDuration = duration; // minutes
    const timeSlots = [];
  
    let currentTime = startDateTime.clone();
  
    // Ensure that rawData has an "items" property and it is an array
    if (rawData && Array.isArray(rawData.items)) {
      while (currentTime.isBefore(endDateTime)) {
        const slotEndTime = currentTime.clone().add(callDuration, 'minutes');
  
        // Check if the slot end time is within the day and not conflicting with events
        if (
          slotEndTime.isBefore(endDateTime) &&
          !this.isSlotConflicting(currentTime, slotEndTime, rawData.items)
        ) {
          timeSlots.push({
            start: currentTime.format('HH:mm'), // Include the date
            end: slotEndTime.format('HH:mm') // Include the date
          });
        }
  
        currentTime = slotEndTime.clone();
      }
    }
  
    return timeSlots;
  },
  // Function to check if a time slot conflicts with events
  isSlotConflicting: (startTime, endTime, events) => {
    for (const event of events) {
      const eventStart = moment.tz(event.start.dateTime, 'Europe/Warsaw'); // Set the event's time zone
      const eventEnd = moment.tz(event.end.dateTime, 'Europe/Warsaw'); // Set the event's time zone
  
      // Check if there is a date and time overlap between the time slot and the event
      if (
        startTime.isBefore(eventEnd) &&
        endTime.isAfter(eventStart)
      ) {
        return true; // Conflict found
      }
    }
  
    return false; // No conflict
  }
}