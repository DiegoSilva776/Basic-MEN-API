/**
 * This file is responsible for handling user authentication.
 * 
 * The auth controller makes use of an OAuth2 server that is going to handle 
 * requests with the 'bearer' security strategy, it means:
 * 
 *    1 - Creating an APIClient object
 *    2 - Requesting an authorization Code
 *    3 - Exchanging the authorization Code by an access Token
 *    4 - Validating the access Token on each request that needs authorization
 *        instead of using username and password on every request.
 * 
 * Observation:
 * 
 *    In order to get the access token, make a request to the API as follows with a valid client_id:
 *       https://cyclomize-server-diegosilva776.c9users.io/api/oauth2/authorize?client_id=this_is_my_id_2&response_type=code&redirect_uri=https://cyclomize-server-diegosilva776.c9users.io:27017
 * 
 *    and then allow the access.
 *    get the validation code
 *    and then get the access token:
 *       https://cyclomize-server-diegosilva776.c9users.io/api/oauth2/token
 *    
 */



// DEPENDENCIES
//-------------
var passport       = require('passport');
var basicStrategy  = require('passport-http').BasicStrategy;
var bearerStrategy = require('passport-http-bearer').Strategy

// load necessery models
var User   = require('../models/userModel');
var Client = require('../models/apiClientModel');
var Token  = require('../models/apiAccTokModel');


/**
 * Passport function that handles user authentication, it checks if the user 
 * with the username exist, if it does it checks the password and return the 
 * appropriate result.
 */
passport.use(new basicStrategy(
    function(username, password, callback) {
    
        User.findOne({ 
            email: username 
        }, function (err, user) {
            if(err){ 
                return callback(err); 
            }
    
            // no user found with that username
            if (!user){ 
                return callback(null, false); 
            }
        
            // make sure the password is correct
            user.verifyPassword(password, function(err, isMatch) {
                if(err){ 
                    return callback(err); 
                }
        
                // password did not match
                if(!isMatch){ 
                    return callback(null, false); 
                }
        
                // success
                return callback(null, user);
            });
        });
    }
));

// authorize authentication with username and password 'basic' and access token
exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { 
    session : false
});


/**
 * Checks if the user has a valid access token
 */
passport.use('client-basic', new basicStrategy(
    function(username, password, callback) {
        
        var query = {id: username};
        
        Client.findOne(query, function (err, client) {
            if(err){ 
                return callback(err); 
            }

            // no client found with that id or bad password
            if(!client || client.secret !== password) { 
                return callback(null, false); 
            }

            // success
            return callback(null, client);
        });
    }
));

exports.isClientAuthenticated = passport.authenticate('client-basic', { 
    session : false 
});


/**
 * Security strategy that allows the API client to authenticate by passing a 
 * valid OAuth access token. 
 */
passport.use(new bearerStrategy(
    function(accessToken, callback) {
        
        var query = {value: accessToken};
        
        Token.findOne(query, function(err, token) {
            if(err){ 
                return callback(err); 
            }

            // no token found
            if(!token){ 
                return callback(null, false); 
            }

            // find user of the access token
            query = {_id: token.userId};

            User.findOne(query, function(err, user) {
                if(err){ 
                    return callback(err); 
                }

                // no user found
                if(!user){ 
                    return callback(null, false); 
                }

                // simple example with no scope
                callback(null, user, { 
                    scope: '*' 
                });
            });
        });
    }
));

exports.isBearerAuthenticated = passport.authenticate('bearer', {
    session: false
});