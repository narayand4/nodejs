//db.createCollection("log", { capped : true, size : 102400, max : 100 } )

/*jslint node: true */
'use strict';

var http = require('http'),
    util = require('util'),
    fs = require('fs'),
    forms = require('../lib/forms'),
    jsontemplate = require('./json-template'),
    parse = require('url').parse,
    MongoClient = require('mongodb').MongoClient;;

var fields = forms.fields,
    validators = forms.validators,
    widgets = forms.widgets;

// template for the example page
var listTemp = jsontemplate.Template(
    fs.readFileSync(__dirname + '/list.jsont').toString()
);

var addTemp = jsontemplate.Template(
    fs.readFileSync(__dirname + '/add.jsont').toString()
);

var editTemp = jsontemplate.Template(
    fs.readFileSync(__dirname + '/edit.jsont').toString()
);

var connectionUrl = "mongodb://localhost:27017/nodejsdb";

http.createServer(function (req, res) { 
    var url = req.url;
    var urlOptions = url.split('/');
    
    if(urlOptions[1]!='favicon.ico'){
        switch(urlOptions[1]){
            case 'add':
                        // our example registration form
                        var reg_form = forms.create({
                            username    : fields.string({required: true}),
                            password    : fields.password({required: true}),
                            confirm     :  fields.password({
                                required    : true,
                                validators  : [validators.matchField('password')]
                            }),
                            personal: {
                                name    : fields.string({required: true, label: 'Name'}),
                                email   : fields.email({required: true, label: 'Email'}),
                                address: {
                                    address1    : fields.string({required: true, label: 'Address 1'}),
                                    address2    : fields.string({label: 'Address 2'}),
                                    city        : fields.string({required: true, label: 'City'}),
                                    state       : fields.string({required: true, label: 'State'}),
                                    zip         : fields.number({required: true, label: 'ZIP'})
                                }
                            }
                        });

                        //res.end('add');
                        reg_form.handle(req, {
                            success: function (form) {
                                // Connect to the db
                                MongoClient.connect(connectionUrl, function(err, db) {
                                  if(err) { return console.dir(err); }
                                  var collection = db.collection('users');
                                  var userData = {
                                    'username':form.data.username, 
                                    'password':form.data.username,
                                    'name':form.data.personal.name,
                                    'email':form.data.personal.email,
                                    'address1':form.data.personal.address.address1,
                                    'address2':form.data.personal.address.address2,
                                    'city':form.data.personal.address.city,
                                    'state':form.data.personal.address.state,
                                    'zip':form.data.personal.address.zip
                                  };
                                  collection.insert(userData, {w:1}, function(err, result) {
                                    res.writeHead(200, {'Content-Type': 'text/html'});
                                    res.write('<h1>Success!</h1>');
                                    //res.end('<pre>' + util.inspect(form.data) + '</pre>');
                                  });
                                });           
                            },
                            // perhaps also have error and empty events
                            other: function (form) {
                                res.writeHead(200, {'Content-Type': 'text/html'});
                                res.end(addTemp.expand({
                                    form: form.toHTML(),
                                    enctype: '',
                                    method: 'POST'
                                }));
                            }
                        });
                        break;
            case 'edit':
                        if(!urlOptions[2]){
                            res.end('Invalid user.'); 
                        }
                        
                        //var stream;
                        MongoClient.connect(connectionUrl, function(err, db) {
                            if(err) { return console.dir(err); }
                            var collection = db.collection('users');
                            collection.findOne({username:urlOptions[2]}, function(err, item) {
                                // our example registration form
                                var edit_form = forms.create({
                                    username    : fields.string({required: true,value:item.username,readonly:true}),
                                    personal: {
                                        name    : fields.string({required: true, label: 'Name',value:item.name}),
                                        email   : fields.email({required: true, label: 'Email',value:item.email}),
                                        address: {
                                            address1    : fields.string({required: true, label: 'Address 1',value:item.address1}),
                                            address2    : fields.string({label: 'Address 2',value:item.address2}),
                                            city        : fields.string({required: true, label: 'City',value:item.city}),
                                            state       : fields.string({required: true, label: 'State',value:item.state}),
                                            zip         : fields.number({required: true, label: 'ZIP',value:item.zip})
                                        }
                                    }
                                });
                                
                                //res.end('edit');
                                edit_form.handle(req, {
                                    success: function (form) {
                                        // Connect to the db
                                        MongoClient.connect(connectionUrl, function(err, db) {
                                          if(err) { return console.dir(err); }
                                          var collection = db.collection('users');
                                          var userData = {
                                            username:form.data.username, 
                                            name:form.data.personal.name,
                                            email:form.data.personal.email,
                                            address1:form.data.personal.address.address1,
                                            address2:form.data.personal.address.address2,
                                            city:form.data.personal.address.city,
                                            state:form.data.personal.address.state,
                                            zip:form.data.personal.address.zip
                                          };
                                          collection.update({username:urlOptions[2]}, {$set:userData}, {multi:true}, function(err, result) {
                                            if(err) { return console.dir(err); }
                                            res.writeHead(200, {'Content-Type': 'text/html'});
                                            res.write('<h1>Success!</h1>');
                                          });                                         
                                        });           
                                    },
                                    // perhaps also have error and empty events
                                    other: function (form) {
                                        res.writeHead(200, {'Content-Type': 'text/html'});
                                        res.end(editTemp.expand({
                                            form: form.toHTML(),
                                            enctype: '',
                                            method: 'POST'
                                        }));
                                    }
                                });
                            });
                        });
                        break;
            default:
                        //res.end('list');
                        /*res.writeHead(200, {'Content-Type': 'text/html'});
                        listTemp.render();
                        res.end();*/

                        MongoClient.connect(connectionUrl, function(err, db) {
                          if(err) { return console.dir(err); }
                          var collection = db.collection('users');
                          collection.find().toArray(function(err, items) {
                            var html = '<div><ul>';
                            html +='<li><b>Username</b></li>';
                            html +='<li><b>Name</b></li>';
                            html +='<li><b>Email</b></li>';
                            html +='<li><b>Address</b></li></ul></div>';
                            for(var i=0;i<items.length;i++){
                                html += '<div><ul>';
                                html +='<li>'+items[i].username+'</li>';
                                html +='<li>'+items[i].name+'</li>';
                                html +='<li>'+items[i].email+'</li>';
                                html +='<li>'+items[i].address1+'</li>';
                                html +='</ul></div>';
                            }                            
                            res.end(listTemp.expand({
                                userlist:html
                            }));                            
                          });
                        });
                        break;
        }
    }
}).listen(4008);

util.puts('Server running at http://127.0.0.1:4008/');