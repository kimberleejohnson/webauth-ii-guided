const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// After npm install, require
const session = require('express-session'); 

// requiring storage library 
const KnexSessionStore = require('connect-session-knex')(session); 

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

// Create sessionConfig
const sessionConfig = {
  name: 'monkey', // by default it would be sid, but don't want hackers to know library
  secret: 'keep it secret, keep it safe!',
  resave: false, // if there are no changes to the session, don't save it
  saveUninitialized: true, // for GDPR compliance 
  cookie: {
    maxAge: 1000 * 60 * 10, // in milliseconds 
    secure: false, // send cookie only over https; set to true in production 
    httpOnly: true, // always set to true, it means JS can't access the cookie 
  },
  // Creating a new object for storing the user session 
  store: new KnexSessionStore({
    knex: require('../database/dbConfig.js'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 30
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());
// Tell server to use session middleware 
server.use(session(sessionConfig)); 

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);


server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
