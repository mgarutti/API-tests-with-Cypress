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

    it('POST a new Brand', () => {
        cy.fixture('brand.json').then(brandBody => {
            brandBody.name = apiData.randomName + apiData.randomNumber
            cy.log(brandBody.name)
            cy.request({
                method: 'POST',
                url: Cypress.env('brands_url'),
                body: brandBody,
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

    it('POST a Brand with Invalid Key', () => {
        cy.fixture('brand.json').then(brandBody => {
            brandBody.name = apiData.randomName
            cy.request({
                method: 'POST',
                url: Cypress.env('brands_url'),
                body: brandBody,
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

    it('GET the Brands list', () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('brands_url'),
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

    it('GET the Brands list with Invalid Key', () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('brands_url'),
            headers: {
                'content-type': 'application/json',
                'fidel-key': 'invalid-key',
            },
            failOnStatusCode: false
        })
            .then((resp) => {
                expect(resp.status).to.eq(401)
                expect(resp.body.error).to.have.property('message').not.empty
            })
    })

    it('PATCH a Brand with a new Website', () => {
        function randomPosition(minPosition, maxPosition) {
            return Math.floor(Math.random() * (maxPosition - minPosition + 1)) + minPosition;
        }
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
        cy.fixture('brand_update.json').then(brandBody => {
            brandBody.websiteURL = 'https://www.' + apiData.randomName + '.com'
            cy.request({
                method: 'PATCH',
                url: Cypress.env('brands_url') + '/' + apiData.brandId,
                body: brandBody,
                headers: {
                    'content-type': 'application/json',
                    'fidel-key': Cypress.env("api_key"),
                },
            })
                .then((resp) => {
                    expect(resp.status).to.eq(200)
                    expect(resp.body.items[0]).to.have.property('websiteURL',  brandBody.websiteURL)
                    expect(resp.body.items[0]).to.have.property('id').not.empty
                })
        })
    })

    it('PATCH a Brand with a new Name', () => {
        function randomPosition(minPosition, maxPosition) {
            return Math.floor(Math.random() * (maxPosition - minPosition + 1)) + minPosition;
        }
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
        cy.fixture('brand_update.json').then(brandBody => {
            brandBody.name = apiData.randomName
            cy.request({
                method: 'PATCH',
                url: Cypress.env('brands_url') + '/' + apiData.brandId,
                body: brandBody,
                headers: {
                    'content-type': 'application/json',
                    'fidel-key': Cypress.env("api_key"),
                },
                failOnStatusCode: false
            })
                .then((resp) => {
                    expect(resp.status).to.eq(400)
                    expect(resp.body.error).to.have.property('message').not.empty
                })
        })
    })
})