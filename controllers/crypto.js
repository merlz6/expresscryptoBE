const express = require('express');
const app = express.Router();
const rp = require('request-promise');


const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next();
    } else {
        res.redirect('/');
    }
}

//enter auth function when front end goes up
app.get('/', (req, res) => {

  const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
      'start': '1',
      'limit': '25',
      'convert': 'USD'
    },
    headers: {
      'X-CMC_PRO_API_KEY': process.env.APIKEY
    },
    json: true,
    gzip: true
  };

  rp(requestOptions).then(response => {
    res.json(response);
  }).catch((err) => {
    console.log('API call error:', err.message);
  });

})


//pull single currency quote route
app.get('/quote/:id', (req, res) => {
  const requestOptions = {
    method: 'GET',
    uri: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${req.params.id}`,
    qs: {
      'convert': 'USD'
    },
    headers: {
      'X-CMC_PRO_API_KEY': process.env.APIKEY
    },
    json: true,
    gzip: true
  }

  rp(requestOptions).then(response => {
    res.json(response);
  }).catch((err) => {
    console.log('API call error:', err.message);
  });

})






module.exports = app
