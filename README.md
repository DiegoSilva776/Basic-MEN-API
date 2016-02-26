# BasicMENREST

    BasicMENREST - API provides a webserver that uses MongoDB/Mongoose 
    framework to build a database system, Express for the webserver itself, and 
    NodeJS. The Security was implmented with Passport.

    This project aims to increase the speed of your REST API development, by 
    offering a user class with simple authentication strategies:
        
        * first strategy  : 'username & password'
        * second strategy : 'access token'
        
    and a simple organization for your web service.

    This is a basic template for a multipurpose API. Install and customize this
    webservice to meet your system architecture needs, and model your system 
    connecting the User entity to the other pieces of your software.
    

## Environment setup

    NodeJS and MongoDB setup
    
        1 - Download and install Node
            https://nodejs.org/en/download/
            http://www.tutorialspoint.com/nodejs/nodejs_environment_setup.htm
        
        2 - Download and install MongoDB
            http://www.tutorialspoint.com/mongodb/mongodb_environment.htm
            
            OBS: if you are using Windows, stop following the instructions of the tutorial 
                 on the line bellow, don't execute it:
                 
                D:\set up\mongodb\bin>mongod.exe --dbpath "d:\set up\mongodb\data"
        
        3 - Place the BasicMENREST files in the folder you want to keep the project in. Clone 
            the repo or simply download the files and extract them in the project folder.
            
        4 - Set your environment variables on 'main.js' on the 'INITIALIZATION' section ex:
            
            // setup the environment and database variables
            env.vars.IP             = 127.0.0.1;  
            env.vars.PORT           = 3000;
            utils.DBManager.DB_PORT = 27017;
            utils.DBManager.DB_NAME = "basicRESTMEN_DB";
        
        5 - Install the project dependencies:
            npm install
        
        6 - Create the folders 'data/_tmp' within the root folder of your project.
           
        7 - Start MongoDB server and let it 'waiting for connections' ex:
            open a terminal and run:
                "D:/path to the installation directory/mongodb/bin/mongod.exe" --dbpath "D:/path to the 'data' folder you've just created within the root folder of your project"
            
            Obs: if you started the MongoDB server during the MongoDB installation, make 
            sure to kill the process only one instance of 'mongod.exe' can be running.
            
            open another terminal and run:
                "D:/path to the root directory of your project">node main.js
            
        8 - Starting making requests to the API:
    

## Requests

    Download the files under the '/requests' folder, read the one you need and 
    check how to do each request. So far I've tested the requests only with POSTMAN
    but I'm going to update them here once I do the actual requests.
    
    
    
## Security
    
    Please make sure to implement your own hash function on ./utils/utils.js 
    within the function 'getHashedValue'


## References
    http://www.tutorialspoint.com/nodejs/
    http://mongoosejs.com/docs/index.html
    https://codeforgeek.com/2014/11/file-uploads-using-node-js/
    http://scottksmith.com/blog/2014/05/29/beer-locker-building-a-restful-api-with-node-passport/


## License

    The MIT License (MIT)

    Copyright (c) [year] [fullname]
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.