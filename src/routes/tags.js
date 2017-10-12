const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const db = require('../database');
tagName = (str) => `#${str}`.toLowerCase();

router.get('/top/:number', function (req, res) {
    db.models.tag.findAll({ limit: +(req.params.number || 25), order: [['count', 'DESC']] }).then((data) => {
        console.log(data);
        res.send(data.map(item => {
            return item.dataValues;
        }));
    });
});


router.get('/', function (req, res) {
    let name = tagName(`${req.query.name}%`);
    db.models.tag.findAll({ where: { name: { $like: name } } }).then((data) => {
        if (data.length == 0) {
            res.send([{ name: tagName(req.query.name) }]);
        } else {
            console.log(data);
            res.send(data.map(item => {
                return item.dataValues;
            }));
        }
    });
});

router.post('/:name', function (req, res) {
    let name = tagName(req.params.name);
    db.models.tag.findAll({ where: { name } }).then((data) => {
        if (data.length == 0) {
            db.models.tag.create({ name });
        }
    });
    res.send({ status: 'ok' });
});

router.get('/selected/:name', function (req, res) {
    let name = tagName(req.params.name);
    db.models.tag.findAll({ where: { name } }).then((data) => {
        if (data.length == 0) {
            db.models.tag.create({ name, count: 0 });
        } else {
            data.forEach(item => {
                item.count++;
                item.save();
            })
        }
    });
    res.send({ status: 'ok' });
});

router.get('/unselected/:name', function (req, res) {
    let name = tagName(req.params.name);
    db.models.tag.findAll({ where: { name } }).then((data) => {
        if (data.length == 0) {
            db.models.tag.create({ name, count: 0 });
        } else {
            data.forEach(item => {
                item.count++;
                item.save();
            })
        }
    });
    res.send({ status: 'ok' });
});

module.exports = router;