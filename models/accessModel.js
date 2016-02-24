/**
 * 
 */



// DEPENDENCIES
//-------------
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');



// MODEL DEFINITION
//-----------------
/**
 * Access
 */
var AccessSchema = new mongoose.Schema({
    owner : {
        type     : String,
        required : true
    },
    token : {
        type : String
    },
    createdAt : String,
    updatedAt : String,
    expiresAt : String
});



// MODEL BINDING
//--------------
// Exports Mongoose model to be used within the application
module.exports = mongoose.model('Access', AccessSchema);