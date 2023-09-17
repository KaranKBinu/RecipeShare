// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const connectToMongoDB = require('./models/usersdb');
const cookieParser = require('cookie-parser');
const MongoDBStore = require('connect-mongodb-session')(session);
// Create an Express application
const app = express();

// Configure middleware
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(session({ secret: 'eae05ffc836af49a9647a343d6e359d9e9bf18752a79872d2327da32d843c05b8eb40d74b6f80aaab78ce3fc4ef55443e8cb3fea3f82ab555b18c6e6379182b6', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


// Configure passport serialization and deserialization
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Import route files
const adminLoginRouter = require('./routes/adminlogin');
const adminDashboardRoutes = require('./routes/admin');
const indexRoutes = require('./routes/index');
const userloginRoutes = require('./routes/userlogin');
const userregisterRoutes = require('./routes/userregister');
const recipesPageRoutes = require('./routes/recipes');
const conatactPageRoutes = require('./routes/contact');
const aboutPageRoutes = require('./routes/about');
const profilePageRoutes = require('./routes/profile');
const uploadRecipePageRoutes = require('./routes/upload-recipe');
const userUpdateRouter = require('./routes/update-user');
const userDeleteRouter = require('./routes/delete-user');
const addUserRouter = require('./routes/add-user');
// Add routes for Google OAuth authentication
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Configure the Facebook OAuth strategy
require('./config/googleAuth')(passport);
require('./config/facebookAuth')(passport);

// Add routes for Facebook OAuth authentication
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
});

// Add a route for the homepage

app.use(cookieParser());
// Configure 'express-session'
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/admindb', // Your MongoDB connection URI
  collection: 'sessions', // Collection to store sessions
  expires: 1000 * 60 * 60 * 24 * 7, // Session expiration (7 days)
  autoRemove: 'interval',
  autoRemoveInterval: 10, // Interval in minutes to remove expired sessions
});

app.use(
  session({
    secret: 'eae05ffc836af49a9647a343d6e359d9e9bf18752a79872d2327da32d843c05b8eb40d74b6f80aaab78ce3fc4ef55443e8cb3fea3f82ab555b18c6e6379182b6', 
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use((req, res, next) => {
  // Custom middleware logic (e.g., logging)
  console.log(`Received ${req.method} request for ${req.url}`);
  next(); // Don't forget to call next to pass control to the next middleware/route handler.
});
// Add a route for logging out
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/userlogin');
  });
});
// Handle admin logout
app.get('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/adminlogin');
  });
});

// Use the routes

app.use('/', indexRoutes);
app.use('/userlogin', userloginRoutes);
app.use('/userregister', userregisterRoutes);
app.use('/about', aboutPageRoutes);
app.use('/contact', conatactPageRoutes);
app.use('/recipes', recipesPageRoutes);
app.use('/profile', profilePageRoutes);
app.use('/upload-recipe', uploadRecipePageRoutes);
app.use('/admin', adminDashboardRoutes);
app.use('/adminlogin', adminLoginRouter);
app.use('/admin/update-user', userUpdateRouter);
app.use('/admin/delete-user', userDeleteRouter);
app.use('/admin/add-user', addUserRouter);
// Starting the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Go To: http://127.0.0.1:3000/`);
});
