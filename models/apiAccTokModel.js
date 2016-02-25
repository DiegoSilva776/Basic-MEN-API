/**
 * An AccessToken is given back to the API client, once a valid code is passed 
 * in. With an access token, an application client is able to make a request on 
 * behalf of the user.
 */


// DEPENDENCIES
//-------------
// Load required packages
var mongoose = require('mongoose');



// MODEL DEFINITION
//-----------------
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
    },
    createdAt  : {
        type: String, 
        required: true
    },
    expirestAt : {
        type: String,
        required: true
    }
});


/**
 * Validate the user password with the hash that is currently stored.
 */
TokenSchema.methods.hasExpired = function() {
    console.log("Checking if the access token has expired.");
    
    var expirationDate = new Date(this.expirestAt - 20);
    var date = new Date();
    
    console.log("expiration date: "+expirationDate);
    console.log("current date: "+date);
    
    if(expirationDate.getMilliseconds() >= date.getMilliseconds()){
        console.log("expired");
        return true;    
    }else{
        console.log("not expired");
        return false;
    }
};


// Export the Mongoose model
module.exports = mongoose.model('Token', TokenSchema);