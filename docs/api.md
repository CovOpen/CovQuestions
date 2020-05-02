# API

## Development

Edit the spec here: https://stoplight.io/p/studio/gh/CovOpen/CovQuestions

Create the accoring API Client/Server with https://openapi-generator.tech/docs/generators
Create Typescript Interfaces from openApi https://www.npmjs.com/package/openapi-typescript-codegen

Use Express Typescript in two steps:

1. Generate Static files
2. Provide API for static files

Serve documentation
Use Prism for Validation. (https://stoplight.io/p/docs/gh/stoplightio/prism)

Testing:
https://zellwk.com/blog/endpoint-testing/

Documentation: redoc-cli bundle [spec]

https://learning.postman.com/docs/postman/api-documentation/documenting-your-api/

https://github.com/TwineHealth/TwineDeveloperDocs

https://www.npmjs.com/package/openapi-examples-validator

https://medium.com/@Scampiuk/handling-api-validation-with-openapi-swagger-documents-in-nodejs-1f09c133d4d2

## General Architecture

### Pre Build

> Info: Adds new questionnaires into the `/data` structure, updates the main translations with the new questionnaire data. Can also update the translations of a questionnaire to a newer version.

### API Build

> Info: Produces always the same result. (only dependent from `/data` files)
