/**
 * This class provides methods to modify the structure of the server, by
 * performing for example DDL functions on the database
 */



// DEPENDENCIES
//-------------
var fs     = require('fs');
var crypto = require('crypto');

// models
var User   = require('../models/userModel');
var Client = require('../models/apiClientModel');
var Token  = require('../models/apiAccTokModel');



// Make everything within the curly braces acessible by other .js files in Node.js
module.exports = {

    /**
     * The DBManager prototype is responsible for dealing with DDL operations and 
     * other dabatase utilities.
     */
    DBManager : {
        
        // ATTRIBUTES
        DB_PORT : '27017',
        DB_NAME : 'basicRESTMEN_DB',
        
        
        // FUNCTIONS
        /**
         * Get the connection URL of the database
         */
        getConnectionURL : function(){
            return 'mongodb://' + process.env.IP +':'+ this.DB_PORT +'/'+ this.DB_NAME;  
        },
        
        
        /**
         * Delete all users from the database
         */
        dropUsers : function(){
            console.log('Removing all User objects from the database ...');
              
            User.remove({}, function(err) {
                if(!err){
                    console.log('collection removed')      
                }else{
                    console.log('There was an error removing the User collection');
                }
            }); 
        },
        
        
        /**
         * Delete all clients from the database
         */
        dropClients : function(){
            console.log('Removing all Client objects from the database ...');
              
            Client.remove({}, function(err) {
                if(!err){
                    console.log('collection removed')      
                }else{
                    console.log('There was an error removing the Client collection');
                }
            }); 
        },
        
        
        /**
         * Delete all clients' access tokens from the database
         */
        dropTokens : function(){
            console.log('Removing all Client access tokens objects from the database ...');
              
            Token.remove({}, function(err) {
                if(!err){
                    console.log('collection removed')      
                }else{
                    console.log('There was an error removing the Token collection');
                }
            }); 
        } 
    },
    


    /**
     * The methods within this model provide of interacting with local folders
     */
    Local : {
        
        // ATTRIBUTES
        APP_ROOT    : __dirname + '/..',
        STATIC_PATH : '/data/',
        TEMP_DIR    : '_tmp/',
        
        // FUNCTIONS
        /**
         * Deletes a temporary file
         */
        deleteTempFile : function (filename){
            fs.unlink(this.APP_ROOT + this.STATIC_PATH + this.TEMP_DIR + filename, function (err) {
                if(!err) {
                    console.log("Temporary file was deleted.");
                }else{
                    console.log("There was an error while the system was deleting the temporary file:\n"+err);
                }
            });
        }
    },
    
    
    /**
     * Return an unique identifier given its length
     */
    getUniqueId : function(len){
        var buf = [];
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charlen = chars.length;
        
        for (var i = 0; i < len; ++i) {
            buf.push(chars[this.getRandomInt(0, charlen - 1)]);
        }
        
        return buf.join('');
    },

    /**
     * Get a random integer between a range of numbers
     */
    getRandomInt : function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    
    /**
     * Get a hashed value based on a text plain input
     */
    getHashedValue : function(plainValue){
        return crypto
        .createHash("md5")
        .update(plainValue)
        .digest('hex');
    },
    
    
    /**
     * Get an object copy
     */
    getCopy : function(obj) {
        var copy = Object.assign({}, obj);
        return copy;
    }
};