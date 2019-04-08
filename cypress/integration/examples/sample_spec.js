describe("Test Authentication Forms", () => {
  it("Visit the Kitchen sink", () => {
    cy.visit("http://nodexp-app.herokuapp.com");
  });

  it("Find an element", () => {
    cy.contains("Register");
  });

  it("Click and URL", () => {
    cy.contains("Register").click();
    cy.url().should("include", "/users/register");
  });

  it("Get, types and asserts", () => {
    cy.get(":nth-child(1) > .form-control")
      .type("jane doe")
      .should("have.value", "jane doe");

    cy.get(":nth-child(2) > .form-control")
      .type("jane.doe@mail.com", { force: true })
      .should("have.value", "jane.doe@mail.com");

    cy.get(":nth-child(3) > .form-control")
      .type("jdoe")
      .should("have.value", "jdoe");

    cy.get(":nth-child(4) > .form-control")
      .type("password123")
      .should("have.value", "password123");

    cy.get(":nth-child(5) > .form-control")
      .type("password123")
      .should("have.value", "password123");
  });

  it("Click and URL", () => {
    cy.contains("Login").click();
    cy.url().should("include", "/users/login");
  });

  it("Get, types and asserts", () => {
    cy.get(":nth-child(1) > .form-control")
      .type("jdoe")
      .should("have.value", "jdoe");

    cy.get(":nth-child(2) > .form-control")
      .type("password123", { force: true })
      .should("have.value", "password123");
  });
});

describe("Test Home Page", () => {
  it("Click and URL", () => {
    cy.contains("Home").click();
    cy.url().should("include", "");
  });

  it("Get Article Card", () => {
    cy.get('.img-fluid')

    cy.get(':nth-child(1) > .card > .card-img-top')

    cy.get(":nth-child(1) > .card > .card-body > .card-text > .text-muted")

    cy.get(":nth-child(1) > .card > .card-body > .card-title > .text-dark")

    cy.get(":nth-child(1) > .card > .card-body > .card-title > .text-dark").click()

    cy.url().should("include", "articles/");

    cy.get('.blog-post-title')

    cy.get('.blog-post-meta')

    cy.get('.img-fluid')

    cy.get('.blog-paragraph')


  //   cy.get(":nth-child(4) > .form-control")
  //     .type("password123")
  //     .should("have.value", "password123");

  //   cy.get(":nth-child(5) > .form-control")
  //     .type("password123")
  //     .should("have.value", "password123");
  // });

  // it("Click and URL", () => {
  //   cy.contains("Login").click();
  //   cy.url().should("include", "/users/login");
  // });

  // it("Get, types and asserts", () => {
  //   cy.get(":nth-child(1) > .form-control")
  //     .type("jdoe")
  //     .should("have.value", "jdoe");

  //   cy.get(":nth-child(2) > .form-control")
  //     .type("password123", { force: true })
  //     .should("have.value", "password123");
  });
});

