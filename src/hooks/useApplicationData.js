import { useState } from 'react';
import { useEffect } from 'react';
import axios from "axios";

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  // renders data for dayList (nav bar)
  useEffect(() => {

    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });

  }, []);


  // bookInterview function
  function bookInterview(id, interview) {
    console.log("id, interview", id, interview);

    // create a new appointment object starting with values copied from the existing appointment
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    // create new appointments object that will replace the existing record with the matching id
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // make PUT request using axios to update database with the interview data
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(response => {
        const days = updateSpots(state, appointments);
        // call setState with the new state object
        setState(prev => ({ ...prev, appointments, days }));
      });
  }


  // cancelInterview function by setting interview to null
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // make DELETE request using axios to update database
    return axios
      .delete(`/api/appointments/${id}`)
      .then(response => {
        const days = updateSpots(state, appointments);
        setState(prev => ({ ...prev, appointments, days }));
      });
  }

  
  // updateSpots function
  function updateSpots(state, appointments) {
    // find the day matching state.day, save its object into dayObj
    // in the days array, find the element whos name === state.day ; days.name === state.day
    const dayObj = state.days.find(element => element.name === state.day);
    console.log("dayObj: ", dayObj);

    // counter to count num of spots
    let spots = 0;
    // iterate through ids of appointments array in dayObj
    for (const id of dayObj.appointments) {
      // appointment is at appointments index of [id]
      const appointment = appointments[id];
      // if not appointment (appointments of [id]).interview = null, spots++
      if (!appointment.interview) {
        spots++;
      }
    }
    // new day object that copies contents of dayObj and inserts 'spots'
    const day = { ...dayObj, spots };
    // return an updated state.days array ; if day name matches, return day, otherwise return element
    return state.days.map(element => element.name === state.day ? day : element);
  }


  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };

}