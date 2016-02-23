# BasicMENREST



## Environment setup

    NodeJS setup on Ubuntu machine (C9)
    
        1 - Install Node
        
            $ cd /tmp
            $ wget http://nodejs.org/dist/v0.12.0/node-v0.12.0-linux-x64.tar.gz
            $ tar xvfz node-v0.12.0-linux-x64.tar.gz
            $ mkdir -p /usr/local/nodejs
            $ mv node-v0.12.0-linux-x64/* /usr/local/nodejs
        
        
        2 - Create a global variable for node
        
            export PATH=$PATH:/usr/local/nodejs/bin
        
        
        3 - Create a .js file and run node
        
            $ node main.js
        
        
        4 - Install npm globally
        
            $ sudo npm install npm -g
        
        
        5 - Install the modules you need in your application, globally using '-g' or within the app '--save'
        
            npm install express --save
    
    

# References
http://www.tutorialspoint.com/nodejs/
https://codeforgeek.com/2014/11/file-uploads-using-node-js/
http://scottksmith.com/blog/2014/05/29/beer-locker-building-a-restful-api-with-node-passport/