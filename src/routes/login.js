const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

const db = require('../database');

router.get('/login', function (req, res) {
    res.render('authorization');
});

router.get('/logout', function (req, res) {
    req.session.isAuthorized = false;
    req.session.save();
    res.redirect('/auth/login');
});

router.get('/registration', function (req, res) {
    res.render('registration');
});

router.get('/users/:id', function (req, res) {
    db.models.user.find({ where: req.params }).then((data) => {
        console.log(data);
        res.end(JSON.stringify(data.dataValues));
    });
});

router.post('/login', express.urlencoded({}), function (req, res) {
    const json = req.body;
    db.models.user.find({ where: { email: json.email, password: json.password } }).then((data) => {
        if (data) {
            let user = data
            req.session.isAuthorized = true;
            req.session.username = user.username;
            res.redirect('/');
        } else {
            req.session.isAuthorized = false;
            res.redirect('/auth/login');
        }
        req.session.save();
    });

});

router.post('/registration', bodyParser.urlencoded(), function (req, res) {
    const json = req.body;
    if (json.password != json.retypePass) {
        req.session.isAuthorized = false;
        res.redirect('/auth/registration');
    } else {
        db.models.user.create({
            username: json.username,
            email: json.email,
            password: json.password
        }).then((data) => {
            console.log(data);
            if (data) {
                let user = data;
                req.session.isAuthorized = true;
                req.session.username = user.username;
                res.redirect('/');
            } else {
                req.session.isAuthorized = false;
                res.redirect('/auth/registration');
            }
            req.session.save();
        });
    }
});

module.exports = router;