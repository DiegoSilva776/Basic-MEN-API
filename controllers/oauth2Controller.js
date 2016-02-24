/**
 * When a client redirects a user to user authorization endpoint, an 
 * authorization transaction is initiated. To complete the transaction, the user 
 * must authenticate and approve the authorization request. Because this may 
 * involve multiple HTTP request/response exchanges, the transaction is stored 
 * in the session.
 */



// DEPENDENCIES
//-------------
var oauth2orize    = require('oauth2orize');
var Utils = require('../utils/utils.js');

// load the models used for authentication
var User   = require('../models/userModel');
var Client = require('../models/apiClientModel');
var Token  = require('../models/apiCodeModel');
var Code   = require('../models/apiAccTokModel');



// INITIALIZATION
//---------------
// create OAuth 2.0 server
var server = oauth2orize.createServer();



// FUNCTIONS
//----------
/**
 * Register serialialization function
 */
server.serializeClient(
    function(client, callback){
        return callback(null, client._id);
    }
);

/**
 * Register deserialization function
 */
server.deserializeClient(
    function(id, callback){
        var query =  {_id: id};
        
        Client.findOne(query, function (err, client){
            if(err){ 
                return callback(err);
            }
            
            return callback(null, client);
        });
    }
);

/**
 * Register authorization code grant type
 * 
 * OAuth 2.0 specifies a framework that allows users to grant client applications 
 * limited access to their protected resources. It does this through a process 
 * of the user granting access, and the client exchanging the grant for an 
 * access token.
 * 
 * We are registering here for an authorization code grant type. We create a new 
 * authorization code model for the user and application client. It is then 
 * stored in MongoDB so we can access it later when exchanging for an access token.
 */
server.grant(oauth2orize.grant.code(
    function(client, redirectUri, user, ares, callback) {
    
        // Create a new authorization code
        var code = new Code({
            value       : Utils.getUniqueId(16),
            clientId    : client._id,
            redirectUri : redirectUri,
            userId      : user._id
        });
    
        // Save the auth code and check for errors
        code.save(function(err) {
            if(err){ 
                return callback(err); 
            }
    
            callback(null, code.value);
        });
    }
));

/**
 * Exchanges an authorization code given to the API's client for an access token
 */
server.exchange(oauth2orize.exchange.code(
    function(client, code, redirectUri, callback){
    
        // search the authorization code sent by the API's client
        var query = {value: code};
    
        Code.findOne(query, function (err, authCode){
            if(err){ 
                return callback(err); 
            }
            
            if(authCode === undefined){ 
                return callback(null, false); 
            }
            
            if(client._id.toString() !== authCode.clientId){ 
                return callback(null, false); 
            }
            
            if(redirectUri !== authCode.redirectUri){ 
                return callback(null, false); 
            }
        
            // delete auth code now that it has been used
            authCode.remove(function (err){
                if(err){ 
                    return callback(err); 
                }
        
                // create a new access token
                var token = new Token({
                    value    : Utils.getUniqueId(16)(256),
                    clientId : authCode.clientId,
                    userId   : authCode.userId
                });
        
                // Save the access token and check for errors
                token.save(function (err){
                    if(err){ 
                        return callback(err); 
                    }
        
                    // return access token to an API's client 
                    callback(null, token);
                });
            });
        });
    }
));

/**
 * User authorization endpoint.
 * 
 * Initializes a new authorization transaction. It finds the client requesting 
 * access to the user’s account and then renders the dialog ejs view used for
 * authentication.
 */ 
exports.authorization = [
    server.authorization(
        function(clientId, redirectUri, callback){
            
            var query = {id: clientId};

            Client.findOne(query, function (err, client){
                if(err){ 
                    return callback(err); 
                }
        
                return callback(null, client, redirectUri);
            });
        }
    ),
    function(req, res){
        res.render('authentication', { 
            transactionID : req.oauth2.transactionID, 
            user          : req.user, 
            client        : req.oauth2.client 
        });
    }
]

/**
 * User decision endpoint
 * 
 * This endpoint is setup to handle when the user either grants or denies access 
 * to their account to the requesting application client.
 * 
 * The server.decision() function handles the data submitted by the post and 
 * will call the server.grant(), if the user granted access.
 */
exports.decision = [
  server.decision()
]

/**
 * Application client token exchange endpoint
 * 
 * This endpoint is setup to handle the request made by the application client 
 * after they have been granted an authorization code by the user.
 */
exports.token = [
    server.token(),
    server.errorHandler()
]