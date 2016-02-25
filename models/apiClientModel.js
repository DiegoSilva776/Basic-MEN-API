/**
 * The API client is responsible for handling a request from a client of the 
 * API, requesting an access code, and exchanging the access code for an access
 * token, that token can then be used on every request that has the 'bearer' 
 * authentication method implemented.
 */


// DEPENDENCIES
//-------------
// Load required packages
var mongoose = require('mongoose');



// MODEL DEFINITION
//-----------------
// Define our client schema
var ClientSchema = new mongoose.Schema({
    name: { 
        type: String,
        unique: false,
        required: true
    },
    id: { 
        type: String, 
        required: true 
    },
    secret: { // hashed value
        type: String,
        required: true 
    },
    userId: { // the user who owns the application client
        type: String, 
        required: true 
    }
});



// Export the Mongoose model
module.exports = mongoose.model('Client', ClientSchema);