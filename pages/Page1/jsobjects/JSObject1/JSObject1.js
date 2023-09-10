export default {
  generateTimeSlots: (rawData) => {
    const startTime = moment.tz('10:00', 'HH:mm', 'Europe/Warsaw'); // Set the time zone
    const endTime = moment.tz('22:00', 'HH:mm', 'Europe/Warsaw'); // Set the time zone
    const callDuration = 30; // minutes
    const timeSlots = [];
  
    let currentTime = startTime.clone();
  
    // Ensure that rawData has an "items" property and it is an array
    if (rawData && Array.isArray(rawData.items)) {
      while (currentTime.isBefore(endTime)) {
        const slotEndTime = currentTime.clone().add(callDuration, 'minutes');
  
        // Check if the slot end time is within the day and not conflicting with events
        if (
          slotEndTime.isBefore(endTime) &&
          !this.isSlotConflicting(currentTime, slotEndTime, rawData.items)
        ) {
          timeSlots.push({
            start: currentTime.format('HH:mm'),
            end: slotEndTime.format('HH:mm')
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
  		
			console.log(`eventStart: ${eventStart.format('HH:mm')} - eventEnd: ${eventEnd.format('HH:mm')}`);
      console.log(`startTime: ${startTime.format('HH:mm')} - endTime: ${endTime.format('HH:mm')}`);
			
      if (
        startTime.isSameOrBefore(eventEnd) &&
        endTime.isSameOrAfter(eventStart)
      ) {
        return true; // Conflict found
      }
    }
  
    return false; // No conflict
  }
}