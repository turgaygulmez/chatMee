var app = app || angular.module('chatApp', []);

app.factory('socket', function($rootScope) {
	var private = {
		socket: io.connect('http://localhost:3000/')
	}

	function register (eventName, callback) {
		private.socket.on(eventName, function (data) {
			$rootScope.$apply(function () {
				callback(data);
			});
		});
	}

	function send (eventName, data) {
		private.socket.emit(eventName, data);
	}

	return {
		register: register,
		send: send,
		_testonly_: private
	};
});
