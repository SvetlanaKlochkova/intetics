const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const db = require('../database');

router.get('/all', function (req, res) {
    var query = { order: [['createdAt', 'DESC']] }
    if (req.query.offset) {
        query.offset = +req.query.offset;
    }
    if (req.query.pageSize) {
        query.limit = +req.query.pageSize;
    }
    if (req.query.filter) {
        query.where = {
            $or: [
                { name: { $like: `${req.query.filter}%` } },
                { tags: { $like: `%${req.query.filter}%` } },
            ]
        }
    }
    db.models.image.findAll(query).then((data) => {
        console.log(data);
        res.send(data.map(item => {
            return item.dataValues;
        }));
    });
});

router.get('/get/:name', function (req, res) {
    try {
        fs.createReadStream(`./resources/images/${req.params.name}`).pipe(res);
    } catch (x) {
        fs.createReadStream(`./resources/img/default.png`).pipe(res);
    }
});

tagName = (str) => {
    if (str.startsWith('#')) {
        return str.toLowerCase();
    } else {
        return `#${str}`.toLowerCase();
    }
}

function touchTags(tags) {
    tags.forEach(name => {
        db.models.tag.findAll({ where: { name: tagName(name) } }).then((data) => {
            if (data.length == 0) {
                db.models.tag.create({ name: tagName(name), count: 1 });
            } else {
                data.forEach(item => {
                    item.count++;
                    item.save();
                })
            }
        });
    });
}

router.post('/new/', function (req, res) {
    // var imageDesc = JSON.parse(req.params.imageDescJson);
    touchTags(JSON.parse(req.headers['app-file_tags']));
    const fileName = `${req.headers['app-file_name']}.${req.headers['app-file_type']}`;
    const file = fs.createWriteStream(`./resources/images/${fileName}`);
    db.models.image.create({
        name: `${fileName}`,
        tags: req.headers['app-file_tags'],
        description: req.headers['app-file_description'],
    }).then(data => {

        req.pipe(file);
        file.on('finish', ev => {
            res.send({ status: 'ok' })
        })
        file.on('error', err => {
            res.send(err);
        })
    })


});

module.exports = router;