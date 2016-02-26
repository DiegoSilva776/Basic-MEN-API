/**
 * This is a RESTful like API for a basic cross-platform app.
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
 * Last updated: 02/25/2016 
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
var ejs            = require('ejs');
var session        = require('express-session');

// local dependencies
var env   = require('./utils/env');
var utils = require('./utils/utils');

// load the business controller that manage the model entities that are bound 
// to MongoDB via Mongoose. 
var userController      = require('./controllers/userController');
var authController      = require('./controllers/authController');
var apiClientController = require('./controllers/apiClientController');



// INITIALIZATION
//---------------
console.log('Initializing system ...');

// setup the environment and database variables
env.vars.IP             = process.env.IP;    // <<< comment this line if you don't have any constraint about the IP
env.vars.PORT           = process.env.PORT;  // <<< comment this line if you don't have any constraint about the PORT
//utils.Local.appRoot   = __dirname;         // <<< you can put the absolute path for the root directory of your webserver here if you want
utils.DBManager.DB_PORT = "27017";           // <<< change this line if you have any specification about the PORT you should run you database server
utils.DBManager.DB_NAME = "basicRESTMEN_DB";


// configures MongoDB and attach Mongoose to it
var url = utils.DBManager.getConnectionURL();
mongoose.connect(url);
 
// create an instance of the webserver object
var app = express();

// setup a HTTP document body parser, to get data formated as urlencoded and json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// initializes a router object with the current express router
var router = express.Router();

// creates a path to allow access to static files within the server
express.static(path.join(utils.Local.appRoot, utils.Local.STATIC_PATH));

// set view engine to ejs and allow the server to render pages such as HTML
app.set('view engine', 'ejs');



// ROUTES && BUSINESS FUNCTIONS
//-----------------------------
/**
 * Access control related routes
 */
// returns an access token after the creation of the API client
router.route('/apiClients')
  .post(authController.isAuthenticated, apiClientController.postClients);

// destroys the API client and the client 
router.route('/apiClients/:id')
  .delete(authController.isAuthenticated, apiClientController.deleteClient);

/**
 * User related routes
 */
router.route('/users')
  .post(userController.createUsers)
  .get(authController.isAuthenticated, userController.getUsers);

router.route('/users/:id')
  .get(authController.isAuthenticated, userController.getUser)
  .put(authController.isAuthenticated, userController.updateUser)
  .delete(authController.isAuthenticated, userController.deleteUser);

// create a separeted route to update the user profile picture
router.route('/users/:id/updt_prfl_pic')
  .put(authController.isAuthenticated, userController.updateProfPic);

// put all paths under '/api'
app.use('/api', router);



// SERVER
//-------
var server = app.listen(env.vars.PORT, env.vars.IP, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log("OurMemex API listening at http://%s:%s", host, port);
    
    // Reset user related collections on the database
    //utils.DBManager.dropUsers();
    //utils.DBManager.dropClients();
    //utils.DBManager.dropTokens();
});