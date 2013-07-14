var mysql = require('mysql');

/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
var dbConnection = mysql.createConnection({
  user: "root",
  password: "root",
  database: "chat",
  port: 8889
});
exports.newMessage = function(content, username, roomname){

  exports.getRoomID(roomname, function(roomid){
    exports.getUserID(username, function(userid){
      dbConnection.query("insert into messages (content, user_id, room_id) values ('"+content+"', "+userid+", "+roomid+")", function(err){
        if (err){
          console.log('err', err);
        }
      });
    });
  });
  //FIX THIS
  // var id = 3; //FIX THIS
  // console.log('content', content, 'username', username);
};


exports.getUserID = function(username, callback){
  dbConnection.query("select id from users where username='"+username+"'", function(err, rows, fields){
    if (rows[0]){
      callback(rows[0]['id']);
    } else {
      exports.createUser(username, callback);
    }
  });
};

exports.createUser = function(username, callback){
  // dbConnection.connect();
  // var returnID;
  dbConnection.query("insert into users (username) values ('"+username+"')", function(err, results){
    // callback(results[0]['id']);
    exports.getUserID(username, callback);
  });
  //FIX THIS. RETURN ID IS NOT GETTING SAVED IN TIME.
  // return returnID;
};

exports.getRoomID = function(roomname, callback){
  dbConnection.query("select id from rooms where name='"+roomname+"'", function(err, rows, fields){
    if (rows[0]){
      callback(rows[0]['id']);
    } else {
      exports.createRoom(roomname, callback);
    }
  });
};

exports.createRoom = function(roomname, callback){
  dbConnection.query("insert into rooms (name) values ('"+roomname+"')", function(err, result){
    exports.getRoomID(roomname, callback);
  });
};

exports.getMessages = function(roomname, callback){
  exports.getRoomID(roomname, function(roomid){
    dbConnection.query('SELECT m.content, u.username FROM messages m, users u WHERE m.user_id = u.id AND m.room_id = '+roomid+';', function(err, results){
      callback(results);
    });
  });
};

/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/

/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */

