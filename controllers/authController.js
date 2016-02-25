/**
 * This file is responsible for handling user authentication.
 */



// DEPENDENCIES
//-------------
var passport         = require('passport');
var basicStrategy    = require('passport-http').BasicStrategy;
var bearerStrategy   = require('passport-http-bearer').Strategy
var utils            = require('../utils/utils.js');
var clientController = require('../controllers/apiClientController'); 


// load necessery models
var User   = require('../models/userModel');
var Client = require('../models/apiClientModel');
var Token  = require('../models/apiTokenModel');


/**
 * Passport function that handles user authentication, it checks if the user 
 * with the username exist, if it does, checks the password and return the 
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
        
            // password is hashed within the model
            user.verifyPassword(password, function(err, isMatch) {
                if(err){ 
                    return callback(err); 
                }
        
                // password did not match
                if(!isMatch){ 
                    return callback(null, false); 
                }
        
                console.log("user password matches the stored one");
        
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
 * Security strategy that allows the API client to authenticate by passing a 
 * valid OAuth access token. 
 */
passport.use(new bearerStrategy(
    function(accessToken, callback) {
        
        var query = {value: utils.getHashedValue(accessToken)};
        
        Token.findOne(query, function(err, token) {
            if(err){ 
                return callback(err); 
            }

            // no token found
            if(!token){ 
                return callback(null, false); 
            }

            // check if the token has expired, if yes deletes token and its owner (Client), otherwise allow access
            if(token.hasExpired()){
                clientController.deleteClientByAccessToken(token);
                
                return callback(null, false); 
            }else{
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
            }
        });
    }
));

exports.isBearerAuthenticated = passport.authenticate('bearer', {
    session: false
});