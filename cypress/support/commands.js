// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { faker } from '@faker-js/faker';

var apiData = {
    randomName: faker.commerce.product(),
    randomPostCode: faker.address.zipCode(),
    randomAddress: faker.address.streetAddress(),
    randomCity: faker.address.city(),
    randomNumber: faker.datatype.number(),
    brandId: null,
    programId: null,
    locationId: null,
}

var userData = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userEmail: faker.internet.email(),
    userPassword: faker.datatype.string(),
}

var idCount = null
var indexPosition = null

Cypress.Commands.add('registerUser', () => {
    cy.get('[class="d-none d-md-inline"]')
        .contains("My Account")
        .click()
    cy.contains('Register')
        .click()
    cy.contains('First Name')
        .type(userData.firstName)
    cy.contains('Last Name')
        .type(userData.lastName)
    cy.contains('E-Mail')
        .type(userData.userEmail)
    cy.get('[name="password"]')
        .type(userData.userPassword)
    cy.get('[name="agree"]')
        .click()
    cy.contains('Continue')
        .click()
    cy.contains('Continue')
        .click()
})

Cypress.Commands.add('createLocation', () => {
    function randomPosition(minPosition, maxPosition) {
        return Math.floor(Math.random() * (maxPosition - minPosition + 1)) + minPosition;
    }
    cy.request({
        method: 'GET',
        url: Cypress.env('programs_url'),
        headers: {
            'content-type': 'application/json',
            'fidel-key': Cypress.env('api_key'),
        },
    }).its('body').then((body) => {
        idCount = body.count
        indexPosition = randomPosition(0, idCount)
        apiData.programId = body.items[indexPosition].id
    })
    cy.request({
        method: 'GET',
        url: Cypress.env('brands_url'),
        headers: {
            'content-type': 'application/json',
            'fidel-key': Cypress.env('api_key'),
        },
    }).its('body').then((body) => {
        idCount = body.count
        indexPosition = randomPosition(0, idCount)
        apiData.brandId = body.items[indexPosition].id
    })
    cy.fixture('location.json').then(locationBody => {
        locationBody.address = apiData.randomAddress
        locationBody.city = apiData.randomCity
        locationBody.postcode = apiData.randomPostCode
        locationBody.brandId = apiData.brandId
        locationBody.searchBy.merchantIds.visa[0] = apiData.randomNumber.toString()
        locationBody.searchBy.merchantIds.mastercard[0] = apiData.randomNumber.toString()
        cy.request({
            method: 'POST',
            url: Cypress.env('programs_url') + '/' + apiData.programId + Cypress.env('locations_url'),
            body: locationBody,
            headers: {
                'content-type': 'application/json',
                'fidel-key': Cypress.env('api_key'),
            },
        })
            .then((resp) => {
                expect(resp.status).to.eq(201)
                cy.wrap(apiData.locationId = (resp.body.items[0].id))
            })
    })
})