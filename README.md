# Validation Form

This form validates from highest priority to lowest different requirements. To navigate the form through down and up the check list, and to answer the checks with YES or NO, use the keyboard keys 1(yes), 2(no), up(up arrow), down(down arrow), or alternatively, use the mouse.
# Live Demo

https://63677a5f0ff40800094bc7f3--deluxe-truffle-9efdb2.netlify.app/

# Run development server

```
npm run dev
```

# Run Unit tests
Vitest test runner and react testing library have been used to create the test suites for the react components that are part of this project. To run the tests with code coverage information included execute 

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

Then go to e2e Testing -> Pick Browser(Chrome, Electron or Firefox supported for now) -> Start E2E Testing -> Select Verification.cy.ts to run the tests relevant to this feature

A video demo with the tests can be found in **cypress/videos/Verification.cy.ts.mp4**(this should go in .gitignore generally but it was left there for demo purposes)

IMPORTANT: **Due to the checks fetch being fake we cannot use Cypress interceptors to handle the random error on the mock promise set by the interviewers. The treshold for the random error has been set to happen with really low probability so the e2e tests run fine 99.9% of the time. The error handling messages and fetch retry functionalities have been implemented though to improve user experience. If that was a real request, we could just use cypress interceptor and check for a 500 status and see if the error message shows up on the UI. Unit tests are not affected by this**

# Build

```
npm run build
```

Output files will be placed at **dist** directory(root level). Those files can be deployed to a cloud service of your choice. This build produces ES5 javascript code intentionally to give support to older browsers, and in that way, increase the reach of the application.

# Deploy to Netlify

Everytime a change gets pushed through git, netlify will detect the change, rebuild and publish it to 

https://63677a5f0ff40800094bc7f3--deluxe-truffle-9efdb2.netlify.app/
