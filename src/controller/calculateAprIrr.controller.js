/**
 * User: bhagyashributada
 */


function sendWelcomeMessage( req, res ) {

    const
        welcomeMsg = {
            message: `<b>Hello,</b> Welcome to APR & IRR Calculator`,
            toGetJwtToken: `<host>/mortgageCalculation/requestAuthToken`,
            toCalculateAprAndIrr: `<host>/mortgageCalculation/getAprIrrValues`
        };
    res.json( welcomeMsg );
}

function getValuesFromJSON( cashFlowObj ) {
    return {principal, upfrontFee, upfrontCreditlineFee, schedule} = cashFlowObj;
}

function getTotalFeesPaid( cashFlowObj ) {
    let
        {principal, upfrontFee, upfrontCreditlineFee, schedule} = cashFlowObj,
        totalFeesPaid = upfrontFee.value ? upfrontFee.value : 0 + upfrontCreditlineFee.value ? upfrontCreditlineFee.value : 0;

    return {principal, totalFeesPaid, schedule};
}

function getTotalScheduledPayments( cashFlowObj ) {

    let
        {principal, totalFeesPaid, schedule} = cashFlowObj,
        totalScheduledPayments = schedule.reduce( ( acc, o ) => acc + o.interestFee + o.principal, 0 );

    return {principal, totalFeesPaid, totalScheduledPayments, schedule};
}

function getTotalFeesAndScheduledPayments( cashFlowObj ) {

    let
        {principal, totalFeesPaid, totalScheduledPayments, schedule} = cashFlowObj,
        totalCashInFlow = totalFeesPaid + totalScheduledPayments;

    return {principal, totalFeesPaid, totalCashInFlow, schedule};
}

function getTotalCashInFlowByPrincipal( cashFlowObj ) {

    let
        {principal, totalFeesPaid, totalCashInFlow, schedule} = cashFlowObj,
        totalCashInFlowByPrincipal = totalCashInFlow / principal;

    return {principal, totalFeesPaid, totalCashInFlowByPrincipal, schedule};
}

function getTotalCashInFlowPerDay( cashFlowObj ) {

    let
        {principal, totalFeesPaid, totalCashInFlowByPrincipal, schedule} = cashFlowObj,
        noOfDays = Math.ceil( (schedule.length / 12) * 365 ),
        totalCashInFlowPerDay = totalCashInFlowByPrincipal / noOfDays;

    return {principal, totalFeesPaid, totalCashInFlowPerDay, schedule};
}

function getAPR( cashFlowObj ) {

    let
        {principal, totalFeesPaid, totalCashInFlowPerDay, schedule} = cashFlowObj,
        apr = ((totalCashInFlowPerDay * 365) - 1) * 100;

    return {principal, totalFeesPaid, apr, schedule};
}

function getIRR( cashFlowObj ) {

    let
        {principal, totalFeesPaid, apr, schedule} = cashFlowObj,
        Finance = require( 'financejs' ),
        financeObj = new Finance(),
        cashFlows = schedule.map( o => o.interestFee + o.principal ),
        irr = financeObj.IRR( -(principal - totalFeesPaid), ...cashFlows ) / 100;

    return {apr: apr.toFixed( 2 ), irr: irr.toFixed( 10 )};

}

/**
 * Formula used APR = ((Fees+Interest)/Principal*n)*365*100
 * {@link https://www.investopedia.com/terms/a/apr.asp}
 */

function calculateAprIrrValues( req, res ) {

    const pipeline = ( ...fns ) => ( jsonObj ) => fns.reduce( ( acc, fn ) => {
        return fn( acc );
    }, jsonObj );

    try {
        const aprIrrPipeline = pipeline(
            getValuesFromJSON,
            getTotalFeesPaid,
            getTotalScheduledPayments,
            getTotalFeesAndScheduledPayments,
            getTotalCashInFlowByPrincipal,
            getTotalCashInFlowPerDay,
            getAPR,
            getIRR
        )( req.body );

        res.json( aprIrrPipeline );

    } catch( error ) {

        return res.status( 500 ).send( `Error occurred while calculating APR & IRR : ${error}` );
    }

}

module.exports = {
    sendWelcomeMessage,
    calculateAprIrrValues
};


