/**
 * This model holds the core information of a tutorial (Memex).
 * 
 * A Mongoose.Schema, maps the schema of the model to a collection on MongoDB.
 * The exports command make the model usable within the application.
 */


// Imports
var mongoose = require('mongoose');

/**
 * User.
 * 
 * Creates a model based on the User schema, a model is the actual class based 
 * upon a database schema. A model is equal to a type of document.
 */
var UserSchema = new mongoose.Schema({
    email      : {type:String, required:true},
    name       : String,
    facebookId : String,
    createdAt  : String,
    updatedAt  : String,
    profilePic : Buffer
});

// exports the Mongoose model to the used within the application
module.exports = mongoose.model('User', UserSchema);