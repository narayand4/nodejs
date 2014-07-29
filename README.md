nodejs
======

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
tcp_server/chat_app/server.js -> run this command in terminal
$ node server.js
then now open two other terminals so now there are theree terminals one is server and other two terminals are two clients. 
Please type this command in both client terminals.
$ nc localhost 4002
Now type anything in client 1 terminal and the result will be show in second client 2 terminal. Type anything in second client terminal and result will be show in first client terminal.
