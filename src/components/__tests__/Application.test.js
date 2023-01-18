import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // render the application
    const { container } = render (<Application />);
    // wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // search for all of the appointments in the container
    const appointments = getAllByTestId(container, "appointment");
    // confirm empty appointment at index 0
    const appointment = getAllByTestId(container, "appointment")[0];
    // click the "Add" button on the first empty appointment
    fireEvent.click(getByAltText(appointment, "Add"));
    // enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter student name"
    // click the first interviewer on the list
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    // click the "Save" button on that same appointment
    fireEvent.click(getByText(appointment, "Save"));
    // check that the element with the text "Saving" is displayed

    // wait until the element with the text "Lydia Miller-Jones" is displayed

    // check that the dayListItem with the text "Monday" also has the text "no spots remaining"

    console.log(prettyDOM(appointment));    
  });




})
