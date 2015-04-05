var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var AM = require('../modules/account-manager');
var moment 		= require('moment');
/*var MongoDB = require('mongodb').Db;
var Server 	= require('mongodb').Server;
var moment 	= require('moment');

var dbPort 		= 27137;
var dbHost 		= 'dbh13.mongolab.com';
var dbName 		= 'lunchmatch';

/* establish the database connection */

/*var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
db.open(function(e, d){
    if (e) {
        console.log(e);
    }	else{
        console.log('connected to database :: ' + dbName);
    }
}); */

/* GET home page. */
/*router.get('/', function(req, res){
    // check if the user's credentials are saved in a cookie //
    if (req.cookies.user == undefined || req.cookies.pass == undefined){
        res.render('login', { title: 'Hello - Please Login To Your Account' });
    }	else{
        // attempt automatic login //
        AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
            if (o != null){
                req.session.user = o;
                res.redirect('/home');
            }	else{
                res.render('login', { title: 'Hello - Please Login To Your Account' });
            }
        });
    }
});*/

router.get("/", function(req, res, next){
    res.render('index', { title: 'Lunch Match'});
});

router.get('/create', function(req, res, next){
    res.render('schedule', { title: 'Create Your Schedule'});
});

router.get('/how', function(req, res, next){
    res.render('howTo', { title: 'How To'});
})

router.get('/home', function(req, res, next){
    res.render('index', { title: 'Home' });
})

router.post('/create', function(req, res) {
    User.findOne({username: req.body.username}, function (e, o) {
        if (o == null) {
            User.findOne({username: req.body.username}, function (e, o) {
                if (o) {
                    callback('username-taken');
                } else {
                    AM.saltAndHash(req.body.password, function (hash) {
                        req.body.password = hash;
                        // append date stamp when record was created //
                        req.body.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                        var newUser = new User({
                            username: req.body.username,
                            password: req.body.password,
                            a1: req.body.a1,
                            a2: req.body.a2,
                            a3: req.body.a3,
                            a4: req.body.a4,
                            a5: req.body.a5,
                            a6: req.body.a6,
                            a7: req.body.a7
                        });
                        newUser.save(function (err, data) {
                            if (err) {
                                // If it failed, return error
                                console.log(err);
                            }
                            else {
                                res.redirect(301, "/");
                            }
                        });
                    });
                };
            });
        }
        else {
            User.findOne({username: req.body.username}, function(err, user) {
                if (err) throw err;
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (err) throw err;
                    console.log(req.body.password, isMatch);
                });
            });
        }
    });
});



    /*var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        a1: req.body.a1,
        a2: req.body.a2,
        a3: req.body.a3,
        a4: req.body.a4,
        a5: req.body.a5,
        a6: req.body.a6,
        a7: req.body.a7
    });

    newUser.save(function (err, doc) {
        if (err) {
            // If it failed, return error
            console.log(err);
        }
        else {
            res.redirect(301, "/");
        }
    });*/




/*router.post('/', function(req, res){
        AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
            if (!o){
                res.send(e, 400);
            }	else{
                req.session.user = o;
                if (req.param('remember-me') == 'true'){
                    res.cookie('user', o.user, { maxAge: 900000 });
                    res.cookie('pass', o.pass, { maxAge: 900000 });
                }
                res.send(o, 200);
            }
        });
    });*/

// logged-in user homepage //

/*app.get('/home', function(req, res) {
        if (req.session.user == null){
            // if user is not logged-in redirect back to login page //
            res.redirect('/');
        }   else{
            res.render('home', {
                title : 'Control Panel',
                countries : CT,
                udata : req.session.user
            });
        }
    });*/

/*route.post('/home', function(req, res){
        if (req.param('user') != undefined) {
            AM.updateAccount({
                user 		: req.param('user'),
                name 		: req.param('name'),
                email 		: req.param('email'),
                country 	: req.param('country'),
                pass		: req.param('pass')
            }, function(e, o){
                if (e){
                    res.send('error-updating-account', 400);
                }	else{
                    req.session.user = o;
                    // update the user's login cookies if they exists //
                    if (req.cookies.user != undefined && req.cookies.pass != undefined){
                        res.cookie('user', o.user, { maxAge: 900000 });
                        res.cookie('pass', o.pass, { maxAge: 900000 });
                    }
                    res.send('ok', 200);
                }
            });
        }	else if (req.param('logout') == 'true'){
            res.clearCookie('user');
            res.clearCookie('pass');
            req.session.destroy(function(e){ res.send('ok', 200); });
        }
    });*/

// creating new accounts //

/*router.get('/signup', function(req, res, next) {
    res.render('signup', {  title: 'Signup'});
});

router.post('/signup', function(req, res){
    console.log(req.body);
    var mynewcollection = db.collection('mynewcollection');
    mynewcollection.insert(req.body, function(err){
        if(err){
            res.send(err,400);
        }
        else{
            res.send('okay', 200);
        };

    });
    AM.addNewAccount({
        /*user 	: req.param('user'),
        email 	: req.param('email'),
        user 	: req.param('user'),
        pass	: req.param('pass')
        name 	: req.body.name,
        email 	: req.body.email,
        user 	: req.body.user,
        pass	: req.body.pass
    }, function(e){
        if (e){
            res.send(e, 400);
        }	else{
            res.send('ok', 200);
        }
    });
});*/


module.exports = router;
