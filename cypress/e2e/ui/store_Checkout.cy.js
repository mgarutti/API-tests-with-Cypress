import { assert, expect } from 'chai';

context('User browsing through Your Store website', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('your_store_url'))
        cy.registerUser()
    })

    it('adds two products to cart and check its values', () => {
        cy.contains('MP3 Players')
            .click()
        cy.contains('Show All MP3 Players')
            .click()
        cy.get('[data-bs-original-title="Add to Cart"]')
            .first()
            .click()
        cy.contains("Success: You have added")
        cy.get('[data-bs-original-title="Add to Cart"]')
            .last()
            .click()
        cy.contains("Success: You have added")
        cy.contains('shopping cart')
            .click()
        cy.get("tr:nth-child(1) td:nth-child(6)")
            .last()
            .then(($value) => {
                var first_product_value = $value.text().substring(1)
                first_product_value = parseFloat(first_product_value)
                cy.get("tr:nth-child(2) td:nth-child(6)")
                    .then(($value) => {
                        var second_product_value = $value.text().substring(1)
                        second_product_value = parseFloat(second_product_value)
                        cy.get("tr:nth-child(4) td:nth-child(2)")
                            .last()
                            .then(($value) => {
                                var first_cart_sum_value = null
                                var total_value = $value.text().substring(1)
                                total_value = parseFloat(total_value)
                                first_cart_sum_value = first_product_value + second_product_value
                                expect(total_value).be.eq(first_cart_sum_value)
                                cy.get('[type="text"]').eq(1)
                                    .clear()
                                    .type(2)
                                    .get('[type="submit"]').eq(0)
                                    .click()
                                cy.contains('Success: You have modified your shopping cart!')
                                cy.get("tr:nth-child(4) td:nth-child(2)")
                                    .last()
                                    .then(($value) => {
                                        var updated_total_value = $value.text().substring(1)
                                        updated_total_value = parseFloat(updated_total_value)
                                        assert.isTrue(updated_total_value > first_cart_sum_value, cy.log('Cart value was increased!'))
                                    })
                            })
                    })
            })

    })

    after(() => {
        cy.clearCookies()
    })
})