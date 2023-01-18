// import React.createElement so we can render <Application />
import React from "react";

// import helper functions from the react-testing-library
import { render } from "@testing-library/react";

// import the component we are testing
import Application from "components/Application";
import Appointment from "components/Appointment";

// a test that renders a React component
it("renders without crashing", () => {
  render(<Application />);
});

describe("Appointment", () => {

  it("renders without crashing", () => {
    render(<Appointment />);
  });

})

