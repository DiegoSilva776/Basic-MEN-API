/**
 * This is the RESTful API for a basic cross-platform app.
 * 
 * Guidelines used on this API:
 *    - Keep verbs out of the base URLs
 *    - HTTP verbs are POST, GET, PUT, and DELETE ([Create, Read, Update, Delete][CRUD])
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
 * Last updated: 02/23/2016 
 */



// DEPENDENCIES
//-------------
// external depencies
var express        = require('express');
var path           = require("path");
var bodyParser     = require('body-parser');
var multer         = require('multer');
var methodOverride = require('method-override');
var errorhandler   = require('errorhandler')
var fs             = require('fs');
var mongoose       = require('mongoose');
var utils          = require('./utils/utils.js');

// load your business models "classes" bonded to MongoDB via Mongoose 
var User = require('./models/user');



// INITIALIZATION
//---------------
console.log('Initializing system ...');

// create an instance of the webserver object
var app = express();

// setup the HTTP document body parser, to get data formated as urlencoded and json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// initializes a router object with the current express router
var router = express.Router();

// creates a path to allow access to static files
express.static(path.join(utils.Local.APP_ROOT, utils.Local.STATIC_PATH));

// configures MongoDB and attach Mongoose to it
var url = 'mongodb://' + process.env.IP + ':27017/' + utils.DBManager.DB_NAME;
mongoose.connect(url);



// ROUTING
//--------
var usersRoute           = router.route('/users');
var userRoute            = router.route('/users/:id');
var userUptPassRoute     = router.route('/users_updt_pass');
var userUpdtProfPicRoute = router.route('/users_updt_profpic');

// register the declared routes
app.use('/api', router); 



// ROUTES && BUSINESS FUNCTIONS
//-----------------------------
/**
 * Just a hello message to the API users
 */
router.get('/', function(req,res){
    res.json({message: 'Welcome to the BasicRESMEN API (; to get access to the API paths use "serverAddress/api/path"'});
});

/**
 * Adds an user or a list of users
 */
usersRoute.post(function (req, res) {
    console.log('\nPOST request to create a new user: ');

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
 * Get a list of all the users from the database
 */
usersRoute.get(function (req, res) {
    console.log('GET request for all users ...');
    
    return User.find(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return res.send(err);
        }
    });
});

/**
 * Updates the information of the user whom has the specified id.
 */
userRoute.put(function (req, res) {
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
userUptPassRoute.post(function (req, res) {
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
 * 
 * This method gets the file with multer middleware and save it on a temporary 
 * file, then we search on the database for a user with the given id (email),
 * if there is an user with the given id the profile picture attribute of this
 * user is updated, otherwise the temporary file is deleted and an error is thrown.
 */
 userUpdtProfPicRoute.post(function(req, res){
    console.log("POST request, trying to upload a file for the user " + req.query.email + " ...");
    
    // get the user id to use it as the base for the temporary filename
    var filename = req.query.email + "-profpic.png";
    
    // creates a storage function variable to save the file from locally    
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, utils.Local.STATIC_PATH);
        },
        filename: function (req, file, callback) {
            console.log("saving file: "+ filename);
            callback(null,  filename);
        }
    });

    var upload = multer({ storage : storage}).single('userPhoto');
    
    // call the upload function used by Multer to save the file temporarily locally
    upload(req, res, function(err) {
        if(err) {
            res.send("Error uploading file.");
        }else{
            var query = {'email':req.query.email};
            
            // check if the user with the given id(email) exists
            User.findOne(query, function (err, user) {
                if(!err && user != null){
                    
                    // read file from temp directory
                    fs.readFile(utils.Local.STATIC_PATH + filename, function (dataErr, data) {
                        if(!dataErr && data != null) {
                            user.profilePic = data;  
                            
                            // updates the user profile picture
                            user.save();
                        }else{
                            res.end("Error, the operation couldn't be completed");
                        }
                        
                        utils.Local.deleteTempFile(utils.Local.STATIC_PATH + filename);
                    });
                }else{
                    res.end("User with email " + req.query.email + " wasn't found.")
                    utils.Local.deleteTempFile(utils.Local.STATIC_PATH + filename);
                }
            });
            
            res.end('Your file was uploaded');
        }
    });
});

/**
 * Get the user that the specified id from the database or return null
 */
userRoute.get(function (req, res) {
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
 * Deletes an user
 */
userRoute.delete(function (req, res) {
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
    var host = server.address().address;
    var port = server.address().port;

    console.log("OurMemex API listening at http://%s:%s", host, port);
    
    
    // ATTENTION RUNNING DDL METHODS!
    //-------------------------------
    // utils.DBManager.dropUsers();
});