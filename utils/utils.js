/**
 * This class provides methods to modify the structure of the server, by
 * performing for example DDL functions on the database
 */



// DEPENDENCIES
//-------------
var User = require('../models/user');
var fs   = require('fs');



// Make everything within the curly braces acessible by other .js files in Node.js
module.exports = {


    /**
     * The DBManager prototype is responsible for dealing with DDL operations and 
     * other dabatase utilities.
     */
    DBManager : {
        
        // ATTRIBUTES
        DB_NAME : 'basicRESTMEN_DB',
        
        
        // FUNCTIONS
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
        APP_ROOT    : __dirname,
        STATIC_PATH : './data/bin/',
        
        
        // FUNCTIONS
        /**
         * Deletes a temporary file
         */
        deleteTempFile : function (filename){
            fs.unlink(filename, function (err) {
                if(!err) {
                    console.log("temporary file was deleted.");
                }else{
                    console.log("there was an error while the system was deleting the temporary file.");
                }
            });
        }
    }
};


    