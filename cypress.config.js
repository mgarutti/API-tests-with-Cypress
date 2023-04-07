module.exports = {
  env: {
    brands_url: '/brands',
    programs_url: '/programs',
    locations_url: '/locations',
    your_store_url: 'https://demo.opencart.com/index.php',
    api_key: 'please_create_your_own_key_then_insert_here',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://api.fidel.uk/v1',
  },
}
