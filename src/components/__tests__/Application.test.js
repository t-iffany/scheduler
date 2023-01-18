import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText } from "@testing-library/react";

import Application from "components/Application";
import axios from "axios";

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
    const { container, debug } = render (<Application />);
    // wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // search for all of the appointments in the container
    const appointments = getAllByTestId(container, "appointment");
    // confirm empty appointment at index 0
    const appointment = appointments[0];
    // click the "Add" button on the first empty appointment
    fireEvent.click(getByAltText(appointment, "Add"));
    // enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter student name"
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    // click the first interviewer on the list
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // click the "Save" button on that same appointment
    fireEvent.click(getByText(appointment, "Save"));
    // check that the element with the text "Saving" is displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // wait until the element with the text "Lydia Miller-Jones" is displayed
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // check that the dayListItem with the text "Monday" also has the text "no spots remaining"
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  // Deleting an Interview
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));
    // 4. Check that the confirmation message is displayed.
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();    
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

  });

  // Editing an Interview
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));
    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter student name"
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Click the first interviewer on the list
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click the "Save button on that same appointment".
    fireEvent.click(getByText(appointment, "Save"));

    // 7. check that the element with the text "Saving" is displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 8. wait until the element with the text "Lydia Miller-Jones" is displayed
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // 9. check that the dayListItem with the text "Monday" also has the text "1 spot remaining"
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  // Mocking a Mock
  it("shows the save error when failing to save an appointment", () => {
    axios.put.mockRejectedValueOnce();
  });

  // Error Handling for the Save function
  it("shows the save error when failing to save an appointment", async() => {
    // fake an error with axios
    axios.put.mockRejectedValueOnce()

    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));
    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter student name"
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Click the first interviewer on the list
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Wait until the element with the text "Could not save appointment." is displayed
    await waitForElement(() => getByText(appointment, "Could not save appointment."));

    // 8. Check that the element with the text "Could not save appointment." is displayed
    expect(getByText(appointment, "Could not save appointment.")).toBeInTheDocument();

    // 9. Click the "Close" button on the Error message
    fireEvent.click(queryByAltText(appointment, "Close"));

    // 10. Check that the element with the "Save" button is displayed
    expect(getByText(appointment, "Save")).toBeInTheDocument();

    // 11. Click the "Cancel" button on the appointment
    fireEvent.click(queryByText(appointment, "Cancel"));

    // 12. Check that the appointment with "Archie Cohen" is displayed
    expect(getByText(container, "Archie Cohen")).toBeInTheDocument();

    // 13. Check that the dayListItem with the text "Monday" also has the text "1 spot remaining"
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });

  // Error handling for the Delete function
  it("shows the delete error when failing to delete an existing appointment", async() => {
    // fake an error with axios
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
 
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is displayed.
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();   

    // 7. Wait until the element with the text "Could not delete appointment." is displayed
    await waitForElement(() => getByText(appointment, "Could not delete appointment."));

    // 8. Check that the element with the text "Could not delete appointment." is displayed
    expect(getByText(appointment, "Error")).toBeInTheDocument();

    // 13. Check that the dayListItem with the text "Monday" also has the text "1 spot remaining"
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  debug();    
  });

})
