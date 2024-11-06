describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/");

    cy.get("[role=tab]").should("have.length", 3);
    cy.get("[role=tab]").first().should("have.text", "Schema A");
    cy.get("[role=tab]").eq(1).should("have.text", "Schema B");
    cy.get("[role=tab]").last().should("have.text", "Schema C");
  });
});
