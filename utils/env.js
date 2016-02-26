/**
 * Define environment variables for the system, for example what the server IP
 * and in which port the service is going to run.
 */
    
    
// Make everything within the curly braces acessible by other .js files in Node.js
module.exports = {

    /**
     * Environment related attributes, the values defined below are standard 
     * values, please overwrite them on the 'INITIALIZATION' section of the 
     * main.js file.
     */
    vars : {
        IP   : "127.0.0.1",
        PORT : "3000"
    }
};