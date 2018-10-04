var config = require('config');
var dbbase = require('../../models/db/' + config.get('db.server') + '/functions').poolDatabase;

exports.query = {
	ckLogin: function (data, cb) {
		dbbase.ckLogin(data, function (row) { return cb(row); });
	},
	insertUser: function (data, cb) {
		dbbase.insertUser(data, function (row) {
			return cb(row);
		});
	},
	getChatTable: function (channel, limit, cb) {
		dbbase.getChatTable(channel, limit, function (rows) {
			return cb(rows);
		});
	},
	addChatMessage: function (userId, created, message, channelName, isBot, cb) {
		dbbase.addChatMessage(userId, created, message, channelName, isBot, function (row) {
			return cb(row);
		});
	},
	getUserByName: function (username, cb) {
		dbbase.getUserByName(username, function (row) {
			return cb(row);
		});
	},
	getUserBySessionId: function (sessionId, cb) {
		dbbase.getUserBySessionId(sessionId, function (row) {
			return cb(row);
		});
	},
	expireSessionsByUserId: function (userId, cb) {
		dbbase.expireSessionsByUserId(userId, function (row) {
			return cb(row);
		});
	},
	createOneTimeToken: function (userId, ipAddress, userAgent, cb) {
		dbbase.createOneTimeToken(userId, ipAddress, userAgent, function (row) {
			return cb(row);
		});
	},
	createSession: function (userId, ipAddress, userAgent, remember, cb) {
		dbbase.createSession(userId, ipAddress, userAgent, remember, function (row) {
			return cb(row);
		});
	}
};
