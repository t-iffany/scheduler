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
        // call setState with the new state object
        setState({ ...state, appointments });
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
        setState({ ...state, appointments });
      });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };

}