const express = require('express'); //Express
const app = express(); //Create app object
const mongoose = require('mongoose'); //bring in mongoose
const methodOverride = require('method-override'); //Method Override
require('dotenv').config()
const port = process.env.PORT || 3000; // Port Number
const DBURI = process.env.MONGOURI
const session = require('express-session');
const cryptoController = require('./controllers/crypto.js'); //Users
const userController = require('./controllers/users.js'); //Users
const User = require('./models/users.js'); // User Mode
const bcrypt = require('bcryptjs'); //bcrypt to encrypt passwords

const cors = require('cors')
const corsOptions = {

  origin: process.env.cor,
  optionsSuccessStatus:200

}

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions))
app.use(methodOverride('_method'));
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

mongoose.connect(DBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
    console.log('connected to mongo');
})



app.get('/', (req, res) => {
    res.send('home Page');
})
app.use('/crypto', cryptoController);
app.use('/users', userController);



//LOGIN - start sessions route
app.post('/session', (req, res) => {
    //See if user exists
    User.findOne({ username: req.body.username }, (err, foundUser) => {
        if (err) {
            //send error if error
            res.send(err);
        } else if (!foundUser) {
            //send to sign up if user doesn't exist
            res.redirect('/user/new');
        } else {
            //copmpare passwords
            if (bcrypt.compareSync(req.body.password, foundUser.password)) {
                //send to GM page
                req.session.currentUser = foundUser.username;
                // res.redirect('/games');
                res.json(req.session)
            } else {
                //tell them its a wrong password
                req.session.error = "Wrong Password"
                res.send(req.session.error);
            }
        }
    });
});

//destroy sessions route (LOGOUT)
app.delete('/sessions/', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// listen
app.listen(port, () => {
    console.log('listening on: ' + port);
});
