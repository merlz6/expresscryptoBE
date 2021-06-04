const bcrypt = require('bcryptjs');
const express = require('express');
const users = express.Router();
const User = require('../models/users.js');




users.post('/', (req, res) => {

    req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
    );



    User.create(req.body, (err, createdUser) => {
        console.log(createdUser);
        res.redirect('/');
    });
});
module.exports = users;
