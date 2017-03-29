"use strict"
class User {
	constructor (obj) {
		this.nickname = obj.nickname;
		this.connected = obj.connected;
		this.color = this.generateColor();
		this.colorRemain = this.color;
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

	connectUser () {
		this.connected = true;
		this.color = this.colorRemain;
	}
}

module.exports = User;
