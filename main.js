/**
 * This is the RESTful API for the Cyclomize cross-platform app.
 * 
 * Guidelines using on this API:
 *    - Keep verbs out of the base URLs
 *    - HTTP verbs are POST, GET, PUT, and DELETE ([Create, Read, Update, Delete][crud])
 *    - Concrete names are better than abstract
 * 
 *    Ex:
 *      post   -> /trails      = create a new trail
 *      post   -> /trails/1234 = error
 *      get    -> /trails      = get all trails
 *      get    -> /trails/1234 = show 1234
 *      put    -> /trails      = bulk update of trails
 *      put    -> /trails/1234 = if exists update 1234, else error
 *      delete -> /trails      = delete all trails
 *      delete -> /trails/1234 = delete 1234
 * 
 * Author: Diego M. Silva
 * Created at: 02/19/2016
 * Last updated: 02/20/2016 
 */


// DEPENDENCIES
//-------------
var express          = require('express');
var path             = require("path");
var bodyParser       = require('body-parser');
var multer           = require('multer');
var methodOverride   = require('method-override')
var router           = require('router');
var errorhandler     = require('errorhandler')
var fs               = require('fs');
var mongoose         = require('mongoose');



// LOCAL PATHS
//------------
var APP_ROOT    = __dirname;
var STATIC_PATH = './data/bin';



// INITIALIZATION
//---------------
console.log('Initializing system ...');

// Create an instance of the webserver object
var app = express();

// DB configuration
var url    = 'mongodb://' + process.env.IP + ':27017/cyclomizeapi';
var schema = mongoose.Schema;

// setup Multer - middleware storage manager for multi-part data (file upload)
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, STATIC_PATH);
    },
    filename: function (req, file, callback) {
        console.log(req);
        
        var filename = STATIC_PATH + req.body.email + ".png";
        callback(null, filename);
    }
});

var upload = multer({ storage : storage}).single('userPhoto');

// create a path to allow access to static files
express.static(path.join(APP_ROOT, STATIC_PATH));
  
// connect the mongoose framework to the created database
mongoose.connect(url);

// setup the HTTP document body parser, to get data formated as urlencoded and json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// SCHEMAS AND MODELS - DDL
//-------------------------

/**
 * User
 * Create a model based on the User schema, a model is the actual class based 
 * upon a database schema. A model = a type of document.
 */
var UserSchema = new schema({
    email      : {type:String, required:true},
    name       : String,
    facebookId : String,
    profilePic : Buffer,
    createdAt  : String,
    updatedAt  : String
});
var User = mongoose.model('User', UserSchema);



/**
 * Remove all objects - documents from a collection - model in the DB. 
 */
function dropDatabase(){
    console.log('Removing all User objects from the database ...');
    
    User.remove({}, function(err) {
        if(!err){
            console.log('collection removed')      
        }else{
            console.log('There was an error removing the User collection');
        }
    });
}




// DATA MANIPULATION METHODS - DML
//--------------------------------




// BUSINESS METHODS - PATHS
//-------------------------

/**
 * Get a list of all the users from the database
 */
app.get('/users', function (req, res) {
    return User.find(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return res.send(err);
        }
    });
});

/**
 * Get the user that the specified id from the database or return null
 */
app.get('/users/:id', function (req, res) {
    console.log('\nTrying to get user with id '+ req.params.id);
    
    return User.find({'email':req.params.id}).exec(function (err, user) {
        if (!err) {
            return res.send(user);
        } else {
            return res.send(err);
        }
    });
});

/**
 * Adds an user or a list of users
 */
app.post('/users', function (req, res) {
    console.log('\nPOST request to create a new user: ');
    console.log(req.query);
    
    // create a new user without a profile picture
    var user = new User({
        email      : req.query.email,
        name       : req.query.name,
        pass       : req.query.pass,
        facebookId : req.query.facebookId,
        profilePic : null,
        createdAt  : Date.now().toString(),
        updatedAt  : Date.now().toString()
    });
    
    // save the user into the database
    user.save(function(err){
        if(!err){
            return res.send('Created user with email ' + req.query.email);
        }else{
            res.send(err);
        }
    })
});

/**
 * Updates the information of the user whom has the specified id.
 */
app.put('/users/:id', function (req, res) {
    console.log('PUT request to update the user with the id ' + req.params.id);
    
    var query = {'email' : req.params.id};
     
    User.findOne(query, function (err, user){
        if(!err && user != null){
            user.email      = req.params.id;
            user.name       = req.query.name;
            user.facebookId = req.query.facebookId;  
            user.updatedAt  = Date.now().toString();
            
            user.save();
            res.end("User updated");
        }else{
            res.end("There was an error to update the user with email " + req.params.id);
        }
    });
});

/**
 * Updates user password
 */
app.post('/users_updt_pass', function (req, res) {
    console.log('POST request to update the password of the user with the id ' + req.query.email);
    
    var query = {'email' : req.query.email};
     
    User.findOne(query, function (err, user){
        if(!err && user != null){
            user.pass       = req.query.pass;
            user.updatedAt  = Date.now().toString();
            
            user.save();
            res.end("User password was updated");
        }else{
            res.end("There was an error to update the password of the user with email " + req.query.email);
        }
    });
});

/**
 * Uploads profile picture 
 */
app.post('/users_updt_profimg', function(req, res){
    console.log("Trying to upload a file ...");
    
    // call the upload function used by Multer to save the file temporarily locally
    upload(req, res, function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }else{
            var query = {'email':req.body.email};
            console.log(query);
            
            User.find(query, function (err, user) {
                if(!err){
                    
                    var filename = STATIC_PATH + req.body.email + ".png";
                    
                    // read file from temp directory
                    fs.readFile(filename, function (dataErr, data) {
                        if(data) {
                            user.photo ='';
                                
                            // assigns the image to the path.
                            user.photo = data;  
                            user.save(function (saveErr, saveUser) {
                                if (saveErr) {
                                    throw saveErr;
                                }
                                res.end("saved image");
                            });
                        }
                    });
                }
            });
            
            res.send("File was uploaded");        
        }
    });
});


/**
 * Deletes an user
 */
app.delete('/users/:id', function (req, res) {
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
});



// SERVER
//-------
var server = app.listen(process.env.PORT, process.env.IP, function () {

    // boot up the server
    var host = server.address().address
    var port = server.address().port

    console.log("OurMemex API listening at http://%s:%s", host, port)
    
    
    // ATTENTION RUNNING DDL METHODS!
    //-------------------------------
    // dropDatabase();
});