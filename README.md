#Fidel QAE - UI and API Challenge - Marco Garutti
***

Table of contents
=================

<!--ts-->
   * [Table of contents](#table-of-contents)
   * [Requirements](#requirements)
   * [Repo Structure](#repo-structure)
   * [Overview](#overview)
   * [Test Approach - UI](#ui-test-approach)
   * [Test Approach - API](#api-test-approach)
   * [Running the Tests](#running-the-tests)


Requirements
============
Node.js 10 or 12 and above must be installed to download Cypress through npm. It's possible to check the
node version through:

```bash
$ node -v
```

If Node.js needs to be installed:

```bash
$ npm install npm@latest -g
```

Also, install npx to run cypress without accessing the node_modules\.bin folder:

```bash
npm install -g npx
```

Install Cypress for Mac, Linux, or Windows using npm?

```bash
$ npm install cypress --save-dev
```

This project uses faker-js dependency to generate mock data for the API

```bash
$ npm install @faker-js/faker --save-dev
```

and also Chai for some additional assertions:

```bash
npm install --save-dev chai
```

Repo Structure
==============

* /cypress 
    (contain all Cypress related folders like fixtures, integration (tests folder), commands, etc.)
    * /fixtures 
        * brand.json
        * location.json
        * program.json
    (JSON files of data objects that can be used in tests)
    * /integration
        (the tests folder with two sub-folders to API and UI testing):
        * /api
            * brands.js
            * locations.js
            * programs.js
        * /ui
            * store_Checkout.js
            * store_Wishlist.js
    * /plugins
        * index.js
    * /screenshots
    * /support
      (contain custom commands and index.js file that is loaded automatically before the test run)
        * commands.js
        * index.js
* cypress.json 
  (baseUrl and env variables can be defined here)
* package-lock.json
* package.json
* README.md

Overview
=================

UI Test Approach
=================

After doing some manual testing on the https://demo.opencart.com/ website to understand the workflow and also be familiar with the elements, I started to map the selectors and write the tests for automation.

The mapping could be improved if the website provided some unique attributes for the selectors - like "[data-cy]", mentioned on Cypress documentation as a best practice.

DISCLAIMER: Some things on the opencart website changed since I did this challenge. Some locators and flow behavior changed. Right now, the tests will fail, but eventually I'll update the code and make sure to cover the changes.

API Test Approach
==================

The API documentation was crucial to creating the tests coverage. Since I already had an account on Fidel and the API test key information, I started to send some requests using Postman to check the methods behavior, expected body requests and response. Some of the responses were used as a reference to create the fixtures files. I also used created a collection on Postman to make it easier to keep track of all the automated endpoints.

To make the 'POST' creation more dynamic, I used the 'faker-js' library to generate random information. For the Locations endpoint, I'm using the 'GET' Brands/Programs list and randomizing the IDs.

The tests were created to cover most of the methods (some of them only work on production/live env). Some bad requests are covered as well.

Also, while I was running the tests I also checked the Fidel Dashboard to make sure that the information was available on the front end.

Running the Tests
=================

First of all, the project needs to be downloaded or cloned from this repo. Also, make sure that the 'node_modules' folder is in the project's folder.
A valid Fidel API account is needed to generate the token/API key. Make sure to update the api_key value on cypress.config.js file.
Example:
* fidelapi 
        * cypress 
        * node_modules
        * .gitignore
        * cypress.json
        * package.json
        * package-lock.json
        * README.md


Then, using the command line, access the project folder and, with the command below, Cypress will run all the tests through the command line (without using the interface):

```bash
$ Fidel > npx cypress run
```

You can also specify the API or UI folder to run just one of them with the '- -spec' parameter, for example:

```bash
$ Fidel > npx cypress run --spec "cypress/integration/api/brands.js"
```

To run the tests with the Cypress Interface, use the command:

```bash
$ Fidel > npx cypress open
```