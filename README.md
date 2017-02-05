nodejs
======
=======
Node js sample codes for beginners. We can get output of every nodejs codes using terminal. like<br>
$ node mysql.js


Install latest nodejs
-------------------------------------------------------------
$ sudo apt-get install python-software-properties<br>
$ sudo add-apt-repository ppa:chris-lea/node.js<br>
$ sudo apt-get update<br>
$ sudo apt-get install nodejs<br>

Install latest NPM
--------------------------------------------------------------
$ sudo npm install npm-latest

Install postgres nodejs driver
--------------------------------------------------------------
$ sudo npm install pg

Install mysql nodejs driver
--------------------------------------------------------------
$ sudo npm install mysql<br>
more help https://www.npmjs.org/package/mysql

Install mongodb nodejs driver
--------------------------------------------------------------
$ sudo npm install mongodb<br>
$ sudo npm install mongoose<br>
more help http://docs.mongodb.org/ecosystem/drivers/node-js/

Install sqlite nodejs driver
--------------------------------------------------------------
$ sudo npm install sqlite3<br>
more help https://www.npmjs.org/package/sqlite3

Create Chat server:
--------------------------------------------------------------
tcp_server/chat_app/server.js -> run this command in terminal.<br>

$ node server.js<br>

then now open two other terminals so now there are theree terminals one is server and other two terminals are clients.
Please type this command in both client terminals.<br>

$ nc localhost 4002<br>

Now type anything in first client terminal and the result will be show in second client terminal. Type anything in second client terminal and result will be show in first client terminal. please view this image<br> https://github.com/narayand4/nodejs/blob/master/tcp_server/chat_app/Screenshot%20from%202014-07-29%2015:55:30.png<br>

Node SASS lib
-------------------------------------------------------------
$ sudo npm install node-sass<br>
