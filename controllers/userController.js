/**
 * This is a basic implementation of a User class
 */
 

// DEPENDENCIES
//-------------
var fs     = require('fs');
var multer = require('multer');
var utils  = require('../utils/utils.js');

// models
var User   = require('../models/userModel');



// FUNCTIONS
//----------
/**
 * Adds a user or a list of users
 */
exports.createUsers = function (req, res) {
    console.log('\nPOST request to create a new user: ');

    var date = new Date(); 

    // create a new user without a profile picture, the password field is hashed
    // within a model method called just the before the 'save' event.
    var user = new User({
        email      : req.query.email,
        name       : req.query.name,
        password   : req.query.password,
        facebookId : req.query.facebookId,
        profilePic : null,
        createdAt  : date.toISOString(),
        updatedAt  : date.toISOString()
    });
    
    console.log("created user: \n"+ user);
    
    // save the user into the database
    user.save(function(err){
        if(!err){
            return res.send('Created user with email ' + req.query.email);
        }else{
            res.send(err);
        }
    })
};

/**
 * Get a list of all the users from the database
 */
exports.getUsers = function (req, res) {
    console.log('GET request for all users ...');
    
    return User.find(function (err, users) {
        if (!err) {
            
            // remove the password field from the users
            for (var i in users) {
                var user = users[i];
                user.password = "Sorry we can't show you this field :(";
                users[i] = user;
            }
            
            return res.send(users);
        } else {
            return res.send(err);
        }
    });
};

/**
 * Get the user that the specified id from the database or return null
 */
exports.getUser = function (req, res) {
    console.log('\nTrying to get user with id '+ req.params.id);
    
    return User.find({'email':req.params.id}).exec(function (err, user) {
        if (!err) {
            return res.send(user);
        } else {
            return res.send(err);
        }
    });
};

/**
 * Updates the information of the user whom has the specified id.
 */
exports.updateUser = function (req, res) {
    console.log('PUT request to update the user with the id ' + req.params.id);
    
    var query = {'email' : req.params.id};
    var date = new Date(); 
     
    User.findOne(query, function (err, user){
        if(!err && user != null){
            user.email      = req.params.id;
            user.name       = req.query.name;
            user.facebookId = req.query.facebookId;  
            user.updatedAt  = date.toISOString();
            
            user.save();
            res.end("User updated");
        }else{
            res.end("There was an error to update the user with email " + req.params.id);
        }
    });
};

/**
 * Deletes an user
 */
exports.deleteUser = function (req, res) {
    console.log('\nDELETE request to the user with email ' + req.params.id);
    
    var query = {'email' : req.params.id};
    
    return User.findOne(query, function (err, user) {
        if(!err && user != null){
            return user.remove(function (err) {
                if (!err) {
                    console.log("Removed user with id "+ req.params.id);
                    return res.send("Removed user with id "+ req.params.id);
                } else {
                    return res.send(err);
                }
            });
        }else{
            if(err){
                res.send(err);
            }else{
                return res.send("The user with email " + req.params.id + " doesn't exist.");
            }
        }
    });
};


// Non CRUD functions
/*
 * Uploads profile picture
 * 
 * This method gets the file with multer middleware and save it on a temporary 
 * file, then we search on the database for a user with the given id (email),
 * if there is an user with the given id the profile picture attribute of this
 * user is updated, otherwise the temporary file is deleted and an error is thrown.
 */
 exports.updateProfPic = function(req, res){
    console.log("PUT request, trying to upload a file for the user " + req.params.id + " ...");
    
    // get the user id to use it as the base for the temporary filename
    var filename = req.params.id + "-profpic.png";
    
    // creates a storage function variable to save the file from locally    
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            console.log("file location: " + utils.Local.APP_ROOT + utils.Local.STATIC_PATH + utils.Local.TEMP_DIR)
            callback(null, utils.Local.APP_ROOT + utils.Local.STATIC_PATH + utils.Local.TEMP_DIR);
        },
        filename: function (req, file, callback) {
            console.log("saving file: "+ filename);
            callback(null,  filename);
        }
    });

    var upload = multer({ storage : storage}).single('userPhoto');
    
    // call the upload function used by Multer to save the file temporarily locally
    upload(req, res, function(err) {
        if(err){
            res.send("Error uploading file.");
        }else{
            var query = {'email':req.params.id};
            
            // check if the user with the given id(email) exists
            User.findOne(query, function (err, user) {
                if(!err && user != null){
                    
                    // read file from temp directory
                    fs.readFile(utils.Local.APP_ROOT + utils.Local.STATIC_PATH + utils.Local.TEMP_DIR + filename, function (dataErr, data) {
                        if(!dataErr && data != null) {
                            user.profilePic = data;  
                            
                            // updates the user profile picture
                            user.save();
                        }else{
                            res.end("Error, the operation couldn't be completed");
                        }
                        
                        utils.Local.deleteTempFile(filename);
                    });
                }else{
                    res.end("User with email " + req.query.id + " wasn't found.")
                    utils.Local.deleteTempFile(utils.Local.STATIC_PATH + filename);
                }
            });
            
            res.end('Your file was uploaded');
        }
    });
};


/**
 * Log the user in
 */
exports.loginUser = function(req, res){
    console.log("Basic security check was valid, starting OAuth2 ...");
    
    res.end("Return accessToken to make next requests token:#asdçfkasjer23çrKSDJFÇSLD ...");
}