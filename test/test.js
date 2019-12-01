/**
 * User: bhagyashributada
 */

const
    request = require( 'supertest' ),
    cashFlowData = require( '../cashFlow' ),
    {httpServer} = require( '../src/config' ),
    apiUrl = '/aprIrrCalculatorApi',
    requestAuthTokenUrl = `${apiUrl}/requestAuthToken`,
    aprIrrCalculatorUrl = `${apiUrl}/calculateAprIrrValues`,
    userDetails = {username: 'Employee', password: 'Password@123'};

describe( `Integration tests`, function() {

    let jwtToken;

    it( `GET: ${apiUrl} response should successfully return json with end points & welcome message`, function( done ) {
        request( `http://localhost:${httpServer.port}` )
            .get( `${apiUrl}` )
            .expect( 'Content-Type', /json/ )
            .expect( 200 )
            .end( ( err, response ) => {
                if( err ) {
                    return done( err );
                }
                expect( response.body ).to.be.a( 'object' );
                expect( response.body ).to.have.all.keys( 'message', 'toGetJwtToken', 'toCalculateAprAndIrr' );
                done();
            } );
    } );

    it( `POST: ${requestAuthTokenUrl} response should successfully return JWT token`, function( done ) {
        request( `http://localhost:${httpServer.port}` )
            .post( `${requestAuthTokenUrl}` )
            .send( userDetails )
            .expect( 'Content-Type', /json/ )
            .expect( 200 )
            .end( ( err, response ) => {
                if( err ) {
                    return done( err );
                }
                expect( response.body ).to.be.a( 'object' );
                expect( response.body ).to.have.all.keys( 'token', 'message' );
                jwtToken = response.body.token;
                done();
            } );
    } );

    it( `POST: ${aprIrrCalculatorUrl} should block the request if JWT token is not set on header`, function( done ) {
        request( `http://localhost:${httpServer.port}` )
            .post( `${aprIrrCalculatorUrl}` )
            .send( cashFlowData )
            .expect( 400 )
            .expect( 'Error occurred, Authentication token is required, please provide the jwt token !!' )
            .end( done );
    } );

    it( `POST: ${aprIrrCalculatorUrl} should block the request if incorrect JWT token is set on header`, function( done ) {
        request( `http://localhost:${httpServer.port}` )
            .post( `${aprIrrCalculatorUrl}` )
            .send( cashFlowData )
            .set( 'Authorization', 'incorrect token' )
            .expect( 400 )
            .expect( 'Error occurred, could not verify the token: JsonWebTokenError: jwt malformed' )
            .end( done );
    } );

    it( `POST: ${aprIrrCalculatorUrl} should successfully calculate 'apr': 22.55 and 'irr': 0.0335 is JWT token is set on header`, function( done ) {
        request( `http://localhost:${httpServer.port}` )
            .post( `${aprIrrCalculatorUrl}` )
            .send( cashFlowData )
            .set( 'Authorization', jwtToken )
            .expect( 'Content-Type', /json/ )
            .expect( 200 )
            .end( ( err, response ) => {
                if( err ) {
                    return done( err );
                }
                expect( response.body ).to.be.a( 'object' );
                expect( response.body ).to.have.all.keys( 'apr', 'irr' );
                expect( response.body.apr ).to.equal(22.55);
                expect (response.body.irr).to.equal(0.0335);
                done();
            } );
    } );
} );