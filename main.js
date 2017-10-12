const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const indexRoute = require('./src/routes/index');
const loginRoute = require('./src/routes/login');
const imageRoute = require('./src/routes/image');
const tagRoute = require('./src/routes/tags');

const app = express();

app.use('/resources', express.static('resources'));
app.use(express.json({}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(session({
    resave: true,
    saveUninitialized: true,
    maxAge: 24 * 60 * 60,
    store: new session.MemoryStore(),
    secret: 'asdajsdkjqojqwprjqwprojqwr'
}))

app.use('/', indexRoute);
app.use('/auth', loginRoute);
app.use('/images', imageRoute);
app.use('/tags', tagRoute);

app.listen(process.env.PORT || 3000);