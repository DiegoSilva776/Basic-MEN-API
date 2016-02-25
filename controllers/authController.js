/**
 * This file is responsible for handling user authentication.
 */



// DEPENDENCIES
//-------------
var passport       = require('passport');
var basicStrategy  = require('passport-http').BasicStrategy;
var bearerStrategy = require('passport-http-bearer').Strategy
var utils          = require('../utils/utils.js');

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
        
            password = utils.getHashedValue(password);
            user.verifyPassword(password, function(err, isMatch) {
                if(err){ 
                    return callback(err); 
                }
        
                // password did not match
                if(!isMatch){ 
                    return callback(null, false); 
                }
        
                console.log("password matches the stored one");
        
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
 * 
 * 
 */
passport.use('client-basic', new basicStrategy(
    function(username, password, callback) {
        
        var query = {id: username};
        
        Client.findOne(query, function (err, client) {
            if(err){ 
                return callback(err); 
            }

            // no client found with that id or bad password
            if(!client || utils.getHashedValue(client.secret) !== password) { 
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
        
        var query = {value: utils.getHashedValue(accessToken)};
        
        Token.findOne(query, function(err, token) {
            if(err){ 
                return callback(err); 
            }

            // no token found
            if(!token){ 
                return callback(null, false); 
            }

            // >>>>>> TO DO
            // check if the token has expired, if yes deletes token and its owner (Client), otherwise allow access
            if(false){
                 
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