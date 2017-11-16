var mysql = require('mysql');

// Database Connection
function Connection() {
this.pool = null;

this.init = function() {
	this.pool = mysql.createPool({
		connectionLimit: 10,
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'manga'
	});
};

this.acquire = function(callback) {
	this.pool.getConnection(function(err, connection) {
		callback(err, connection);
	});
};
}

module.exports = new Connection();