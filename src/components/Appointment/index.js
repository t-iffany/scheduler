import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";


export default function Appointment(props) {

  //console.log("props in Appointment component", props)

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE ="CREATE";
  const SAVING ="SAVING";
  const DELETING ="DELETING";
  const CONFIRM ="CONFIRM";
  const EDIT ="EDIT";
  const ERROR_SAVE="ERROR_SAVE";
  const ERROR_DELETE="ERROR_DELETE";

  const {mode, transition, back} = useVisualMode(
    props.interview ? SHOW : EMPTY
  );


  // function to save interview
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    
    // show the SAVING indicator before calling props.bookInterview
    transition(SAVING);
    // call props.bookInterview to save interview and transition display to SHOW component
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      // set 'true' to replace the mode in history rather than pushing it on to the end when transitioning from SAVING to ERROR_SAVE
      .catch(error => transition(ERROR_SAVE, true));
  }

  // function to delete interview
  function destroy(event) {

    // show the DELETING indicator before calling props.cancelInterview
    transition(DELETING, true);  // set true to replace mode in history
    // call props.cancelInterview to cancel interview and transition display to EMPTY component
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  // function to edit interview
  function edit() {
    transition(EDIT);
  }

  return (
    <article className="appointment"
      data-testid="appointment"
    >
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={edit}
      />
      )}
      {mode === CREATE && (
        <Form
          name={props.name}
          value={props.value}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === SAVING && (
        <Status message ="Saving" />
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          onConfirm={destroy}
          onCancel={back}
        />
      )}
      {mode === DELETING && (
        <Status message ="Deleting" />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Could not save appointment."
          onClose={back}
        />
      )}
        {mode === ERROR_DELETE && (
        <Error
          message="Could not delete appointment."
          onClose={back}
        />
      )}
    </article>
  );
}


