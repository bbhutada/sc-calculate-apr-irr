## Author: Bhagyashri Bhutada

# sc-calculate-apr-irr
This is a backend application which exposes secured end points to calculate APR and IRR for the given cashflows. 
It is a REST server built using Express running on node.js, mongoose & mongodb.

Note: In ideal senario, frontend can be built using appropriate javascript library React.js/Redux along with bootstrap.

#### The node.js server is written in latest ES 2017 syntax completely with async/await and latest node.js version (10.15) is used. Also, code is completely documented along with design/pattern decision description and method usage documentation

## pre-requisites
1] mongodb server must be installed

## npm dependencies
1] "express": "^4.17.1",<br/>
2] "financejs": "^4.1.0",<br/>
3] "jsonwebtoken": "^8.5.1",<br/>
4] "mongodb": "^3.3.5"

## Dev dependencies
1] Mocha<br/>
2] Chai<br/>
3] Supertest

## How to run
  1. git clone the project
  2. cd sc-calculate-apr-irr
  3. npm i
  4. npm start
  5. Go to http://localhost:3000/aprIrrCalculatorApi
  6. npm test ( To run integration tests )

## File Structure
<b>cashFlow.json</b><br/> Input cash flow used for testing purposes<br/>
<b>src:</b><br/>  It contains all the server side code<br/>
1] ./src/server.js -> Start point of the server <br/>
2] ./src/config.json -> Contains http server and mongodb database configuration (user should configure this) <br/>
3] ./src/middleware/index.js -> Exposes JWT "sign" and "verify" token methods<br/>
5] ./src/controller/calculateAprIrr.controller.js -> Exposes methods connected to /aprIrrCalculatorApi REST end points<br/>
6] ./src/controller/auth.controller.js -> Exposes methods connected to /aprIrrCalculatorApi/requestAuthToken REST end point<br/>
7] ./src/database/models/user.model.js -> Exposes schema and range of methods to fetch data from mongodb server<br/>
8] ./src/database/index.js -> Exposes init method to connect mongoose client to mongodb server<br/>
9] ./src/routes/index.js -> Exposes all the required ( urls ) end points<br/>
10] ./src/utils/index.js -> Just exposes 'formatPromiseResult' method to be used with async/await and other helper functions<br/>

<b>test:</b> It has test setup config and integrations tests <br/>

## Exposed REST Endpoints

### GET <base_url>/aprIrrCalculatorApi
  * This method return a json object with welcome message and end points.
  * An example output response is as follows: 
  ```{ message: '<b>Hello,</b> Welcome to APR & IRR Calculator', toGetJwtToken: '<host>/mortgageCalculation/requestAuthToken', toCalculateAprAndIrr: '<host>/mortgageCalculation/getAprIrrValues' }```

### POST /aprIrrCalculatorApi/requestAuthToken
  * request body 'username' & 'password'.
  * This method generates the token for the given user and saves the user details with token in database. If the user already exists than only token is updated.
  * An example output response is as follows: 
  ```{ message:'Authentication token is generated for username => Employee:<br>', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm ......'```
  
### POST /aprIrrCalculatorApi/calculateAprIrrValues
  * request body = cashFlow.json ( Provided )
  * request headers = { Authorization: 'eyJ1c2Vyb.....' } ( JWT token obtained from above rest end point)
  * This request goes through middleware - verifies the provided token and than return the calculated APR using formula "APR = ((Fees+Interest)/Principal*n)*365*100" & IRR is calculated using npm "financejs" library
  * An example output response is as follows: ```{ apr: 22.55, irr: 0.0335 }```
