var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home' });
});

router.get('/create', function(req, res, next){
    res.render('schedule', { title: 'Create Your Schedule'});
});

router.get('/how', function(req, res, next){
    res.render('howTo', { title: 'How To'});
})

router.post('/create', function(req, res){
    console.log(req.body);
    var newUser = new User({
        /*name: {
            first: req.body.firstname,
            last: req.body.lastname
        },
        email: req.body.email,
        password: req.body.password,*/
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
    });

});


module.exports = router;
