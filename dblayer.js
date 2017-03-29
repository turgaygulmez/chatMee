"use strict"

var MongoClient = require('mongodb').MongoClient;

class DB {
	constructor (dbName) {
		this.url = 'mongodb://localhost:27017/' + dbName;
		this.dbConnectionError = 'unable to connect db';
	}

	add (col, data) {

		MongoClient.connect(this.url, function(err, db) {
		    if (err) {
		        console.log(this.dbConnectionError);
		    } else {
		        var collection = db.collection(col);
		        collection.insert(data, function (err, result) {
			        if (err) {
			        	console.log(err);
			        }
			        db.close();
		        });
		    }
		}.bind({
			dbConnectionError: this.dbConnectionError,
			url: this.url
		}));
	};

	get (col, callback) {
		MongoClient.connect(this.url, function(err, db) {
		    if (err) {
		        console.log(this.dbConnectionError);
		    } else {
		        var collection = db.collection(col);
		        
		        collection.find().sort({$natural: -1}).limit(50).toArray(function (err, result) {
			       	if (err) {
				        console.log(err);
				    } else if (result.length) {
				        callback(result);
				    } else {
				    	console.log('No such collection. Creating new one');

				    	db.createCollection(col, function(err, collection){
						   	console.log("collection = " + col + " is created");
							callback([]);
						});
				    }

			        db.close();
		        });
		    }
		}.bind({
			dbConnectionError: this.dbConnectionError,
			url: this.url			
		}));
	}
}

module.exports = DB;
