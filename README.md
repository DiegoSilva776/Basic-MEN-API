## Environment setup

Node setup on Ubuntu machine

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


6 - Clone the repository from Bitbucket


# BasicMENREST