"use strict";

var rfc = require('node-rfc');

var abapSystem = {
 user: '22909',
 passwd: 'password',
 ashost: '172.25.121.226',
 sysnr: '06',
 client: '700',
 name: 'PEC'
};

// create new client 
var client = new rfc.Client(abapSystem);

// echo the client NW RFC lib version 
console.log('RFC client lib version: ', client.getVersion());

// and connect 
client.connect(function(err) {
 if (err) { // check for login/connection errors 
   return console.error('could not connect to server', err);
 }

    console.log("Connection established");




});