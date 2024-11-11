describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/");

    cy.get("[role=tab]").should("have.length", 3);
    cy.get("[role=tab]").first().should("have.text", "Schema A");
    cy.get("[role=tab]").eq(1).should("have.text", "Schema B");
    cy.get("[role=tab]").last().should("have.text", "Schema C");

    // Test data Schema A
    cy.get('input.flex').eq(0).type('moonwalker')
    cy.get('input[type="number"]').type('38')
    cy.get('input.flex').eq(2).type('my@email.com')
    cy.get('textarea.flex').type('Hi, this is moonwalker and I am writing this test')
    cy.get('input[type="checkbox"]').eq(0).click()
    cy.get('div.border-border input').eq(0).type('Fake Street')
    cy.get('div.border-border input').eq(1).type('Gotham')
    cy.get('div.border-border input').eq(2).type('90210')
    cy.get('div').find('select').eq(0).select('male',{ force: true })
    cy.contains('button', 'Submit').click()
  });

  //SCHEMA B
  it("Positive test Schema B", () => {
    cy.visit("http://localhost:3000/");

    cy.get("[role=tab]").should("have.length", 3);
    cy.get("[role=tab]").first().should("have.text", "Schema A");
    cy.get("[role=tab]").eq(1).should("have.text", "Schema B");
    cy.get("[role=tab]").last().should("have.text", "Schema C");

    // Test data Schema B
    cy.contains('button', 'Schema B').click()
    cy.get('input.flex').eq(0).type('AccountName')
    cy.get('input[type="number"]').type('4096')
    cy.get('input[type="checkbox"]').eq(0).click()
    cy.get('input.flex').eq(2).type('my@email.com')
    cy.get('div').find('select').eq(0).select('premium',{ force: true })
    cy.contains('button', 'Submit').click()

  });

  // SCHEMA C
  it("Positive test Schema C", () => {
    cy.visit("http://localhost:3000/");

    cy.get("[role=tab]").should("have.length", 3);
    cy.get("[role=tab]").first().should("have.text", "Schema A");
    cy.get("[role=tab]").eq(1).should("have.text", "Schema B");
    cy.get("[role=tab]").last().should("have.text", "Schema C");

    // Test data Schema C
    cy.contains('button', 'Schema C').click()
    cy.get('input.flex').eq(0).type('MyApp')
    cy.get('input.flex').eq(1).type('1.0')
    cy.get('input[type="checkbox"]').eq(0).click()
    cy.get('input[type="number"]').type('500')
    cy.get('input.flex').eq(3).type('support@myapp.com')
    cy.get('div.border-border input').eq(0).click()
    cy.get('div.border-border input').eq(3).type('ConfigA')
    cy.get('div').find('select').eq(0).select('staging',{ force: true })
    cy.contains('button', 'Submit').click()
  });
 
// NEGATIVE TESTING
const required: string = 'This field is required'
  // SCHEMA A
  it("Negative test Schema A", () => {
    cy.visit("http://localhost:3000/");

    cy.get("[role=tab]").should("have.length", 3);
    cy.get("[role=tab]").first().should("have.text", "Schema A");
    cy.get("[role=tab]").eq(1).should("have.text", "Schema B");
    cy.get("[role=tab]").last().should("have.text", "Schema C");

    cy.contains('button', 'Submit').click()

    cy.get('p[class*="text-red-"]').eq(0).should('have.text', required)
    cy.get('p[class*="text-red-"]').eq(1).should('have.text', required)
    cy.get('p[class*="text-red-"]').eq(2).should('have.text', required)

    cy.get('div.border-l p').eq(0).should('have.text', required)
    cy.get('div.border-l p').eq(1).should('have.text', required)
    cy.get('div.border-l p').eq(2).should('have.text', required)

    cy.get('p[class*="text-red-"]').eq(6).should('have.text', required)
  });

  //SCHEMA B
  it("Negative test Schema B", () => {
    cy.visit("http://localhost:3000/");

    cy.get("[role=tab]").should("have.length", 3);
    cy.get("[role=tab]").first().should("have.text", "Schema A");
    cy.get("[role=tab]").eq(1).should("have.text", "Schema B");
    cy.get("[role=tab]").last().should("have.text", "Schema C");

    cy.get("[role=tab]").eq(1).click()
    cy.contains('button', 'Submit').click()

    cy.get('p[class*="text-red-"]').eq(0).should('have.text', required)
    cy.get('p[class*="text-red-"]').eq(1).should('have.text', required)
    cy.get('p[class*="text-red-"]').eq(2).should('have.text', required)
    cy.get('p[class*="text-red-"]').eq(3).should('have.text', required)

  });
 
  //SCHEMA C
  it("Negative test Schema C", () => {
    cy.visit("http://localhost:3000/");

    cy.get("[role=tab]").should("have.length", 3);
    cy.get("[role=tab]").first().should("have.text", "Schema A");
    cy.get("[role=tab]").eq(1).should("have.text", "Schema B");
    cy.get("[role=tab]").last().should("have.text", "Schema C");

    cy.get("[role=tab]").eq(2).click()
    cy.get('div.border-border input').eq(0).click()
    cy.get('div.border-border input').eq(1).click()
    cy.get('div.border-border input').eq(2).click()
    cy.contains('button', 'Submit').click()


    cy.get('p[class*="text-red-"]').eq(0).should('have.text', required)
    cy.get('p[class*="text-red-"]').eq(1).should('have.text', required)
    cy.get('p[class*="text-red-"]').eq(2).should('have.text', required)
    cy.get('p[class*="text-red-"]').eq(3).should('have.text', required)

    cy.get('div.border-l p').eq(0).should('have.text', required)
    cy.get('div.border-l p').eq(1).should('have.text', required)
    cy.get('div.border-l p').eq(2).should('have.text', required)

    cy.get('p[class*="text-red-"]').eq(7).should('have.text', required)


  });

const minimum: string = 'Minimum length is 5'
const maximum: string = 'Maximum length is 20'
const age: string = 'Minimum value is 0'
const minAppName: string = 'Minimum length is 3'
  //SCHEMA A
  it("BVA Analysis Schema A", () => {
    cy.visit("http://localhost:3000/");

    cy.get("[role=tab]").should("have.length", 3);
    cy.get("[role=tab]").first().should("have.text", "Schema A");
    cy.get("[role=tab]").eq(1).should("have.text", "Schema B");
    cy.get("[role=tab]").last().should("have.text", "Schema C");

    cy.get('input.flex').eq(0).type('M')
    cy.get('input[type="number"]').type('-1')
    cy.contains('button', 'Submit').click()

    cy.get('p[class*="text-red-"]').eq(0).should('have.text', minimum)
    cy.get('p[class*="text-red-"]').eq(1).should('have.text', age)

    cy.get('input.flex').eq(0).type('Max character count should be 20')
    cy.contains('button', 'Submit').click()
    cy.get('p[class*="text-red-"]').eq(0).should('have.text', maximum)

  });

  // Schema B
  it("BVA Analysis Schema B", () => {
    cy.visit("http://localhost:3000/");

    cy.get("[role=tab]").should("have.length", 3);
    cy.get("[role=tab]").first().should("have.text", "Schema A");
    cy.get("[role=tab]").eq(1).should("have.text", "Schema B");
    cy.get("[role=tab]").last().should("have.text", "Schema C");

    cy.get("[role=tab]").eq(1).click()
    cy.get('input.flex').eq(0).type('Ac')
    cy.contains('button', 'Submit').click()
    cy.get('p[class*="text-red-"]').eq(0).should('have.text', minimum)

  });

  //Schema C
  it("BVA Analysis Schema C", () => {
    cy.visit("http://localhost:3000/");

    cy.get("[role=tab]").should("have.length", 3);
    cy.get("[role=tab]").first().should("have.text", "Schema A");
    cy.get("[role=tab]").eq(1).should("have.text", "Schema B");
    cy.get("[role=tab]").last().should("have.text", "Schema C");

    cy.get("[role=tab]").eq(2).click()
    cy.get('input.flex').eq(0).type('M')
    cy.contains('button', 'Submit').click()


    cy.get('p[class*="text-red-"]').eq(0).should('have.text', minAppName)
  });
});
