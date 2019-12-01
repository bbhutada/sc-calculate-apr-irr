/**
 * User: bhagyashributada
 */

const
    {formatPromiseResult} = require( '../utils' ),
    {findUserAndUpdate} = require( '../database/models/user.model' ),
    {signToken} = require( '../middleware' );

async function generateJwtToken( req, res ) {

    let
        err, result, token;

    const
        {username, password} = req && req.body;

    //----------------------------- Checks username and password -------------------------------------------------------
    if( !username || !password ) {
        return res.status( 400 ).send( 'Error Occurred, please provide username & password to generate the token !!' );
    }

    //----------------------------- If the token is not available then it generates token ------------------------------

    [err, token] = await formatPromiseResult( signToken( username, password ) );

    if( err ) {
        return res.status( 500 ).send( `Error occurred, while signing the token: ${err.stack || err}` )
    }

    //--------------------------- If User exists token is updated else new User is created  ----------------------------

    [err, result] = await formatPromiseResult( findUserAndUpdate( username, password, token ) );

    if( err ) {
        return res.status( 500 ).send( `Error occurred, while querying the user from db: ${err.stack || err}` )
    }

    console.log( `Token is generated for the "${result.username}" and saved in database` );

    //---------------------------- Send the Response -------------------------------------------------------------------
    res.json( {message: `Authentication token is generated for username => ${username}:<br>`, token: token} );
}

module.exports = {
    generateJwtToken
};