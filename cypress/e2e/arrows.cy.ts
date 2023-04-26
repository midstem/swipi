describe('Arrows Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/swipi/')
  })

  // PREV BUTTON

  it('Should set custom left arrow and reset to default one', () => {
    cy.get('[name="prevButton"]').check('left-arrow')
    cy.getByData('left-arrow').should('exist')
    cy.get('[name="prevButton"]').check('none')
    cy.getByData('left-arrow').should('not.exist')
  })

  // NEXT BUTTON

  it('Should set custom right arrow and reset to default one', () => {
    cy.get('[name="nextButton"]').check('right-arrow')
    cy.getByData('right-arrow').should('exist')
    cy.get('[name="nextButton"]').check('none')
    cy.getByData('right-arrow').should('not.exist')
  })
})
