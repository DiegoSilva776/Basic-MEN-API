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

    NodeJS setup on Ubuntu machine (C9), run the commands
    
        1 - Install Node
            $ cd /tmp
            $ wget http://nodejs.org/dist/v0.12.0/node-v0.12.0-linux-x64.tar.gz
            $ tar xvfz node-v0.12.0-linux-x64.tar.gz
            $ mkdir -p /usr/local/nodejs
            $ mv node-v0.12.0-linux-x64/* /usr/local/nodejs
        
        2 - Create a global variable for node
            $ export PATH=$PATH:/usr/local/nodejs/bin
        
        4 - Navigate to your project's folder
        
        5 - Clone BasicMENREST repository
    
    
## Installation

    1 - Install the packages listed on 'package.json' file of your basic API:
        $ npm install
        
    2 - Start MongoDB
        $ mongod
        
    3 - Start the server
        $ nodemon main.js
    
    
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