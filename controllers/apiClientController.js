/**
 * An application client is what would request access to a user account.
 * 
 * The API Client controller is responsible for adding a client object that is
 * going to handle the authentication request proccess for the oauth2 security
 * protocol.
 */



// Load required packages
var Client = require('../models/apiClientModel');


// Create endpoint /api/client for POST
exports.postClients = function(req, res) {
    
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

        res.json({ 
            message: 'Client added to the client controller data!', data: client 
        });
    });
};

// Create endpoint /api/clients for GET
exports.getClients = function(req, res) {
    
    // Use the Client model to find all clients
    Client.find({ userId: req.user._id }, function(err, clients) {
    if (err)
        return res.send(err);

        res.json(clients);
    });
};