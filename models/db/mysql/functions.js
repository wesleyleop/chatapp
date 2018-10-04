var mysql = require('mysql'), config = require('config');
var uuid = require('uuid');

exports.poolDatabase = {
    connectDB: function (cb) {
        var mysqlPool = mysql.createPool({
            host: config.get('db.mysql.host'),
            user: config.get('db.mysql.user'),
            password: config.get('db.mysql.pass'),
            connectionLimit: 500,
            acquireTimeout: 500000,
            database: config.get('db.mysql.dbname')
        });
        mysqlPool.getConnection(function (err, connection) {
            if (err)
                throw err;
            return cb(connection, mysqlPool);
        });
    },
    updateDb: function (tableName, data, cond, cb) {
        this.connectDB(function (connection, pool) {
            //console.log('UPDATE '+tableName+' SET ? WHERE id='+cond);
            //console.log(data);
            connection.query('UPDATE ' + tableName + ' SET ? WHERE id=' + cond, data, function (err, res) {
                if (err)
                    throw err;
                connection.release();
                pool.end();
                return cb(res);
            });
        });

    },
    deleteDb: function (tableName, data, cb) {
        this.connectDB(function (connection, pool) {
            connection.query('DELETE FROM ' + tableName + ' WHERE ' + data, function (err, res) {
                if (err)
                    throw err;
                connection.release();
                pool.end();
                return cb(res);
            });

        });

    },
    insertDb: function (tableName, data, cb) {
        this.connectDB(function (connection, pool) {
            //console.log('INSERT INTO ' + tableName + ' SET');
            //console.log(data);
            connection.query('INSERT INTO ' + tableName + ' SET ?', data, function (err, res) {
                if (err)
                    return cb(false);
                connection.release();
                pool.end();
                return cb(true);
            });

        });

    },
    selectDb: function (tableName, data, cb) {
        this.connectDB(function (connection, pool) {
            //console.log("SELECT * FROM " + tableName + " WHERE  " + data);
            //console.log(data);
            connection.query("SELECT * FROM " + tableName + " WHERE " + data, function (err, rows) {
                if (err)
                    throw err;
                connection.release();
                pool.end();
                return cb(rows);
            });

        });
    },
    selectCustomDb: function (query, cb) {
        this.connectDB(function (connection, pool) {
            //console.log(query);
            connection.query(query, function (err, rows) {
                if (err)
                    throw err;
                connection.release();
                pool.end();
                return cb(rows);
            });
        });
    },
    ckLogin: function (data, cb) {
		var query= "SELECT * FROM users WHERE user_name='"+data.username+"' AND user_password='"+data.password+"'";
        this.selectCustomDb(query , function (row) {
            return cb(row);
        });
    },
	insertUser:function(data,cb){
		this.insertDb('users', data, function (insertId) {
            return cb(insertId);
        });
    },
    getChatTable: function(channel,limit, cb) {
        assert(typeof limit === 'number');
        var query = "SELECT chat_messages.created AS date, 'say' AS type, users.user_name AS message, is_bot AS bot " +
        "FROM chat_messages JOIN users ON users.user_id = chat_messages.user_id WHERE channel = $1 ORDER BY chat_messages.id DESC LIMIT $2";
        this.selectCustomDb(query, function(rows) {
            return cb(rows);
        });
    },
    addChatMessage: function(userId, created, message, channelName, isBot,cb) {
        var sql = 'INSERT INTO chat_messages (user_id, created, message, channel, is_bot) values($1, $2, $3, $4, $5)';
        this.selectCustomDb(query , function (row) {
            return cb(row);
        });
    },
    getUserByName: function(username, cb) {
        assert(username);
        var query = "'SELECT * FROM users WHERE lower(username) = lower($1)";
        this.selectCustomDb(query , function (row) {
            return cb(row);
        });
    },
    getUserBySessionId: function(sessionId, cb) {
        assert(sessionId && cb);
        var query = 'SELECT * FROM users_view WHERE id = (SELECT user_id FROM sessions WHERE id = $1 AND ott = false AND expired > now())';
        this.selectCustomDb(query , function (row) {
            return cb(row);
        });
    },
    expireSessionsByUserId: function(userId, cb) {
        assert(userId);
        var query = 'UPDATE sessions SET expired = now() WHERE user_id = $1 AND expired > now()';
        this.selectCustomDb(query , function (row) {
            return cb(row);
        });
    },
    createOneTimeToken: function(userId, ipAddress, userAgent, cb) {
        assert(userId);
        var id = uuid.v4();
        var query = 'INSERT INTO sessions(id, user_id, ip_address, user_agent, ott) VALUES($1, $2, $3, $4, true) RETURNING id';
        this.selectCustomDb(query , function (row) {
            return cb(row);
        });
    },
    createSession: function(userId, ipAddress, userAgent, remember, cb) {
        assert(userId && cb);
        this.createSessionFn(client, userId, ipAddress, userAgent, remember, cb);
    },
    createSessionFn: function(client, userId, ipAddress, userAgent, remember, cb) {
        var sessionId = uuid.v4();
        var expired = new Date();
        if (remember)
            expired.setFullYear(expired.getFullYear() + 10);
        else
            expired.setDate(expired.getDate() + 21);
        var query = 'INSERT INTO sessions(id, user_id, ip_address, user_agent, expired) VALUES($1, $2, $3, $4, $5) RETURNING id';  
        this.selectCustomDb(query , function (row) {
            return cb(row);
        });
    }
};


