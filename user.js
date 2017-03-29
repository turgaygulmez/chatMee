"use strict"
class User {
	constructor (obj) {
		this.nickname = obj.nickname;
		this.connected = obj.connected;
		this.color = null;
		this.textColor = this.generateColor();
		this.disconnectedColor = 'hsl(0, 0%, 77%)';
		this.setColor();
	}

	generateColor () {
		var h = Math.floor(Math.random() * 360);
		var s = Math.floor(Math.random() * 100);
		var color = 'hsl('+ h + ',' + s + '%, 35%)';
		return color;
	}

	disconnectUser () {
		this.connected = false;
		setColor();
	}

	setColor () {
		if (this.connected) {
			this.color = this.textColor;
		} else {
			this.color = this.disconnectedColor;
		}
	}
}

module.exports = User;
