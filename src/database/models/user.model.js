/**
 * User: bhagyashributada
 */


const
    mongoose = require( 'mongoose' ),
    userSchema = mongoose.Schema( {
        username: {type: String, required: true},
        password: {type: String, required: true, minLength: 6},
        token: {type: String, required: true}
    } ),
    userModel = mongoose.model( 'user', userSchema );

/**
 * @method PUBLIC
 *
 * This method queries the user using username and password
 *
 * @returns {Promise<mongoose document | null>}
 */
function getUserByCredential( userObj ) {
    let
        {username, password} = userObj;
    return userModel.findOne( {username, password} );
}

/**
 * @method PUBLIC
 *
 * This method queries the user, updates if exists else creates new user
 *
 * @returns {Promise<mongoose document | null>}
 */
function findUserAndUpdate( username, password, token ) {
    return userModel.findOneAndUpdate( {username, password, token: {$exists: true}}, {
        username,
        password,
        token
    }, {upsert: true, new: true} );
}

module.exports = {
    findUserAndUpdate,
    getUserByCredential
};