/**
 * An application client is what would request access to a user account.
 * 
 * The API Client controller is responsible for adding a client object that is
 * going to handle the authentication request proccess for the oauth2 security
 * protocol.
 */



// Load required packages
var Utils = require('../utils/utils.js');

// models
var User   = require('../models/userModel');
var Client = require('../models/apiClientModel');
var Token  = require('../models/apiAccTokModel');



// Create endpoint /api/client for POST
exports.postClients = function(req, res) {
    console.log("Trying to create a new API client ...");
    
    // Create a new instance of the Client model
    var client = new Client();

    // Set the client properties that came from the POST data
    client.name   = req.body.name;
    client.id     = req.body.id;
    client.secret = req.body.secret;
    client.userId = req.user._id;

    // Save the client and check for errors
    client.save(function(err) {
        if (err)
            return res.send(err);

        console.log("Client was created, creating access token for client with id "+client.id);
        console.log(Utils.getUniqueId(256)+'\n');
        console.log(req.user._id+'\n');
        console.log(client.clientId);

        // create a new access token
        var token = new Token({
            value    : Utils.getUniqueId(256),
            userId   : req.user._id,
            clientId : req.user._id +' '+ req.body.id
        });
        
        // save the access token and check for errors
        token.save(function (err){
            if(err){ 
                return res.send(err);
            }
        
            console.log("Returning access token for client");
            res.json({ 
                message: 'This is your access token, be careful with it!', 
                token: token
            });
        });
    });
};


/**
 * Endpoint used to delete a client when the api user, logout or sign out.
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