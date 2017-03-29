var app = app || angular.module('chatApp', ['ngCookies']);

app.factory('socket', function($rootScope){
	var socket = io.connect('http://localhost:3000/');

	function register (eventName, callback) {
		socket.on(eventName, function (data) {
			$rootScope.$apply(function () {
				callback(data);
			});
		});
	}

	function send (eventName, data) {
		socket.emit(eventName, data);
	}

	return {
		register: register,
		send: send
	};
});
