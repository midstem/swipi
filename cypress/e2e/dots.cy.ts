describe('Dots Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/swipi/')
    if (Cypress.env('skipShowDots')) return
    cy.get('[name="showDots"]').check('Yes')
  })

  // SHOW DOTS

  it('Should show dots', () => {
    cy.getByData('dots-wrapper').should('exist')
  })

  it('Should NOT show dots', () => {
    Cypress.env('skipShowDots', true)
    cy.get('[name="showDots"]').check('No')
    cy.getByData('dots-wrapper').should('not.exist')
    Cypress.env('skipShowDots', false)
  })

  it('Should show and then hide the dots', () => {
    cy.getByData('dots-wrapper').should('exist')
    cy.get('[name="showDots"]').check('No')
    cy.getByData('dots-wrapper').should('not.exist')
  })

  // DOTS ANIMATION

  // DEFAULT DOT SIZE

  it('Should change the default dot size', () => {
    cy.getByData('default-dot-size-input').type('24')
    cy.getByData('default-dot').eq(1).should('have.css', 'width', '24px')
  })

  it('Should NOT change the default dot size', () => {
    cy.getByData('default-dot-size-input').type('0')
    cy.getByData('default-dot').eq(1).should('have.css', 'width', '12px')
  })

  // DEFAULT ACTIVE DOT SIZE

  it('Should change the default active dot size', () => {
    cy.getByData('default-active-dot-size-input').type('20')
    cy.getByData('default-dot').eq(0).should('have.css', 'width', '20px')
    cy.get('.right-button').click()
    cy.getByData('default-dot').eq(0).should('have.css', 'width', '12px')
    cy.getByData('default-dot').eq(1).should('have.css', 'width', '20px')
  })

  it('Should NOT change the default active dot size', () => {
    cy.getByData('default-active-dot-size-input').type('0')
    cy.getByData('default-dot').eq(0).should('have.css', 'width', '13px')
  })

  // DOT COLOR

  // ACTIVE DOT COLOR

  // CUSTOM DOT

  it('Should set a unicorn for custom dot', () => {
    cy.get('[name="customDot"]').check('unicorn')
    cy.getByData('black-unicorn')
      .should('exist')
      .and('have.css', 'width', '30px')
  })

  it('Should set a custom circle for custom dot', () => {
    cy.get('[name="customDot"]').check('circle')
    cy.getByData('default-custom-dot')
      .should('exist')
      .and('have.css', 'width', '20px')
  })

  it('Should set custom dots and then reset to the default one for custom dot', () => {
    cy.get('[name="customDot"]').check('unicorn')
    cy.getByData('black-unicorn')
      .should('exist')
      .and('have.css', 'width', '30px')

    cy.get('[name="customDot"]').check('circle')
    cy.getByData('default-custom-dot')
      .should('exist')
      .and('have.css', 'width', '20px')

    cy.get('[name="customDot"]').check('none')
    cy.getByData('default-custom-dot').should('not.exist')
    cy.getByData('default-dot').should('exist')
  })

  // CUSTOM ACTIVE DOT

  it('Should set a red unicorn for custom active dot', () => {
    cy.get('[name="customActiveDot"]').check('red-unicorn')
    cy.getByData('red-unicorn').should('exist').and('have.css', 'width', '30px')
  })

  it('Should set a custom circle for custom active dot', () => {
    cy.get('[name="customActiveDot"]').check('active-circle')
    cy.getByData('custom-active-dot')
      .should('exist')
      .and('have.css', 'width', '13px')
      .and('have.css', 'background-color', 'rgb(255, 145, 1)')
  })

  it('Should set custom active dots and then reset to the default one for custom active dot', () => {
    cy.get('[name="customActiveDot"]').check('red-unicorn')
    cy.getByData('red-unicorn').should('exist').and('have.css', 'width', '30px')

    cy.get('[name="customActiveDot"]').check('active-circle')
    cy.getByData('custom-active-dot')
      .should('exist')
      .and('have.css', 'width', '13px')

    cy.get('[name="customActiveDot"]').check('none')
    cy.getByData('custom-active-dot').should('not.exist')
    cy.getByData('default-dot').should('exist')
  })
})
