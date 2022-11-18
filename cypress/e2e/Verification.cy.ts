describe('Verification process', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl)
  })

  it('page can be opened', () => {
    cy.contains('Verification Form')
  })

  it('option yes/no can be selected', () => {
    cy.get('Button[id*="yesBtn"]').first().as('yesBtn-0')
    cy.get('Button[id*="noBtn"]').first().as('noBtn-0')
    cy.get('@yesBtn-0').click()
    // check if there's an element with class Button Selected and if it's the same as the one we clicked
    cy.get('*[class*="ButtonSelected"]').contains('Yes')
    cy.get('@noBtn-0').click()
    cy.get('*[class*="ButtonSelected"]').contains('No')
  })

  it('option yes enables next check', () => {
    cy.get('Button[id*="yesBtn"]').as('yesBtns')
    cy.get('@yesBtns').first().click()
    // setting an alias to reference it without refetching dom element, gets the 2nd element
    cy.get('@yesBtns').eq(1).should('not.be.disabled')
  })

  it('option no disables next checks', () => {
    cy.get('Button[id*="noBtn"]').first().click()
    // setting an alias to reference it without refetching dom element
    cy.get('Button[id*="yesBtn"]').each(
      (btn, index) => {
        if (index === 0) return
        cy.wrap(btn).should('be.disabled')
      }
    )
  })

  it('can submit form when all answers are yes', () => {
    // we click the sequence of yes buttons to be able to submit the form
    cy.get('Button[id*="yesBtn"]').each(($el) => {
      cy.wrap($el).click()
    })

    cy.get('Button[type*="submit"]').should('not.be.disabled')
  })

  it('can submit form when one answer is no and the congratulation screen is shown and can come back to the app', () => {
    cy.get('Button[id*="noBtn"]').first().click()
    cy.get('Button[type*="submit"]').as("submitButton")
    cy.get("@submitButton").should('not.be.disabled')
    cy.get("@submitButton").click()
    cy.contains("Congratulations")
    cy.get("Button").click()
    cy.contains("Verification Form")
  })


  it('can use keyboard to move up(up arrow) and down(down arrow) the list of checks and select yes(1) and no(2) options', () => {
    // move to no, second check should be disabled
    const elementHasActiveClass = ($el: any) => {
      // we check if the element is focused
      const classList = Array.from($el[0].classList);
      return classList.some((classStr: any) => classStr.includes("active"))
    }
    cy.get("body").type('2')
    cy.get('Button[id*="yesBtn"]').as('yesBtns')
    cy.get('@yesBtns').eq(1).should('be.disabled')
    // move to yes
    cy.get("body").type('1')
    cy.get('@yesBtns').eq(1).should('not.be.disabled')
    // navigate back to the first element
    cy.get('div[class*="ButtonGroupContainer"]').as('buttonGroupContainers')
    // navigate down to the second element
    cy.get("body").type("{downArrow}")
    cy.get("@buttonGroupContainers").eq(1).should('satisfy', elementHasActiveClass)
    // navigate up to the first element
    cy.get("body").type("{upArrow}")
    cy.get("@buttonGroupContainers").eq(0).should('satisfy', elementHasActiveClass)
  })

})