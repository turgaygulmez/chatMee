var app = app || angular.module('chatApp', []);

app.controller('chatCtr', function($scope, $window, socket) {  

	$scope.nickname = "";
	$scope.showPopup = true;
	$scope.message = "";
	$scope.allMessages = [];
	$scope.allUsers = [];


	// expand view when you recieve a new message
	socket.register('message', function (data) {
		$scope.allMessages = data;
	})

	// initialize all users and messages
	socket.register('join', function (data) {
		$scope.showPopup = false;
		$scope.allMessages = data.allMessages;
		$scope.allUsers = sortObject(data.allUsers)
	});

	// update users if someone exits
	socket.register('exitChat', function (data) {
		$scope.allUsers = sortObject(data.allUsers);
	})

	$scope.login = function () {
		socket.send('join', $scope.nickname);
	}

	$scope.sendMessage = function() {
		socket.send('message', $scope.message);
		$scope.message = '';
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

});
