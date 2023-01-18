import React, { useState } from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";

export default function Form(props) {

  // console.log("props in Form component", props)

  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  // track the error state; when input is invalid, we need to change the error state to "Student name cannot be blank"
  const [error, setError] = useState("");

  const reset = function() {
    setStudent("");
    setInterviewer(null);
  };

  const cancel = function() {
    props.onCancel();
    reset();
  };

  // validate that the input element is not empty and an interviewer must be selected
  function validate() {
    if (student === "") {
      setError("Student name cannot be blank");
      return;
    }

    if (interviewer === null) {
      setError("Please select an interviewer");
      return;
    }

    props.onSave(student, interviewer);
  }

  
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form
          autoComplete="off"
          onSubmit={event => event.preventDefault()}
        >
          <input
            className="appointment__create-input text--semi-bold"
            name={props.name}
            type="text"
            placeholder="Enter Student Name"
            /*
              This must be a controlled component
              your code goes here
            */
            value={student}
            onChange={(event) => setStudent(event.target.value)}
            data-testid="student-name-input"
          />
          <section className="appointment__validation">{error}</section>
        </form>

        <InterviewerList
          /* your code goes here */
          interviewers={props.interviewers} value={interviewer} onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={() => validate()}>Save</Button>
        </section>
      </section>
    </main>
  );

}