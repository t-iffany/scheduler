
export function getAppointmentsForDay(state, day) {

  // if days data is empty return empty array
  if (state.days.length === 0) {
    return [];
  }

  // Filter state.days array to find the object who's name matches the provided day
  const filteredDays = state.days.filter(selectedDay => {
    return day === selectedDay.name;
  });

  // if day not found, return empty array
  if (filteredDays.length === 0) {
    return [];
  }

  // get array of appointment ids from filteredDays object
  const apptsFromObj = filteredDays[0].appointments;

  // if no appointments on the given day, return empty array 
  if (apptsFromObj.length === 0) {
    return [];
  }

  // create variable for resulting appointment data
  let selectedDayAppts = [];

  // iterate through the appointment array for the given day
  for (const id of apptsFromObj) {
    // find appointments that match the id from apptsFromObj and push into result
    const appointment = state.appointments[id];
    selectedDayAppts.push(appointment);
  }
  // return an array of appointments for the selected day  
  return selectedDayAppts;

}


// function that returns new object containing interview data when we pass it an object that contains the interviewer
export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewerData = state.interviewers[interview.interviewer];

  return {
    student: interview.student,
    interviewer: interviewerData
  };
}