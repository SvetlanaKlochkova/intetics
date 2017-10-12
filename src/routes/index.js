const express = require('express');
const app = express();
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.isAuthorized) {
        res.render('images', {
            username: req.session.username
        });
    } else {
        res.redirect('/auth/login');
    }
});

module.exports = router;