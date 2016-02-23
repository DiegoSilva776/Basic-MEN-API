/**
 * This class provides methods to modify the structure of the server, by
 * performing for example DDL functions on the database
 */



// DEPENDENCIES
//-------------
var User = require('../models/userModel');
var fs   = require('fs');



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
    }
};