/**
 * User: bhagyashributada
 *
 * This module is the middleware which exposes "sign" & "verify" methods of jsonwebtoken
 */

const
    {formatPromiseResult} = require( '../utils' ),
    {verify, sign} = require( 'jsonwebtoken' ),
    {auth: {secret, expiresIn}} = require( '../config' ),
    {getUserByCredential} = require( '../database/models/user.model' ),
    {promisify} = require( 'util' ),
    verifyProm = promisify( verify ),
    signProm = promisify( sign );

/**
 * This method verifies the provided token using secret
 * @param token
 * @returns {Promise<*>}
 */
function verifyToken( token ) {
    return verifyProm( token, secret )
}

/**
 * This method uses username & password
 * @param username
 * @param password
 * @returns {Promise<*>}
 */
function signToken( username, password ) {
    return signProm( {username, password}, secret, {expiresIn} );
}

async function verifyJwtToken( req, res, next ) {

    let
        err, result, tokenObj;

    const
        requestHeader = req && (req.headers['x-access-token'] || req.headers['authorization'] || req.header( 'Authorization' )),
        token = requestHeader && requestHeader.replace( 'Bearer ', '' );

    if( !token ) {
        return res.status( 400 ).send( 'Error occurred, Authentication token is required, please provide the jwt token !!' );
    }

    [err, tokenObj] = await formatPromiseResult( verifyToken( token ) );

    if( err ) {
        return res.status( 400 ).send( `Error occurred, could not verify the token: ${err}` );
    }

    // ----------------------- Check if user exists in database ----------------------------------

    [err, result] = await formatPromiseResult( getUserByCredential( tokenObj ) );

    if( err || !result || !Object.keys( result ).length ) {
        let
            msg = 'Error occurred, could not verify the token, please check the token or create new one';

        if( err ) {
            msg = `${msg}: ${err.stack || err}`;
        }

        return res.status( 500 ).send( msg );
    }
    next();
}

module.exports = {
    verifyJwtToken,
    signToken
};