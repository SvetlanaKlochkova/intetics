const Sequelize = require('sequelize');

const sequelize = new Sequelize('intetics', 'root', 'admin', {
    host: '127.0.0.1',
    dialect: 'mysql'
});



sequelize.define('user', {
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING
});

sequelize.define('image', {
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    tags: Sequelize.STRING
});

sequelize.define('tag', {
    name: Sequelize.STRING,
    count: Sequelize.BIGINT
})


sequelize
    .sync()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;