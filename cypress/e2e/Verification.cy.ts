describe('Verification process', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl)
  })

  it('page can be opened', () => {
    cy.contains('Verification Form')
  })

  it('option yes/no can be selected', () => {
    cy.get('#yesBtn-0').as('yesBtn-0')
    cy.get('#noBtn-0').as('noBtn-0')
    cy.get('@yesBtn-0').click()
    // check if there's an element with class Button Selected and if it's the same as the one we clicked
    cy.get('*[class*="ButtonSelected"]').contains('Yes')
    cy.get('@noBtn-0').click()
    cy.get('*[class*="ButtonSelected"]').contains('No')
  })

  it('option yes enables next check', () => {
    cy.get('#yesBtn-0').click()
    // setting an alias to reference it without refetching dom element
    cy.get('#yesBtn-1').as('yesBtn-1')

    cy.get('@yesBtn-1').should('not.be.disabled')
  })

  it('option no disables next checks', () => {
    cy.get('#noBtn-0').click()
    // setting an alias to reference it without refetching dom element
    cy.get('#yesBtn-1').should('be.disabled')
    cy.get('#yesBtn-2').should('be.disabled')
    cy.get('#yesBtn-3').should('be.disabled')
  })

  it('can submit form when all answers are yes', () => {
    // we click the sequence of yes buttons to be able to submit the form
    cy.get('Button[id*="yesBtn"]').each(($el) => {
      cy.wrap($el).click()
    })

    cy.get('Button[type*="submit"]').should('not.be.disabled')
  })

  it('can submit form when one answer is no', () => {
    cy.get("#noBtn-0").click()
    cy.get('Button[type*="submit"]').should('not.be.disabled')

  })

})