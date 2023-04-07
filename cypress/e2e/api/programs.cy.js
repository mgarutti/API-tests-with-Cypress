import { faker } from '@faker-js/faker';
import { expect } from 'chai';

var apiData = {
    randomName: faker.commerce.productAdjective(),
    randomPostCode: faker.address.zipCode(),
    randomAddress: faker.address.streetAddress(),
    randomCity: faker.address.city(),
    randomNumber: faker.datatype.number(),
    brandId: null,
    programId: null,
    programName: null,
}

var idCount = null
var indexPosition = null

context('When using the Programs endpoint', () => {

    it('POST a new Program', () => {
        cy.fixture('program.json').then(programBody => {
            programBody.name = apiData.randomName + apiData.randomNumber
            cy.request({
                method: 'POST',
                url: Cypress.env('programs_url'),
                body: programBody,
                headers: {
                    'content-type': 'application/json',
                    'fidel-key': Cypress.env("api_key"),
                },
            })
                .then((resp) => {
                    expect(resp.status).to.eq(201)
                    expect(resp.body.items[0]).to.have.property('name', programBody.name)
                    expect(resp.body.items[0]).to.have.property('id').not.empty
                })
        })
    })

    it('POST a Program with Invalid Key', () => {
        cy.fixture('program.json').then(programBody => {
            programBody.name = apiData.randomName
            cy.request({
                method: 'POST',
                url: Cypress.env('programs_url'),
                body: programBody,
                headers: {
                    'content-type': 'application/json',
                    'fidel-key': 'invalid-key',
                },
                failOnStatusCode: false,
            })
                .then((resp) => {
                    expect(resp.status).to.eq(401)
                    expect(resp.body.error).to.have.property('message').not.empty
                })
        })
    })

    it('GET the Programs list', () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('programs_url'),
            headers: {
                'content-type': 'application/json',
                'fidel-key': Cypress.env('api_key'),
            },
        })
            .then((resp) => {
                expect(resp.status).to.eq(200)
                expect(resp.body.items[0]).to.have.property('name').not.empty
                expect(resp.body.items[0]).to.have.property('id').not.empty
                expect(resp.body.count).to.be.greaterThan(0)
            })
    })

    it('GET an invalid Program', () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('programs_url') + '/non-existent-id',
            headers: {
                'content-type': 'application/json',
                'fidel-key': Cypress.env('api_key'),
            },
            failOnStatusCode: false,
        })
            .then((resp) => {
                expect(resp.status).to.eq(400)
                expect(resp.body.error).to.have.property('message', 'Invalid uuid')
            })
    })

    it('PATCH a Program', () => {
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
        cy.fixture('program.json').then(programBody => {
            programBody.name = apiData.randomName
            cy.request({
                method: 'PATCH',
                url: Cypress.env('programs_url') + '/' + apiData.programId,
                body: programBody,
                headers: {
                    'content-type': 'application/json',
                    'fidel-key': Cypress.env("api_key"),
                },
            })
                .then((resp) => {
                    expect(resp.status).to.eq(200)
                    expect(resp.body.items[0]).to.have.property('name', programBody.name)
                    expect(resp.body.items[0]).to.have.property('id').not.empty
                })
        })
    })

    it('PATCH a Program with a short name', () => {
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
        cy.fixture('program.json').then(programBody => {
            programBody.name = 'BB8'
            cy.request({
                method: 'PATCH',
                url: Cypress.env('programs_url') + '/' + apiData.programId,
                body: programBody,
                headers: {
                    'content-type': 'application/json',
                    'fidel-key': Cypress.env("api_key"),
                },
                failOnStatusCode: false,
            })
                .then((resp) => {
                    expect(resp.status).to.eq(400)
                    expect(resp.body.error.metadata[0]).to.have.property('message', 'should NOT be shorter than 4 characters')
                })
        })
    })
})