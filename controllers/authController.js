/**
 * This file is responsible for handling user authentication.
 */



// DEPENDENCIES
//-------------
var passport      = require('passport');
var basicStrategy = require('passport-http').BasicStrategy;

// load necessery models
var User   = require('../models/userModel');
var Access = require('../models/accessModel');


/**
 * Passport function that handles user authentication, it checks if the user 
 * with the username exist, if it does it checks the password and return the 
 * appropriate result.
 */
passport.use(new basicStrategy(function(username, password, callback) {
    
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
}));

exports.isAuthenticated = passport.authenticate('basic', { 
    session : false
});


/**
 * Checks if the user has a valid access token
 */
exports.isTokenValid = function(accessToken, callback) {
    
    Access.findOne({ 
        token: accessToken 
    }, function (err, token) {
        if(err){ 
            return callback(err); 
        }

        // no user found with that username
        if (!token.owner){ 
            return callback(null, false); 
        }
            
        // get user who owns the token
        User.findOne({ 
            email: token.owner 
        }, function (err, user) {
            
            if(err){ 
                return callback(err); 
            }
        
            // no user found with that username
            if (!user){ 
                return callback(null, false); 
            }
            
            // success
            return callback(null, user);
        });
    });
}
