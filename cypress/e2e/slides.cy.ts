describe('Slides Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/swipi/')
  })

  // SLIDES NUMBER

  it('Should set the number of slides', () => {
    cy.getByData('slides-number-input').type('5')
    cy.getByData('slides-wrapper')
      .invoke('width')
      .then((wrapperWidth) => {
        cy.getByData('slide')
          .eq(0)
          .invoke('width')
          .then((childWidth) => {
            if (!wrapperWidth || !childWidth) return
            expect(Math.round(wrapperWidth / childWidth)).to.eq(5)
          })
      })
  })

  // SPACE BETWEEN SLIDES

  it('Should set the size between slides', () => {
    cy.getByData('space-between-slides-input').type('7')
    cy.getByData('slide').eq(0).should('have.css', 'padding-right', '7px')
  })

  // ANIMATION SPEED

  it.only('Should set the animation speed', () => {
    cy.getByData('slide').eq(0).should('have.css', 'transform', '12px')
  })

  // CONFIG

  it('Should minimize slides number after resize', () => {
    cy.getByData('max-number-input').type('800')
    cy.getByData('config-slides-number-input').type('2')
    cy.getByData('space-between-input').type('5')
    cy.get('[name="biasRight"]').check('yes')
    cy.viewport(800, 1000)
    cy.wait(100)
    cy.getByData('slides-wrapper')
      .invoke('width')
      .then((wrapperWidth) => {
        cy.getByData('slide')
          .eq(0)
          .invoke('width')
          .then((childWidth) => {
            if (!wrapperWidth || !childWidth) return
            expect(Math.floor(wrapperWidth / childWidth / 0.5) * 0.5).to.eq(2.5)
          })
      })

    cy.getByData('slide').eq(0).should('have.css', 'padding-right', '5px')
  })
})
