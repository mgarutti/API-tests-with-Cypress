import { faker } from '@faker-js/faker';

var apiData = {
    randomName: faker.commerce.product(),
    randomPostCode: faker.address.zipCode(),
    randomAddress: faker.address.streetAddress(),
    randomCity: faker.address.city(),
    randomNumber: faker.datatype.number(),
    brandId: null,
    programId: null,
}

var idCount = null
var indexPosition = null

context('When using the Locations endpoint', () => {

    it('POST a new Location', () => {
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
                })
        })
    })

    it('GET the Locations list', () => {
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
            url: Cypress.env('programs_url') + '/' + apiData.programId + Cypress.env('locations_url'),
            headers: {
                'content-type': 'application/json',
                'fidel-key': Cypress.env('api_key'),
            },
        })
            .then((resp) => {
                expect(resp.status).to.eq(200)
                expect(resp.body.items[0]).to.have.property('accountId').not.empty
                expect(resp.body.items[0]).to.have.property('id').not.empty
                expect(resp.body.items[0]).to.have.property('brandId').not.empty
                expect(resp.body.count).to.be.greaterThan(0)
            })
    })

    it('GET the Locations list using an invalid Program ID', () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('programs_url') + '/' + 'invalid-id' + Cypress.env('locations_url'),
            headers: {
                'content-type': 'application/json',
                'fidel-key': Cypress.env('api_key'),
            },
            failOnStatusCode: false
        })
            .then((resp) => {
                expect(resp.status).to.eq(400)
                expect(resp.body.error).to.have.property('message', 'Invalid uuid')
            })
    })


    it('GET the Locations list by Brand', () => {
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
        cy.request({
            method: 'GET',
            url: Cypress.env('brands_url') + '/' + apiData.brandId + Cypress.env('programs_url') + '/' + apiData.programId + Cypress.env('locations_url'),
            headers: {
                'content-type': 'application/json',
                'fidel-key': Cypress.env('api_key'),
            },
        })
            .then((resp) => {
                expect(resp.status).to.eq(200)
            })
    })

    it('DELETE a Location', () => {
        cy.createLocation().then((locationId) => {
            cy.request({
                method: 'DELETE',
                url: Cypress.env('locations_url') + '/' + locationId,
                headers: {
                    'content-type': 'application/json',
                    'fidel-key': Cypress.env('api_key'),
                },
            })
                .then((resp) => {
                    expect(resp.status).to.eq(204)
                })
            })
    
        })
})
