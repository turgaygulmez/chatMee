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

    client.on('message', function (message) {

        //send client message to everyone
        var msgData = {
            senderName: allUsers[client.id].nickname,
            senderColor: allUsers[client.id].color,
            senderMessage: message
        };

        allMessages.unshift(msgData);
        io.emit('message', allMessages);
    });

    client.on('register', function (nickname) {
        var user = new User({
            nickname: nickname,
            connected: client.connected,
        });

        allUsers[client.id] = user;

        io.emit('register', {
            allMessages: allMessages,
            allUsers: allUsers
        });
    });

    client.on('exitChat', function () {

        if (Object.keys(allUsers).length !== 0 &&
            allUsers.constructor === Object &&
            allUsers[client.id]) {

            allUsers[client.id].disconnectUser();

        console.log(allUsers[client.id])

            io.emit('exitChat', {
                allUsers: allUsers
            });
        }
    });

});

server.listen(3000, function() {
  console.log('listening');
});
