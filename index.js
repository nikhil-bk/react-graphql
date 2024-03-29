const express = require('express');
const bodyParser=require("body-parser")
const models = require('./server/models');
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./server/services/auth');
const MongoStore = require('connect-mongo');
const schema = require('./server/schema/schema');
const cors = require('cors')
require('dotenv').config()

// Create a new Express application
const app = express();


app.use(cors({
  origin:process.env.FRONTEND_ORIGIN_VERCEL,
  credentials:true
}))

// Replace with your mongoLab URI
const MONGO_URI = process.env.MONGO_URL_DB
if (!MONGO_URI) {
  throw new Error('You must provide a MongoLab URI');
}

// Mongoose's built in promise library is deprecated, replace it with ES2015 Promise
mongoose.Promise = global.Promise;

// Connect to the mongoDB instance and log a message
// on success or failure
mongoose.connect(MONGO_URI,{
  authSource:"admin",
  dbName:"User"
});
mongoose.connection
    .once('open', () => console.log('Connected to MongoLab instance.'))
    .on('error', error => console.log('Error connecting to MongoLab:', error));

// Configures express to use sessions.  This places an encrypted identifier
// on the users cookie.  When a user makes a request, this middleware examines
// the cookie and modifies the request object to indicate which user made the request
// The cookie itself only contains the id of a session; more data about the session
// is stored inside of MongoDB.
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'aaabbbccc',

  store: MongoStore.create({ mongoUrl: MONGO_URI })
}));


// Passport is wired into express as a middleware. When a request comes in,
// Passport will examine the request's session (as set by the above config) and
// assign the current user to the 'req.user' object.  See also servces/auth.js
app.use(passport.initialize());
app.use(passport.session());

// Instruct Express to pass on any request made to the '/graphql' route
// to the GraphQL instance.
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))
// app.get("/",(req,res)=>{
//   res.send("Welcome to GRAPHQL route over to /graphql")
// })

app.listen(process.env.PORT||4000, () => {
  console.log('Listening');
});
