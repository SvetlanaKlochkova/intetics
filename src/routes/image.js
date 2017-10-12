const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const db = require('../database');

router.get('/all', function (req, res) {
    db.models.image.findAll({ offset: +req.query.offset, limit: +req.query.pageSize, order: [['createdAt', 'DESC']] }).then((data) => {
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

router.post('/new/:imageDescJson', function (req, res) {
    var imageDesc = JSON.parse(req.params.imageDescJson);
    db.models.image.create({
        name: `${imageDesc.name}.${imageDesc.type}`,
        tags: JSON.stringify(imageDesc.tags),
        description: imageDesc.description,
    }).then(data => {
        res.send({ status: 'ok' })
        req.pipe(fs.createWriteStream(`./resources/images/${data.name}`));
    })


});

module.exports = router;