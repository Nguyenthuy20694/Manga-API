var connection = require('../connection');
var expressJwt = require('express-jwt');
var jsonwebtoken = require('jsonwebtoken');
// var config = require('../../config');
// var secretKey = config.secretKey;
var secretKey = "123456789";
bcrypt = require('bcrypt');
function Manga() {

  // get Manga list
    this.get = function(res) {
        connection.acquire(function(err, con) {
          con.query('select * from manga', function(err, result) {
            con.release();
            if (err) {
              res.send({status_code: 500, message: 'Server Error!'});
            } else if (result.length != 0) {
              res.send({status_code: 200, message: 'Successful!', data: result});
            }else
              res.send({status_code: 400, message: 'No Result Found'});
          });
        });
      };

  // get Category list
  this.category = function(res) {
    connection.acquire(function(err, con) {
      con.query('select * from category', function(err, result) {
        con.release();
        if (err) {
          res.send({status_code: 500, message: 'Server Error!'});
        } else if (result.length != 0) {
          res.send({status_code: 200, message: 'Successful!', data: result});
        }else
          res.send({status_code: 400, message: 'No Result Found'});
      });
    });
  };

  // filter Manga by Category
  this.findbyCategory = function(id, res) {
    connection.acquire(function(err, con) {
      con.query('select * from manga where category_id=?', [id], function(err, result) {
        con.release();
        if (err) {
          res.send({status_code: 500, message: 'Server Error!'});
        } else if (result.length != 0) {
          res.send({status_code: 200, message: 'Successful!', data: result});
        }else
          res.send({status_code: 400, message: 'No Result Found'});
      });
    });
  };

   // search Manga 
   this.search = function(keyword,res) {
    connection.acquire(function(err, con) {
    con.query("SELECT * from manga where name LIKE ?", '%'+ [keyword]+'%' , function(err, rows, fields) { 
      con.release();
      if (rows == "") {
        res.json({status_code: 400, message :  'No Result Found',data: null});
        return
      }
       else {
        res.send({status_code: 200, message: "Successful!",data: rows});
        return
            }
        
    });
  });
  };

  // get Manga detail
      this.detail = function(id, res) {
        connection.acquire(function(err, con) {
          con.query('select * from manga where manga_id =?', [id], function(err, result) {
            con.release();
            if (err) {
              res.send({status_code: 500, message: 'Server Error!'});
            } else if (result.length != 0) {
              res.send({status_code: 200, message: 'Successful!', data: result});
            }else
              res.send({status_code: 400, message: 'No Result Found'});
          });
        });
      };

  //get chapter of Manga
      this.chapter = function(id, res) {
        connection.acquire(function(err, con) {
          con.query('select * from chapter where manga_id=?', [id], function(err, result) {
            con.release();
            if (err) {
              res.send({status_code: 500, message: 'Server Error!'});
            } else if (result.length != 0) {
              res.send({status_code: 200, message: 'Successful!', data: result});
            }else
              res.send({status_code: 400, message: 'No Result Found'});
          });
        });
      };

  // get chapter detail
      this.read = function(id, res) {
        connection.acquire(function(err, con) {
          con.query('select * from chapter where chapter_id=?', [id], function(err, result) {
            con.release();
            if (err) {
              res.send({status_code: 500, message: 'Server Error!'});
            } else if (result.length != 0) {
              res.send({status_code: 200, message: 'Successful!', data: result});
            }else
              res.send({status_code: 400, message: 'No Result Found'});
          });
        });
      };

  // get list image of chapter
      this.list_image = function(id, res) {
        connection.acquire(function(err, con) {
          con.query('select * from image where chapter_id=?', [id], function(err, result) {
            con.release();
            if (err) {
              res.send({status_code: 500, message: 'Server Error!'});
            } else if (result.length != 0) {
              res.send({status_code: 200, message: 'Successful!', data: result});
            }else
              res.send({status_code: 400, message: 'No Result Found'});
          });
        });
      };

  // get user
      this.user = function(id, res) {
        connection.acquire(function(err, con) {
          con.query('select * from user where id=?', [id], function(err, result) {
            con.release();
            if (err) {
              res.send({status_code: 500, message: 'Server Error!'});
            } else if (result.length != 0) {
              res.send({status_code: 200, message: 'Successful!', data: result});
            }else
              res.send({status_code: 400, message: 'No Result Found'});
          });
        });
      };

  // Create Token
      function createToken(user) {
      var token = jsonwebtoken.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      address: user.address
      }, secretKey, {expiresIn : 60*60*24}); // expires in 24 hours
       return token;
       }

  // user login
      this.login = function(field_data, res) {
        var user = {
          email: field_data.email,
          password: field_data.password
      };
        connection.acquire(function(err, con) {
          con.query('SELECT * from user where email = ?', [user.email], function(err, rows, fields) { 
            con.release();
            if (rows == "") {
              res.json({status_code: 400, message :  'User signin failed: Incorrect Email or Password!'});
              return
            } else {
              bcrypt.compare(user.password, rows[0].encrypt_password, function (err, status) {
                  if (status == true) {
                      var token = createToken({
                          id: rows[0].id,
                          email: rows[0].email,
                          name: rows[0].name,
                          address: rows[0].address
                      });
                      res.send({status_code: 200, message: "Signin successful!",data: {token: token, user:rows[0]}});
                      return
                  } else {
                      res.send({status_code: 400, message: 'User signin failed: Incorrect Email or Password !'});
                      return
                  }
              });
          }
      });
        });
      }
      
  // user register
      this.register = function(field_data, res) {
       connection.acquire(function(err, con) {
       con.query('SELECT * from user where email = ?', [field_data.email], function(err, rows, fields) { 
            con.release();
            if(rows != "") {
              res.send({status_code: 400, message: 'User signup failed: Email Exits!'});
              return
            }
            else{
      var salt = bcrypt.genSaltSync();
			var encryptedPassword = bcrypt.hashSync(field_data.password, salt);
        connection.acquire(function(err, con) {
          con.query('INSERT INTO user (email,name,address,encrypt_password	) VALUES  ("' + field_data.email + '","' + field_data.name + '","' + field_data.address + '","' + encryptedPassword + '")',
          function(err, result) {
            con.release();
            if (err) {
              res.send({status_code: 400, message:  'User signup failed!'});
            } else {
              res.send({status_code: 200, message:  'Signup successful!', data: field_data});
            }
          });
        });
        }
      });
})}
}
module.exports = new Manga();
