/**
 * This is the RESTful API for a basic cross-platform app.
 * 
 * Guidelines used on this API:
 *    - Keep verbs out of the base URLs
 *    - HTTP verbs are POST, GET, PUT, and DELETE ([Create, Read, Update, Delete][CRUD])
 *    - Concrete names are better than abstract
 * 
 *    Ex:
 *      post   -> /users      = create a new users
 *      post   -> /users/1234 = error
 *      get    -> /users      = get all users
 *      get    -> /users/1234 = show user with id 1234
 *      put    -> /users      = bulk update of users
 *      put    -> /users/1234 = if exists user with id 1234, updates it, otherwise throw an error
 *      delete -> /users      = delete all users
 *      delete -> /users/1234 = delete user with id 1234
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

// load the business controller "classes" that manages the model classes 
// that are bonded to MongoDB via Mongoose. 
var userController = require('./controllers/userController');



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
var url = utils.DBManager.getConnectionURL();
mongoose.connect(url);



// ROUTES && BUSINESS FUNCTIONS
//-----------------------------
// put all paths under '/api'.
app.use('/api', router);

// Greetings for the API users
router.get('/', function(req,res){
    res.json({message: 'Welcome to the BasicRESMEN API (; to get access to the API paths use "serverAddress/api/path"'});
});

// User related routes
router.post('/users', function (req, res) {
    userController.createUsers(req, res);
});

/* 
 * It is not really necessary
router.get('/users', function (req, res) {
    userController.getUsers(req, res);
});
*/

router.get('/users/:id', function (req, res) {
    userController.getUser(req, res);
});

router.put('/users/:id', function (req, res) {
    userController.updateUser(req, res);
});

router.put('/users/:id/updt_prfl_pic', function(req, res){
    userController.updateProfPic(req, res); 
});

router.delete('/users/:id', function (req, res) {
    userController.deleteUser(req, res);
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
    //utils.DBManager.dropUsers();
});