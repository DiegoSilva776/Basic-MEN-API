/**
 * The API client is responsible for handling the request for an access code
 * which is exchanged by an access token.
 */



// Load required packages
var mongoose = require('mongoose');

// Define our client schema
var ClientSchema = new mongoose.Schema({
    name: { 
        type: String, 
        unique: true, 
        required: true 
    },
    id: { 
        type: String, 
        required: true 
    },
    secret: { // hash this guy
        type: String, 
        required: true 
    },
    userId: { 
        type: String, 
        required: true 
    }
});

// Export the Mongoose model
module.exports = mongoose.model('Client', ClientSchema);