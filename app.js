const express = require('express');
const session = require('express-session');
require('dotenv').config();
const path = require('path');
const app = express();
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db/pool');
const passport = require('passport');
require('./config/passport')(passport);
const { getAllMessages } = require('./models/messageQueries');
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: false })); // parses form data
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const authRoute = require('./routes/authRoutes');
app.use(authRoute);
const messageRoute = require('./routes/messageRoutes');
app.use(messageRoute);

app.get('/', async (req, res) => {
  try{
    const messages = await getAllMessages();
    res.render('index', { user: req.user, messages: messages });
  } catch (error){
    console.error('Error fetching messages: ', error);
    res.status(500).send('Error fetching messages');
  }
});

// Temporary setup route - REMOVE AFTER USE
app.get('/setup-db', async (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'db/schema.sql'), 'utf8');
    await pool.query(schema);
    res.send('✅ Database tables created successfully! Now remove this route from app.js and redeploy.');
  } catch (error) {
    res.status(500).send('❌ Error: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});