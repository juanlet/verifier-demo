# Validation Form

This form validates from highest priority to lowest different requirements. The user needs to fullfil all of them for identity validation.
# Live Demo


# Run development server

```
npm run dev
```

# Run Unit tests
Vitest test runner and react testing library have been used to create the test suites for the react components that are part of this project

```
npm run test
```

# Run Cypress tests(e2e)

Prerequisites: The development server needs to be up first. To start it check [this](#run-development-server)

This will execute end to end tests to replicate user actions in the browser

```
npm run test:e2e
```
A new instance of chrome browser will open and the tests will run. 

To configure the domain in which the end to end tests will run, set baseUrl in cypress.config.ts with the domain you used to start the development server. This is the url that cypress will visit during the e2e test runs. Default: http://localhost:5174/

Alternatively, you can open Cypress wizard using

```
npm run cy:open
```

Then go to e2e Testing -> Pick Browser(eg: Chrome) -> Start E2E Testing -> Select Verification.cy.ts to run the tests relevant to this feature

# Build

```
npm run build
```

Output files will be placed at **dist** directory(root level). Those files can be deployed to a cloud service of your choice. This build produces ES3 javascript code intentionally to give support to older browsers, and in that way, increase the reach of the application.