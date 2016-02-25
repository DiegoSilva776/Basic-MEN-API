/**
 * An application client is what would request access to a user account.
 * 
 * The API Client controller is responsible for adding a client object that is
 * going to handle the authentication request proccess. A client has an unique
 * access token that also validates a request, once it passes the test of the 
 * second basic security strategy 'Bearer'.
 */



// DEPENDENCIES
//-------------
// load required packages
var Utils = require('../utils/utils.js');

// models
var User   = require('../models/userModel');
var Client = require('../models/apiClientModel');
var Token  = require('../models/apiTokenModel');



// FUNCTIONS
//----------
/**
 * Create a new api Client object, a client is responsible for making request
 * to the API and requesting access to the users data.
 */ 
exports.postClients = function(req, res) {
    console.log("Trying to create a new API Client ...");
    
    // create a new instance of the Client model
    var client = new Client();

    // set the client properties that came from the POST data
    client.name   = req.body.name;
    client.id     = req.body.id;
    client.secret = Utils.getHashedValue(req.body.secret);
    client.userId = req.user._id;

    // save the client and check for errors
    client.save(function(err) {
        if (err)
            return res.send(err);

        console.log("Client was created, creating access token for client with id "+client.id);
        
        var tokenValue = Utils.getUniqueId(256);
        var tokenHashValue = Utils.getHashedValue(tokenValue);
        
        // set the expiration date to 15 days from the creation date
        var date = new Date();
        var newdate = new Date(date);
        newdate.setDate(newdate.getDate() + 15); 
        var nd = new Date(newdate);
        
        // create a new access token
        var token = new Token({
            value      : tokenHashValue,
            userId     : req.user._id,
            clientId   : req.user._id +' '+ req.body.id,
            createdAt  : date.toISOString(),
            expirestAt : nd.toISOString()
        });
        
        // save the access token and check for errors
        token.save(function (err){
            if(err){ 
                return res.send(err);
            }
        
            token.value = tokenValue;
            
            console.log("Returning access token for client: \n"+ token);
            res.json({ 
                message: 'This is your access token, be careful with it!', 
                token: token
            });
        });
    });
};


/**
 * Endpoint used to delete a Client when an API user logs out or signs out.
 */
exports.deleteClient = function(req, res) {
    
    var query = {userId: req.user._id};
    
    Client.remove(query, function(err) {
        if(!err){
            
            // delete access token that belongs to the deleted Client
            Token.remove(query, function(err) {
                if(!err){
                    res.json({ 
                        opStatus: true,
                        message: 'Deleted client access token'
                    });
                }else{
                    res.json({ 
                        opStatus: false,
                        message: 'There was an error deleting the client access token'
                    });
                }
            });
        }else{
            console.log('There was an error removing the User collection');
        }
    });
};

/**
 * Endpoint used to delete a Client by its accessToken
 */
exports.deleteClientByAccessToken = function(token) {
    
    var query = {userId: token.clientId};
    
    Client.remove(query, function(err) {
        if(!err){
            
            // delete access token that belongs to the deleted Client
            Token.remove(query, function(err) {
                if(!err){
                    return false;
                }else{
                    return true;
                }
            });
        }else{
            console.log('There was an error removing the User collection');
        }
    });
};