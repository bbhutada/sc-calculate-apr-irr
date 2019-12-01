/**
 * User: bhagyashributada
 *
 * * This module is a standard express router config file
 */

const
    {Router} = require( 'express' ),
    {calculateAprIrrValues, sendWelcomeMessage} = require( '../controller/calculateAprIrr.controller' ),
    {generateJwtToken} = require( '../controller/auth.controller' ),
    {verifyJwtToken} = require( '../middleware' ),
    router = Router();

router.get( '/', [sendWelcomeMessage] );

router.post( '/requestAuthToken', [generateJwtToken] );

router.post( '/calculateAprIrrValues', [verifyJwtToken, calculateAprIrrValues] );

module.exports = router;