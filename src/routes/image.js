const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const db = require('../database');

router.get('/all', function (req, res) {
    var query = { offset: +req.query.offset, limit: +req.query.pageSize, order: [['createdAt', 'DESC']] }
    if (req.query.filter) {
        query.where = {
            $or: [
                { name: { $like: `${req.query.filter}%` } },
                { tags: { $like: `%${req.query.filter}%` } },
            ]
        }
    }
    db.models.image.findAll().then((data) => {
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
        fs.createReadStream(`./resources/images/default-image_450.png`).pipe(res);
    }
});



router.post('/new/', function (req, res) {
    // var imageDesc = JSON.parse(req.params.imageDescJson);
    db.models.tag.findAll({ where: { name: { $in: JSON.parse(req.headers['app-file_tags']) } } }).then(items => {
        items.forEach(item => {
            item.count++
            item.save();
        })
    })

    db.models.image.create({
        name: `${req.headers['app-file_name']}.${req.headers['app-file_type']}`,
        tags: req.headers['app-file_tags'],
        description: req.headers['app-file_description'],
    }).then(data => {
        res.send({ status: 'ok' })
        req.pipe(fs.createWriteStream(`./resources/images/${data.name}`));
    })


});

module.exports = router;