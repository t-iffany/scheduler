import { useState } from 'react';

export default function useVisualMode(initial) {
  
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // when transition is called, we need to add the new mode to our history
  function transition(newMode, replace = false) {
    if (!replace) {
      setMode(newMode);
      history.push(newMode);
    }
    setMode(newMode);
  }

  // when back is called, we should set the mode to the previous item in our history array
  // history.length must be greater than 1 because it should not allow user to go back past the initial mode
  function back() {
    if (history.length > 1) {
      // remove the lement at the top of the stack
      history.pop();
      setMode(history[history.length - 1]);
    }
  }

  return { mode, transition, back };

}