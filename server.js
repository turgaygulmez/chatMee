var path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var User = require("./user");
var DB = require("./dblayer");


var staticPath = path.join(__dirname, '/public');
app.use(express.static(staticPath));


var allData = {};
var messageLimit = 50;

io.on('connection', function (client) {

    var db = new DB('chatDB');

    client.on('message', function (data) {

        //send client message to everyone
        var msgData = {
            senderName: allData[data.room].allUsers[client.id].nickname,
            senderColor: allData[data.room].allUsers[client.id].color,
            senderMessage: data.message
        };

        db.add(data.room, msgData);

        if (allData[data.room].allMessages.length > messageLimit) {
            allData[data.room].allMessages.pop();
        }
        allData[data.room].allMessages.unshift(msgData);
        io.in(data.room).emit('message', allData[data.room].allMessages);
    });

    client.on('register', function (data) {
        var user = new User({
            nickname: data.nickname,
            connected: client.connected,
        });

        client.join(data.room);

        if (!allData[data.room]) {
            allData[data.room] = {};
            allData[data.room]['allUsers'] = {};
            allData[data.room]['allMessages'] = [];
        }

        db.get(data.room, function (dbData) {
            allData[data.room]['allMessages'] = dbData;
            allData[data.room].allUsers[client.id] = user;

            io.in(data.room).emit('register', {
                allMessages: allData[data.room]['allMessages'],
                allUsers: allData[data.room].allUsers
            });
        });
        
    });

    client.on('exitChat', function (room) {
        if (allData[room]) {
            if (Object.keys(allData[room].allUsers).length !== 0 &&
                allData[room].allUsers.constructor === Object &&
                allData[room].allUsers[client.id]) {

                allData[room].allUsers[client.id].disconnectUser();

                io.in(room).emit('exitChat', {
                    allUsers: allData[room].allUsers
                });
            }
        }
    });
});

server.listen(3000, function() {
  console.log('listening');
});
