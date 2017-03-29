var path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var User = require("./user");

var staticPath = path.join(__dirname, '/public');
app.use(express.static(staticPath));

var allMessages = [];
var allUsers = {};

io.on('connection', function (client) {

    client.on('message', function (data) {

        //send client message to everyone
        var msgData = {
            senderName: allUsers[data.clientId].nickname,
            senderColor: allUsers[data.clientId].color,
            senderMessage: data.message
        };

        allMessages.unshift(msgData);
        io.emit('message', allMessages);
    });

    client.on('join', function (nickname) {
    	console.log(nickname);
        var user = new User({
            nickname: nickname,
            connected: client.connected,
        });

        allUsers[client.id] = user;

        io.emit('join', {
            currentUserId: client.id,
            allMessages: allMessages,
            allUsers: allUsers
        });

        console.log('client joined to a room');
    });

    client.on('login', function (clientId) {

    	if (allUsers[clientId]) {

    		allUsers[clientId].connectUser();

	        io.emit('join', {
	            currentUserId: clientId,
	            allMessages: allMessages,
	            allUsers: allUsers
	        });

	        console.log('client loged in a room');
    	} else {
    		client.emit('login', false);
    	}

    });

    client.on('exitChat', function (clientId) {

        if (Object.keys(allUsers).length !== 0 &&
            allUsers.constructor === Object &&
            allUsers[clientId]) {

            allUsers[clientId].disconnectUser();

            io.emit('exitChat', {
                allUsers: allUsers
            });

            console.log('client exit from a room');
        }
    });

});

server.listen(3000, function() {
  console.log('listening');
});
