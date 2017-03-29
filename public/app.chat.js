var app = app || angular.module('chatApp', ['ngCookies']);

app.controller('chatCtr', function(
	$scope,
	$window,
	socket,
	$cookies) {

	$scope.nickname = "";
	$scope.showPopup = true;
	$scope.message = "";
	$scope.allMessages = [];
	$scope.allUsers = [];

	$scope.register = function () {
		socket.send('register', $scope.nickname);
	}

	$scope.sendMessage = function() {
		if ($scope.message) {
			socket.send('message', $scope.message);
			$scope.message = '';
		}
	}

    $window.onbeforeunload = function () {
    	socket.send('exitChat');
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
