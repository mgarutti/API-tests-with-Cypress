
context('User browsing through Your Store website', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('your_store_url'))
        cy.registerUser()
    })

    it('opens the Wishlist, add and add remove two products', () => {
        cy.contains('MP3 Players')
            .click()
        cy.contains('Show All MP3 Players')
            .click()
        cy.get('[data-original-title="Add to Wish List"]')
            .first()
            .click()
        cy.contains("Success: You have added")
        cy.get('[data-original-title="Add to Wish List"]')
            .last()
            .click()
        cy.contains("Success: You have added")
        cy.get('[title="Wish List (2)"]')
        .click()
        cy.get('[data-original-title="Remove"]')
        .first()
        .click()
        cy.contains("Success: You have modified your wish list!")
        cy.get('[data-original-title="Remove"]')
        .click()
        cy.contains("Success: You have modified your wish list!")
        cy.contains("Your wish list is empty.")
    })

    after(() => {
        cy.clearCookies()
    })
})