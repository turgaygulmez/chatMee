var app = app || angular.module('chatApp', []);

app.controller('chatCtr', function(
	$scope,
	$window,
	socket) {

	$scope.nickname = "";
	$scope.showPopup = true;
	$scope.message = "";
	$scope.allMessages = [];
	$scope.allUsers = [];
	$scope.rooms = ['room1', 'room2', 'room3'];
	$scope.selectedRoom = 'choose a room';

	$scope.register = function () {
		if ($scope.selectedRoom !== 'choose a room' &&
			$scope.nickname !== '') {
			socket.send('register', {
				nickname: $scope.nickname,
				room: $scope.selectedRoom
			});
		}
	}

	$scope.sendMessage = function() {
		if ($scope.message) {
			socket.send('message', {
				message: $scope.message,
				room: $scope.selectedRoom				
			});
			$scope.message = '';
		}
	}

	$scope.setRoom = function (room ) {
		$scope.selectedRoom = room;
	}

    $window.onbeforeunload = function () {
    	socket.send('exitChat', $scope.selectedRoom);
    }

    /***** Helper functions ****/

   	function sortObject(obj) {
		var sortedObj = {};
		var sortedKeys = Object.keys(obj).sort(function(a,b){
			return obj[b].connected - obj[a].connected
		});
		for (key in sortedKeys) {
			sortedObj[sortedKeys[key]] = obj[sortedKeys[key]];
		}
		return sortedObj;
	}

	function registerSocket () {
		// expand view when you recieve a new message
		socket.register('message', function (data) {
			$scope.allMessages = data;
		})

		// initialize all users and messages
		socket.register('register', function (data) {
			$scope.allMessages = data.allMessages;
			$scope.allUsers = sortObject(data.allUsers);
			$scope.showPopup = false;
		});

		// update users if someone exits
		socket.register('exitChat', function (data) {
			$scope.allUsers = sortObject(data.allUsers);
		});
	}

	function init () {
		registerSocket();
	}

	init();
});
