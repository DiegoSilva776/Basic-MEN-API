/**
 * A Code object is created when the user insert valid authentication information. 
 * It is given to the apiController in exchange of an access token.
 */



// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var CodeSchema   = new mongoose.Schema({
    value: { // hash this guy
        type: String, 
        required: true 
    },
    redirectUri: { 
        type: String, 
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
module.exports = mongoose.model('Code', CodeSchema);