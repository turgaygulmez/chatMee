"use strict"
class User {
	constructor (obj) {
		this.nickname = obj.nickname;
		this.connected = obj.connected;
		this.color = this.generateColor();
	}

	generateColor () {
		var h = Math.floor(Math.random() * 360);
		var s = Math.floor(Math.random() * 100);
		var color = 'hsl('+ h + ',' + s + '%, 35%)';
		return color;
	}

	disconnectUser () {
		this.connected = false;
		this.color = 'hsl(0, 0%, 77%)';
	}
}

module.exports = User;