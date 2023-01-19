import { useState } from 'react';

export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // when transition is called, we need to add the new mode to our history
  function transition(newMode, replace = false) {
    if (!replace) {
      setHistory(prev => [...prev, newMode]);
    }
    setMode(newMode);
  }

  // when back is called, we should set the mode to the previous item in our history array
  function back() {
    if (history.length > 1) {
      history.pop();
      setMode(history[history.length - 1]);
    }
  }

  return { mode, transition, back };

}