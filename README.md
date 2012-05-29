Welcome to SharedPostit - The sahred board of post-it
==========================================

SharedPostit is a ejs, express, socket.io, mongodb  powered application.
The aim here was to create a sharing board of post-it between a users.

Architecture
-----------

node - The server-side framework.
express.js - The Web server
socket.io - WebSocket power
Mongodb (mongoose) - Database support
ejs - the client side


## Setting it up

Install [node](http://nodejs.org), [npm](http://npmjs.org) and [Mongodb](http://www.mongodb.org/).
Install the node modules when you clone this directory.
	
	npm install

Because we have the package.json it will automatically installs the dependant npm modules.

Starting
----------------

    $ node app.js

* open the index page http://localhost:3000
* put your login and your space of post-it
* In the board you can add delete a post-it
* you can see the actions of the users in real time



Contributing
------------

Feel free to fork and contribute or use this project as a template.

Enjoy!
