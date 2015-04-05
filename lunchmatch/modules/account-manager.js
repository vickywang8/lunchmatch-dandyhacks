var crypto 		= require('crypto');
var User = require('../models/user.js');
/*var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;*/
var moment 		= require('moment');
/*
var dbPort 		= 27137;
var dbHost 		= 'dbh13.mongolab.com';
var dbName 		= 'lunchmatch';*/

/* establish the database connection */

/*var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) {
		console.log(e);
	}	else{
		console.log('connected to database :: ' + dbName);
	}
});

var accounts = db.mynewcollection;*/

/* login validation methods */

exports.autoLogin = function(user, pass, callback)
{
    User.findOne({user:user}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

exports.manualLogin = function(user, pass, callback)
{
    User.findOne({user:user}, function(e, o) {
		if (o == null){
			callback('user-not-found');
		}	else{
			validatePassword(pass, o.pass, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{
    User.findOne({user:newData.user}, function(e,o) {
		if (o){
			callback('username-taken');
		}	else{
            User.findOne({email:newData.email}, function(e, o) {
				if (o){
					callback('email-taken');
				}	else{
					saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
					// append date stamp when record was created //
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                        newData.save( function(error, data){
                            if (err) {
                                // If it failed, return error
                                console.log(err);
                            }
                            else {
                                res.redirect(301, "/");
                            }
                        });
					});
				}
			});
		}
	});
}

exports.updateAccount = function(newData, callback)
{
    User.findOne({user:newData.user}, function(e, o){
		o.name 		= newData.name;
		o.email 	= newData.email;
		if (newData.pass == ''){
            User.save(o, {safe: true}, function(err) {
				if (err) callback(err);
				else callback(null, o);
			});
		}	else{
			saltAndHash(newData.pass, function(hash){
				o.pass = hash;
                User.save(o, {safe: true}, function(err) {
					if (err) callback(err);
					else callback(null, o);
				});
			});
		}
	});
}

exports.updatePassword = function(email, newPass, callback)
{
    User.findOne({email:email}, function(e, o){
		if (e){
			callback(e, null);
		}	else{
			saltAndHash(newPass, function(hash){
		        o.pass = hash;
                User.save(o, {safe: true}, callback);
			});
		}
	});
}

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
    User.remove({_id: getObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback)
{
    User.findOne({email:email}, function(e, o){ callback(o); });
}

exports.validateResetLink = function(email, passHash, callback)
{
    User.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
		callback(o ? 'ok' : null);
	});
}

exports.getAllRecords = function(callback)
{
    User.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

exports.delAllRecords = function(callback)
{
    User.remove({}, callback); // reset User// collection for testing //
}

/* private encryption & validation methods */
/*
exports.generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}
*/
exports.md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

exports.saltAndHash = function(pass, callback)
{
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
	callback(salt + crypto.createHash('md5').update(pass + salt).digest('hex'));
}

exports.validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + crypto.createHash('md5').update(plainPass + salt).digest('hex');
	callback(null, hashedPass === validHash);
}

//new code

/* auxiliary methods */

exports.getObjectId = function(id)
{
	return User.db.bson_serializer.ObjectID.createFromHexString(id)
}

var findById = function(id, callback)
{
    User.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


exports.findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
    User.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}
