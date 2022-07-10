const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/api/createNewUser', (req, res) => {
    console.log(req.body);
    const token = generateAccessToken({ username: req.body.username });
    res.json(token);

    console.log(token);
});

app.get('/api/userOrders', authenticateToken, (req, res) => {
    res.status(200).send('Authentication worked');
})

app.listen(3000, () => {
    console.log('App listening on port 3000');
})