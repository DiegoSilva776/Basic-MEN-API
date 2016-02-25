/**
 * An AccessToken is given back to the API client, once a valid code is passed 
 * in. With an access token, an application client is able to make a request on 
 * behalf of the user.
 */



// Load required packages
var mongoose = require('mongoose');



// Define our token schema
var TokenSchema   = new mongoose.Schema({
    value: {
        type: String, // hashed value
        required: true
    },
    userId: { 
        type: String, 
        required: true
    },
    clientId: { 
        type: String, 
        required: true
    }
});



// Export the Mongoose model
module.exports = mongoose.model('Token', TokenSchema);