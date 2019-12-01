/**
 * User: bhagyashribhutada
 */

const
    express = require( 'express' ),
    router = require( './routes' ),
    {httpServer, mongodbConfig} = require( './config' ),
    {formatPromiseResult} = require( './utils' ),
    {init} = require( './database' ),
    {json, urlencoded} = express,
    app = express();

/**
 * Immediately invoking async method which does all the standard server startup routine.
 */

(async () => {

    // --------------------- 1. Add all the required express middleware ---------------------

    app.use( json() );
    app.use( urlencoded( {extended: true} ) );

    app.use( `/aprIrrCalculatorApi`, router );

    // ---------------------------- 1. END -------------------------------------------------

    // -------------------- 2. initialize database -----------------------------------------
    [err] = await formatPromiseResult( init( mongodbConfig ) );

    if( err ) {
        console.log( `Failed to connect to mongodb. Error: ${err.stack || err}. Stopping server...` );
        process.exit( 1 );
    }

    console.log( `Connected to database: ${mongodbConfig.dbName}` );
    // -------------------- 2. END --------------------------------------------------------

    // ------------------- 3. Start Http Server -------------------------------------------

    await new Promise( ( resolve, reject ) => {
        app.listen( httpServer.port, resolve );
    } );

    console.log( `Server is listening on port = ${httpServer.port}\n Go to: http://localhost:${httpServer.port}/aprIrrCalculatorApi\n` );

    // ---------------------------- 3. END -------------------------------------------------

})();