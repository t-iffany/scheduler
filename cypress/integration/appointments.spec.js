
describe("Appointments", () => {

  it("should book an interview", () => {

    // GET to "/api/debug/reset" to reset database
    cy.request("GET", "/api/debug/reset")
    
    // visit root fo the web server and ensure that the data loads
    cy.visit("/");

    cy.contains("Monday");
    
    cy.get("[alt=Add]")
      .first()  // need to use first because there are two Add buttons
      .click();

    cy.get("[data-testid=student-name-input]")
      .type("Lydia Miller-Jones");

    cy.get("[alt='Sylvia Palmer']")
      .click();

    cy.contains("Save")
      .click();

    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
      
  });

});