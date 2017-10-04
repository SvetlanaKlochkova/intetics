const express = require("express");
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');

const app = express();

app.use('/resources', express.static('resources'));
app.use(bodyParser.json());

const sequelize = new Sequelize('intetics', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql'
});
sequelize
    .sync()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
let UserName = sequelize.define('user', {
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING
});
UserName.find({}).then((data) => {
    console.log(data);
});
app.get('/', function (req, res) {
    res.sendfile('authorization.html');
});
app.get('/users/:id', function (req, res) {
    UserName.find({ where: req.params }).then((data) => {
        console.log(data);
        res.end(JSON.stringify(data.dataValues));
    });
});
app.post('/checkuser', function (req, res) {
    res.sendfile();
});
app.listen(3000);
console.log("I work!");